import React from 'react';
import Media from 'react-media';
import { Link, graphql } from 'gatsby';
import Img from 'gatsby-image';

import Layout from 'components/Layout';
import Slider from 'components/Slider';
import { PostBig } from 'components/Post';
import { Parallel } from 'components/common';
import pick from 'utils/pick';

import './style.less';

function AuthorList({ list, cover }) {
  return (
    <div className="index__author-list">
      <div className="index__author-list__header">
        <div className="index__author-list__title">Popular Authors</div>
        <Img
          className="index__author-list__cover"
          fluid={pick(cover, 'childImageSharp.fluid')}
        />
      </div>
      <div className="index__author-list__content">
        {list.map(author => (
          <Link key={author.id} to={`/author/${author.id}`}>
            <div className="author">
              <img
                className="author__avatar"
                src={pick(author, 'avatar.childImageSharp.resize.src')}
                alt={author.id}
              />
              <div className="author__wrapper">
                <div className="author__title">{author.nickname}</div>
                <div className="author__desc">{author.slogan}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function SeriesList({ list, cover }) {
  return (
    <div className="index__series-list">
      <div className="index__series-list__header">
        <div className="index__series-list__title">Popular Series</div>
        <Img
          className="index__series-list__cover"
          fluid={pick(cover, 'childImageSharp.fluid')}
        />
      </div>
      <div className="index__series-list__content">
        {list.map(series => (
          <Link key={series.id} to={`/series/${series.id}`}>
            <div className="series">
              <img
                className="series__cover"
                src={pick(series, 'cover.childImageSharp.resize.src')}
                alt={series.id}
              />
              <div className="series__wrapper">
                <div className="series__title">{series.name}</div>
                <div className="series__desc">{series.description}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function TagList({ list }) {
  return (
    <div className="index__tag-list">
      <div className="index__tag-list__header">Popular Tags</div>
      <div className="index__tag-list__content">
        {list.map((tag, index) => (
          <div className="tag" key={tag}>
            <div className="index">
              {index + 1 < 10 ? `0${index + 1}` : index + 1}
            </div>
            <div className="title">
              <Link to={`/tag/${tag}`}>{tag}</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ({ data, pageContext }) => {
  const posts = pick(data, 'posts.edges').map(x => x.node) || [];
  const series = pick(data, 'series.edges').map(x => x.node) || [];
  const authors = pick(data, 'authors.edges').map(x => x.node) || [];
  const tags = pageContext.tags || [];

  console.dir(data);
  console.dir(pageContext);

  return (
    <Layout className="index">
      <Slider list={posts.slice(0, 3)} />
      <div className="index__separator" />
      <Media query="(max-width: 1000px)">
        {matches =>
          matches ? (
            <Parallel className="index__parallel">
              <Parallel.Line>
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
                {posts.slice(3).map(node => (
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
