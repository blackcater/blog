import React from 'react';
// import { graphql } from 'gatsby';
import algoliasearch from 'algoliasearch';

import Layout from 'components/Layout';

import './search.less';

const client = algoliasearch(
  process.env.GATSBY_ALGOLIA_APPID,
  process.env.GATSBY_ALGOLIA_SEARCHKEY
);
const postsDB = client.initIndex('posts');
const authorDB = client.initIndex('author');
const tagsDB = client.initIndex('tag');
const seriesDB = client.initIndex('series');

export default ({ data }) => {
  console.dir(
    postsDB.search({ query: 'blackcater', hitsPerPage: 2 }).then(res => console.dir(res))
  );

  return (
    <Layout className="search-page">
      <div className="search-page__content">haha</div>
    </Layout>
  );
};

// export const query = graphql`
//    query SearchPageQuery {
//    }
// `;
