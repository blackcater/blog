import React from 'react';
import { graphql } from 'gatsby';

export default () => {
  return <div>index</div>;
};

export const query = graphql`
  query ArchiveListPageQuery {
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
