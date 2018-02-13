/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const fs = require('fs')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.modifyWebpackConfig = ({ config }) => {
  config.merge({
    resolve: {
      alias: {
        styles: path.resolve(__dirname, './src/styles'),
        images: path.resolve(__dirname, './src/images'),
        utils: path.resolve(__dirname, './src/utils'),
        components: path.resolve(__dirname, './src/components'),
      },
      root: path.resolve(__dirname, './src'),
      extensions: ['', '.js', '.jsx', '.json'],
    },
  })

  return config
}

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  if (node.internal.type === 'MarkdownRemark') {
    const { createNodeField } = boundActionCreators
    const slug = createFilePath({ node, getNode, basePath: 'pages' })

    createNodeField({
      node,
      name: 'slug',
      value: slug,
    })
  }
}

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators

  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                cover
                header {
                  relativePath
                }
                date
                edate: date(formatString: "MMMM DD, YYYY")
                tags
                category
              }
              tableOfContents
              timeToRead
              wordCounts: wordCount {
                words
              }
              headings {
                value
                depth
              }
              excerpt
              html
            }
          }
        }
      }
    `)
      .then(({ data }) => {
        const { edges } = data.allMarkdownRemark
        const headerPromises = []

        edges.forEach(({ node }) => {
          const { frontmatter: { header } } = node
          const useHeader = !!header
          const headerGlob = `**/${(header || {}).relativePath || ''}*`

          headerPromises.push(
            graphql(`
            query PostHeader {
              header: imageSharp(id: { glob: "${headerGlob}" }) @include(if: ${useHeader}) {
                sizes(maxWidth: 1200) {
                  base64
                  aspectRatio
                  src
                  srcSet
                  sizes
                }
              }
            }
          `)
          )
        })

        Promise.all(headerPromises)
          .then(headers => headers.map(x => x.data.header))
          .then(headers => {
            const posts = edges.map(({ node }, index) => {
              const { frontmatter: { title, cover } } = node

              if (!cover && !headers[index]) {
                throw new Error(
                  `"${title}" should have a \`cover\` or \`header\` frontmatter`
                )
              }

              return {
                ...node,
                frontmatter: {
                  ...node.frontmatter,
                  cover: cover || headers[index].sizes.src,
                  header: headers[index],
                },
              }
            })
            const weappPosts = posts.slice(0, 10)
            const tagMap = {}
            const archiveMap = {}
            const categoryMap = {}

            posts.forEach((post, index) => {
              const {
                fields: { slug },
                frontmatter: { date, tags, category },
              } = post

              // 每个帖子的详情页
              createPage({
                path: slug,
                component: path.resolve(__dirname, 'src/templates/post.js'),
                context: {
                  // 你可以在 graphql 中使用该参数
                  slug,
                  post,
                  nextPost: index === 0 ? null : posts[index - 1],
                  prevPost:
                    index === posts.length - 1 ? null : posts[index + 1],
                  tags: tags.map(tag => ({
                    name: tag,
                    slug: `/tag/${tag}/`,
                  })),
                  category: {
                    name: category,
                    slug: `/category/${category}/`,
                  },
                },
              })

              // 分类
              if (category) {
                categoryMap[category] = (categoryMap[category] || []).concat(
                  post
                )
              }

              // 标签
              if (tags) {
                ;(tags || []).forEach(tag => {
                  tagMap[tag] = (tagMap[tag] || []).concat(post)
                })
              }

              // 归档
              if (date) {
                const date$ = new Date(date)
                const year = date$.getUTCFullYear()
                const month = date$.getUTCMonth() + 1
                const day = date$.getUTCDay()

                archiveMap.default = (archiveMap.default || []).concat(post)
                archiveMap[year] = archiveMap[year] || {}
                archiveMap[year][month] = archiveMap[year][month] || {}
                archiveMap[year][month][day] = (
                  archiveMap[year][month][day] || []
                ).concat(post)
              }
            })

            // 生成 weapp 帖子数据资源文件
            createWeappPostJSFile(weappPosts)
            // 生成标签分页
            createTagPagination(tagMap, createPage)
            // 生成归档分页
            createArchivePagination(archiveMap, createPage)
            // 生成目录分页
            createCategoryPagination(categoryMap, createPage)

            resolve()
          })
          .catch(reject)
      })
      .catch(reject)
  })
}

/**
 * 标签分页
 *
 * @param tagMap
 * @param createPage
 */
function createTagPagination(tagMap, createPage) {
  const tagList = Object.keys(tagMap)
  const tags = tagList
    .sort((tag1, tag2) => tagMap[tag1].length < tagMap[tag2].length)
    .map(tag => ({ name: tag, num: tagMap[tag].length, slug: `/tag/${tag}/` }))

  // tag 首页
  createPage({
    path: '/tag/',
    component: path.resolve(__dirname, 'src/templates/tag-index.js'),
    context: {
      // 你可以在 graphql 中使用该参数
      tags,
    },
  })

  // 分页
  tags.forEach(tag => {
    createPagination({
      data: tagMap[tag.name],
      base: `/tag/${tag.name}/`,
      size: 20,
      component: path.resolve(__dirname, 'src/templates/tag.js'),
      context: {
        tag,
      },
      createPage,
    })
  })
}

/**
 * 归档分页
 *
 * @param archiveMap
 * @param createPage
 */
function createArchivePagination(archiveMap, createPage) {
  const { default: posts } = archiveMap

  // 分页
  createPagination({
    data: posts,
    base: '/archive/',
    size: 20,
    component: path.resolve(__dirname, 'src/templates/archive.js'),
    context: {},
    createPage,
  })
}

/**
 * 类目分页
 *
 * @param categoryMap
 * @param createPage
 */
function createCategoryPagination(categoryMap, createPage) {
  const categories = Object.keys(categoryMap)

  categories.forEach(category => {
    createPagination({
      data: categoryMap[category],
      base: `/category/${category}/`,
      size: 20,
      component: path.resolve(__dirname, 'src/templates/category.js'),
      context: {
        category,
      },
      createPage,
    })
  })
}

// 分页通用方法
function createPagination(opts = {}) {
  const options = {
    data: [],
    base: '/',
    size: 20,
    component: null,
    context: {},
    ...opts,
  }
  const { data, base, size, component, context, createPage } = options

  if (!component) return
  if (!createPage) return

  // 共多少页面
  const total = Math.ceil(data.length / size)

  for (let i = 0; i < total; i++) {
    const current = i + 1
    const path = `${base}${current}`

    if (current === 1) {
      createPage({
        path: base,
        component,
        context: {
          ...context,
          isFirstPage: current === 1,
          isLastPage: current === total,
          totalPage: total,
          pageIndex: current,
          pageSize: size,
          pageData: data.slice(
            size * (current - 1),
            Math.min(size * current, data.length)
          ),
        },
      })
    }

    createPage({
      path,
      component,
      context: {
        ...context,
        isFirstPage: current === 1,
        isLastPage: current === total,
        totalPage: total,
        pageIndex: current,
        pageSize: size,
        pageData: data.slice(
          size * (current - 1),
          Math.min(size * current, data.length)
        ),
      },
    })
  }
}

/**
 *  创建 小程序 需使用的 js 数据文件
 */
function createWeappPostJSFile(posts) {
  const date = new Date()
  const str = `/**
 * Generated by Gatsby
 *
 * Powered by blackcater
 *
 * @date ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}
 */
export default [${posts
    .slice(0, 10)
    .map(post => JSON.stringify(post))
    .join(',')}]`
  const filePath = path.resolve(__dirname, 'public/index.js')

  fs.writeFileSync(filePath, str)
}
