import React from 'react';
import Media from 'react-media';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import pick from 'utils/pick';

import Layout from 'components/Layout';
import Pagination from 'components/Pagination';
import { PostBig, PostSmall } from 'components/Post';

import './style.less';

export default ({ data, pageContext }) => {
  const { series } = data;
  const posts = pick(data, 'posts.edges').map(x => x.node) || [];
  const header = posts[0];
  const list = posts.slice(1);

  return (
    <Layout title={series.name} className="series-page">
      <div className="series-page__content">
        <div className="series-page__posts">
          <Media query="(max-width: 768px)">
            {matches =>
              matches && (
                <div className="series-page__section">
                  <Img
                    className="series-page__logo"
                    fluid={pick(series, 'cover.childImageSharp.fluid')}
                  />
                  <div className="series-page__title">{series.name}</div>
                  <div className="series-page__desc">{series.description}</div>
                </div>
              )
            }
          </Media>
          <div className="series-page__header-post">
            {posts[0] && <PostBig post={header} />}
          </div>
          <div className="series-page__post-list">
            {list.map(post => (
              <PostSmall key={post.id} post={post} />
            ))}
          </div>
          <Pagination {...pageContext} />
        </div>
        <Media query="(max-width: 768px)">
          {matches =>
            !matches && (
              <div className="series-page__section">
                <Img
                  className="series-page__logo"
                  fluid={pick(series, 'cover.childImageSharp.fluid')}
                />
                <div className="series-page__title">{series.name}</div>
                <div className="series-page__desc">{series.description}</div>
              </div>
            )
          }
        </Media>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query SeriesPageQuery($posts: [String], $series: String) {
    posts: allMarkdownRemark(
      filter: { id: { in: $posts } }
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      edges {
        node {
          ...PostBig
        }
      }
    }
    series: seriesJson(id: { eq: $series }) {
      id
      name
      description
      cover {
        ... on File {
          childImageSharp {
            fluid(maxWidth: 120, maxHeight: 160) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`;
