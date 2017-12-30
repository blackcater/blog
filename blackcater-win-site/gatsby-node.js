/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require("path")
const { createFilePath } = require("gatsby-source-filesystem")

exports.modifyWebpackConfig = ({ config }) => {
  config.merge({
    resolve: {
      alias: {
        styles: path.resolve(__dirname, "./src/styles"),
        components: path.resolve(__dirname, "./src/components"),
      },
      root: path.resolve(__dirname, "./src"),
      extensions: ["", ".js", ".jsx", ".json"],
    },
  })

  return config
}

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  if (node.internal.type === "MarkdownRemark") {
    const { createNodeField } = boundActionCreators
    const slug = createFilePath({ node, getNode, basePath: "pages" })

    createNodeField({
      node,
      name: "slug",
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
                date
                edate: date(formatString: "MMMM DD, YYYY")
                tags
                category
              }
              tableOfContents
              timeToRead
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
        const tagMap = {}
        const archiveMap = {}
        const categoryMap = {}

        data.allMarkdownRemark.edges.forEach(({ node }) => {
          const {
            fields: { slug },
            frontmatter: { date, tags, category },
          } = node

          // 每个帖子的详情页
          createPage({
            path: slug,
            component: path.resolve(__dirname, "src/templates/post.js"),
            context: {
              // 你可以在 graphql 中使用该参数
              slug,
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
            categoryMap[category] = (categoryMap[category] || []).concat(node)
          }

          // 标签
          if (tags) {
            ;(tags || []).forEach(tag => {
              tagMap[tag] = (tagMap[tag] || []).concat(node)
            })
          }

          // 归档
          if (date) {
            const date$ = new Date(date)
            const year = date$.getUTCFullYear()
            const month = date$.getUTCMonth() + 1
            const day = date$.getUTCDay()

            archiveMap.default = (archiveMap.default || []).concat(node)
            archiveMap[year] = archiveMap[year] || {}
            archiveMap[year][month] = archiveMap[year][month] || {}
            archiveMap[year][month][day] = (
              archiveMap[year][month][day] || []
            ).concat(node)
          }
        })

        createTagPagination(tagMap, createPage)
        createArchivePagination(archiveMap, createPage)
        createCategoryPagination(categoryMap, createPage)

        resolve()
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
    path: "/tag/",
    component: path.resolve(__dirname, "src/templates/tag-index.js"),
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
      component: path.resolve(__dirname, "src/templates/tag.js"),
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
    base: "/archive/",
    size: 20,
    component: path.resolve(__dirname, "src/templates/archive.js"),
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
      component: path.resolve(__dirname, "src/templates/category.js"),
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
    base: "/",
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
