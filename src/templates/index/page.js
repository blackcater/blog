import React from 'react';
import { graphql } from 'gatsby';

export default () => {
  return <div>index</div>;
};

export const query = graphql`
  query IndexPageQuery {
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
