/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require('path');

// custom webpack configuration
exports.onCreateWebpackConfig = ({ stage, actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
  });
};

// create pages
exports.createPages = ({ page, graphql, actions }) => {
  const { createPage, deletePage } = actions;

  return new Promise((resolve, reject) => {
    resolve();
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
