import React from 'react';
import { graphql } from 'gatsby';

import Layout from 'components/Layout';
import Pagination from 'components/Pagination';
import { PostBig, PostSmall } from 'components/Post';

import './style.less';

export default ({ data, pageContext }) => {
  const { tag } = pageContext;

  console.dir(pageContext);

  return (
    <Layout title={tag} className="tag-page">
      <div className="tag-page__section" />
      <div className="tag-page__list">
        <Pagination {...pageContext} />
      </div>
    </Layout>
  );
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
