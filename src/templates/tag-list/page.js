import React from 'react';
import { graphql } from 'gatsby';

export default () => {
  return <div>tag list</div>;
};

export const query = graphql`
  query TagListPageQuery {
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
