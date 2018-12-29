import React from 'react';
import { graphql } from 'gatsby';

export default () => {
  return <div>post</div>;
};

export const query = graphql`
  query PostPageQuery {
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
