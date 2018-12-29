import React from 'react';
import Media from 'react-media';
import { StaticQuery, graphql } from 'gatsby';
import pick from '../../utils/pick';

import Layout from '../../components/Layout';
import Slider from '../../components/Slider';
import { PostBig } from '../../components/Post';
import { Parallel } from '../../components/common';

import './index.less';

const IndexPage = () => (
  <StaticQuery
    query={graphql`
      query IndexStaticPageQuery {
        slider: allMarkdownRemark(
          limit: 3
          skip: 0
          sort: { fields: frontmatter___date, order: DESC }
        ) {
          edges {
            node {
              id
              frontmatter {
                title
                cover {
                  ... on File {
                    childImageSharp {
                      fluid(maxWidth: 1200, maxHeight: 500) {
                        ...GatsbyImageSharpFluid
                      }
                    }
                  }
                }
              }
            }
          }
        }
        posts: allMarkdownRemark(
          limit: 5
          skip: 3
          sort: { fields: frontmatter___date, order: DESC }
        ) {
          edges {
            node {
              id
              excerpt
              frontmatter {
                title
                date: date(formatString: "MMMM DD, YYYY")
                cover {
                  ... on File {
                    childImageSharp {
                      fluid(maxWidth: 1200, maxHeight: 500) {
                        ...GatsbyImageSharpFluid
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `}
    render={data => {
      console.dir(data);

      return (
        <Layout>
          <Slider list={pick(data, 'slider.edges')} />
          <Media query="(max-width: 1000px)">
            {matches =>
              matches ? (
                <Parallel className="index__parallel">
                  <Parallel.Line>
                    <div className="index__title">POSTS</div>
                    {pick(data, 'posts.edges').map(edge => (
                      <PostBig key={pick(edge, 'node.id')} post={edge} />
                    ))}
                    <div className="index__title">SERIES</div>
                    <div>haha</div>
                  </Parallel.Line>
                </Parallel>
              ) : (
                <Parallel className="index__parallel">
                  <Parallel.Line style={{ marginRight: 64 }}>
                    <div className="index__title">POSTS</div>
                    {pick(data, 'posts.edges').map(edge => (
                      <PostBig key={pick(edge, 'node.id')} post={edge} />
                    ))}
                  </Parallel.Line>
                  <Parallel.Line width={328} />
                </Parallel>
              )
            }
          </Media>
        </Layout>
      );
    }}
  />
);

export default IndexPage;
