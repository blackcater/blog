/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const fs = require('fs')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

// 修改 webpack
exports.modifyWebpackConfig = ({ config }) => {
  config.merge({
    resolve: {
      alias: {
        components: path.resolve(__dirname, './src/components'),
        partials: path.resolve(__dirname, './src/partials'),
        styles: path.resolve(__dirname, './src/styles'),
        utils: path.resolve(__dirname, './src/utils'),
      },
      root: path.resolve(__dirname, './src'),
      extensions: ['', '.js', '.jsx', '.json'],
    },
  })

  return config
}

// 创建 node
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

// 创建页面
exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators
  const dateSorter = `sort: { fields: [frontmatter___date], order: DESC }`
  const draftFilter =
    process.env.NODE_ENV === 'production'
      ? `, filter: { frontmatter: { draft: { eq: false } } }`
      : ''

  return new Promise((resolve, reject) => {
    graphql(`
      {
        rawPosts: allMarkdownRemark(${dateSorter}${draftFilter}) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                header {
                  ... on File {
                    childImageSharp {
                      sizes(maxWidth: 1200) {
                        base64
                        aspectRatio
                        src
                        srcSet
                        sizes
                      }
                    }
                  }
                }
                tags
                category
              }
            }
          }
        }
        miniRawPosts: allMarkdownRemark(${dateSorter}${draftFilter}, skip: 0, limit: 10) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                header {
                  ... on File {
                    childImageSharp {
                      sizes(maxWidth: 1200) {
                        base64
                        aspectRatio
                        src
                        srcSet
                        sizes
                      }
                    }
                  }
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
      .then(({ data, errors }) => {
        if (errors) {
          reject('occur some errors ')

          return
        }

        const {
          rawPosts: { edges: rawPosts },
          miniRawPosts: { edges: miniRawPosts },
        } = data
        const posts = []
        const miniPosts = []

        if (rawPosts.some(({ node }) => !node.frontmatter.header)) {
          reject(`some post hasn't a \`header\` frontmatter`)

          return
        }

        // 小程序帖子数据
        miniRawPosts.forEach(({ node }) => {
          const { frontmatter: { header } } = node
          const isCover = typeof header === 'string'

          miniPosts.push({
            ...node,
            frontmatter: {
              ...node.frontmatter,
              cover: isCover ? header : header.childImageSharp.sizes.src,
            },
          })
        })

        // gatsby
        rawPosts.forEach(({ node }) => posts.push(node))

        const tagMap = {}
        const categoryMap = {}

        // index.html
        createPage({
          path: '/',
          component: path.resolve(__dirname, 'src/templates/index.js'),
          context: {},
        })

        // 遍历所有文章页面
        posts.forEach((post, index) => {
          const { fields: { slug }, frontmatter: { tags, category } } = post

          // 每个帖子的详情页
          createPage({
            path: slug,
            component: path.resolve(__dirname, 'src/templates/post.js'),
            context: {
              // 你可以在 graphql 中使用该参数
              curr: slug,
              next: index !== 0 ? posts[index - 1].fields.slug : null,
              prev:
                index !== posts.length - 1
                  ? posts[index + 1].fields.slug
                  : null,
              tags: tags.map(tag => ({
                key: tag,
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
            categoryMap[category] = (categoryMap[category] || []).concat(post)
          }

          // 标签
          if (tags) {
            ;(tags || []).forEach(tag => {
              tagMap[tag] = (tagMap[tag] || []).concat(post)
            })
          }
        })

        // 生成归档分页
        createArchivePagination(posts, createPage)
        // 生成目录分页
        createCategoryPagination(categoryMap, createPage)
        // 生成标签分页
        createTagPagination(tagMap, createPage)
        // 生成 weapp 帖子数据资源文件
        createWeappPostJSFile(miniPosts)

        resolve()
      })
      .catch(reject)
  })
}

/**
 * 归档分页
 *
 * @param posts
 * @param createPage
 */
function createArchivePagination(posts, createPage) {
  // 分页
  createPagination({
    base: '/archive/',
    total: posts.length,
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
  const categoryList = Object.keys(categoryMap)
  const categories = categoryList.map(category => ({
    name: category,
    num: categoryMap[category].length,
    slug: `/category/${category}/`,
  }))

  createPagination({
    base: '/category/',
    total: categories.reduce((category, num) => num + category.num, 0),
    size: 20,
    component: path.resolve(__dirname, 'src/templates/category-index.js'),
    context: { categories },
    createPage,
  })

  categories.forEach(category => {
    createPagination({
      base: category.slug,
      total: category.num,
      size: 5,
      component: path.resolve(__dirname, 'src/templates/category.js'),
      context: {
        category: category.name,
      },
      createPage,
    })
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
    context: { tags },
  })

  // 分页
  tags.forEach(tag => {
    createPagination({
      base: tag.slug,
      total: tag.num,
      size: 5,
      component: path.resolve(__dirname, 'src/templates/tag.js'),
      context: {
        tag: tag.name,
      },
      createPage,
    })
  })
}

// 分页通用方法
function createPagination(opts = {}) {
  const options = {
    base: '/',
    total: 0,
    size: 5,
    component: null,
    context: {},
    ...opts,
  }
  const { base, total, size, component, context, createPage } = options

  if (!component) return
  if (!createPage) return

  // 共多少页面
  const totalPage = Math.ceil(total / size)

  for (let i = 0; i < totalPage; i++) {
    const current = i + 1
    const path = `${base}${current}`

    if (current === 1) {
      createPage({
        path: base,
        component,
        context: {
          ...context,
          hasPrevPage: current !== 1,
          hasNextPage: current !== totalPage,
          totalPage,
          pageIndex: current,
          pageSize: size,
          skip: (current - 1) * size,
          limit: size,
        },
      })
    }

    createPage({
      path,
      component,
      context: {
        ...context,
        hasPrevPage: current !== 1,
        hasNextPage: current !== totalPage,
        totalPage,
        pageIndex: current,
        pageSize: size,
        skip: (current - 1) * size,
        limit: size,
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
