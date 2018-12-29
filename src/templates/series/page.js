import React from 'react';
import { graphql } from 'gatsby';

export default () => {
  return <div>series</div>;
};

export const query = graphql`
  query SeriesPageQuery {
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
