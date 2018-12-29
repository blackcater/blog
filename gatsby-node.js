/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');
const store = {
  // 帖子
  posts: [],
  postsMap: {},
  // 标签
  tags: [],
  tagsMap: {},
  // 系列
  series: [],
  seriesMap: {},
  // 作者
  authors: [],
  authorsMap: {},
};

// custom webpack configuration
exports.onCreateWebpackConfig = ({ stage, actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
  });
};

// slug
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({
      node,
      getNode,
      basePath: 'content/posts',
      trailingSlash: false,
    });

    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};

// create pages
exports.createPages = ({ page, graphql, actions }) => {
  const { createPage } = actions;
  const dateSorter = `sort: { fields: frontmatter___date, order: DESC }`;
  const draftFilter =
    process.env.NODE_ENV === 'production'
      ? `filter: { frontmatter: { draft: { ne: true } } }`
      : '';

  return new Promise((resolve, reject) => {
    graphql(`
      query allPostsQuery {
        allMarkdownRemark(
          ${draftFilter}
          ${dateSorter}
        ) {
          edges {
            node {
              id
              fields {
                slug
              }
              frontmatter {
                cover {
                  id
                }
                date
                author {
                  id
                }
                tags
                series {
                  id
                }
              }
            }
          }
        }
      }
    `)
      .then(({ data, errors }) => {
        if (errors) {
          console.error(errors);

          return reject('出错啦');
        }

        const {
          allMarkdownRemark: { edges: rawPosts },
        } = data;

        store.posts = rawPosts.map(({ node }) => node);

        if (store.posts.some(post => !post.frontmatter.cover)) {
          return reject('[POST] 每篇文章必须包含封面（cover）字段');
        }

        if (store.posts.some(post => !post.frontmatter.author)) {
          return reject('[POST] 每篇文章必须包含作者（author）字段');
        }

        console.log(require('util').inspect(store.posts));

        resolve();
      })
      .catch(reject);
    // const blogPostTemplate = path.resolve(`src/templates/blog-post.js`)
    // // Query for markdown nodes to use in creating pages.
    // resolve(
    //   graphql(
    //     `
    //       {
    //         allMarkdownRemark(limit: 1000) {
    //           edges {
    //             node {
    //               frontmatter {
    //                 path
    //               }
    //             }
    //           }
    //         }
    //       }
    //     `
    //   ).then(result => {
    //     if (result.errors) {
    //       reject(result.errors)
    //     }
    //
    //     // Create pages for each markdown file.
    //     result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    //       const path = node.frontmatter.path
    //       createPage({
    //         path,
    //         component: blogPostTemplate,
    //         // In your blog post template's graphql query, you can use path
    //         // as a GraphQL variable to query for data from the markdown file.
    //         context: {
    //           path,
    //         },
    //       })
    //     })
    //   })
    // )
  });
};
