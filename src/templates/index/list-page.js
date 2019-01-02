import React from 'react';
import { graphql } from 'gatsby';
import pick from 'utils/pick';

import Media from 'react-media';
import Parallel from 'components/common/Parallel';
import PostBig from 'components/Post/PostBig';
import Layout from 'components/Layout';

import { SeriesList, AuthorList, TagList } from './page';

import './style.less';

export default ({ data, pageContext }) => {
  const posts = pick(data, 'posts.edges').map(x => x.node) || [];
  const series = pick(data, 'series.edges').map(x => x.node) || [];
  const authors = pick(data, 'authors.edges').map(x => x.node) || [];
  const tags = pageContext.tags || [];

  return (
    <Layout className="index-page">
      <div className="index-page__title">FEATURED</div>
      <Media query="(max-width: 1000px)">
        {matches =>
          matches ? (
            <Parallel className="index-page__parallel">
              <Parallel.Line>
                {posts.map(node => (
                  <PostBig key={node.id} post={node} />
                ))}
                <SeriesList list={series} cover={data.seriesCover} />
                <TagList list={tags} />
                <AuthorList list={authors} cover={data.authorsCover} />
              </Parallel.Line>
            </Parallel>
          ) : (
            <Parallel className="index-page__parallel">
              <Parallel.Line style={{ marginRight: 64 }}>
                {posts.map(node => (
                  <PostBig key={node.id} post={node} />
                ))}
              </Parallel.Line>
              <Parallel.Line width={328}>
                <SeriesList list={series} cover={data.seriesCover} />
                <TagList list={tags} />
                <AuthorList list={authors} cover={data.authorsCover} />
              </Parallel.Line>
            </Parallel>
          )
        }
      </Media>
    </Layout>
  );
};

export const query = graphql`
  query PostListPageQuery(
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
    seriesCover: file(relativePath: { eq: "cover1.png" }) {
      ... on File {
        childImageSharp {
          fluid(
            maxHeight: 118
            traceSVG: { color: "#d7efee" }
            duotone: { highlight: "#d7efee", shadow: "#192550" }
          ) {
            ...GatsbyImageSharpFluid_tracedSVG
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
    authorsCover: file(relativePath: { eq: "cover2.png" }) {
      ... on File {
        childImageSharp {
          fluid(
            maxHeight: 118
            traceSVG: { color: "#D1EFFB" }
            duotone: { highlight: "#0ec4f1", shadow: "#192550", opacity: 25 }
          ) {
            ...GatsbyImageSharpFluid_tracedSVG
          }
        }
      }
    }
  }
`;
