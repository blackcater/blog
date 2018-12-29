import React from 'react';
import { graphql } from 'gatsby';

export default () => {
  return <div>page list</div>;
};

export const query = graphql`
  query PostListPageQuery {
    posts: allMarkdownRemark(
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      edges {
        node {
          id
        }
      }
    }
  }
`;
