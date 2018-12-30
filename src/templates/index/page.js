import React from 'react';
import Media from 'react-media';
import { graphql } from 'gatsby';

import Layout from 'components/Layout';
import Slider from 'components/Slider';
import { PostBig } from 'components/Post';
import { Parallel } from 'components/common';
import pick from 'utils/pick';

import './style.less';

export default ({ data }) => {
  const posts = pick(data, 'posts.edges').map(x => x.node);

  console.dir(
    pick(data, 'posts.edges')
      .slice(0, 3)
      .map(x => x.node)
  );

  return (
    <Layout>
      <Slider list={posts.slice(0, 3)} />
      <Media query="(max-width: 1000px)">
        {matches =>
          matches ? (
            <Parallel className="index__parallel">
              <Parallel.Line>
                <div className="index__title">POSTS</div>
                {posts.slice(3).map(node => (
                  <PostBig key={node.id} post={node} />
                ))}
                <div className="index__title">SERIES</div>
                <div>haha</div>
              </Parallel.Line>
            </Parallel>
          ) : (
            <Parallel className="index__parallel">
              <Parallel.Line style={{ marginRight: 64 }}>
                <div className="index__title">POSTS</div>
                {posts.slice(3).map(node => (
                  <PostBig key={node.id} post={node} />
                ))}
              </Parallel.Line>
              <Parallel.Line width={328} />
            </Parallel>
          )
        }
      </Media>
    </Layout>
  );
};

export const query = graphql`
  query IndexPageQuery(
    $posts: [String]
    $series: [String]
    $authors: [String]
  ) {
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
    series: allSeriesJson(filter: { id: { in: $series } }) {
      edges {
        node {
          id
          name
          description
          cover {
            ... on File {
              childImageSharp {
                resize(width: 200, height: 265, cropFocus: CENTER) {
                  src
                }
              }
            }
          }
        }
      }
    }
    authors: allAuthorJson(filter: { id: { in: $authors } }) {
      edges {
        node {
          id
          nickname
          slogan
          avatar {
            ... on File {
              childImageSharp {
                resize(width: 80, height: 80, cropFocus: CENTER) {
                  src
                }
              }
            }
          }
        }
      }
    }
  }
`;
