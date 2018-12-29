import React from 'react';
import { graphql } from 'gatsby';

export default () => {
  return <div>series list</div>;
};

export const query = graphql`
  query SeriesListPageQuery {
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
