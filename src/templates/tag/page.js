import React from 'react';
import { graphql } from 'gatsby';

export default () => {
  return <div>tag</div>;
};

export const query = graphql`
  query TagPageQuery {
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
