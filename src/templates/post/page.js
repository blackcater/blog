import React from 'react';
import { Link, graphql } from 'gatsby';
import Img from 'gatsby-image';
import pick from 'utils/pick';

import Layout from 'components/Layout';

import './style.less';

export default ({ data, pageContext }) => {
  const { post, prevPost, nextPost } = data;
  const tags = pick(post, 'frontmatter.tags') || [];
  const series = pick(post, 'frontmatter.series');

  console.dir(data);
  console.dir(pageContext);

  return (
    <Layout
      className="post-page"
      title={series && <Link to={`/series/${series.id}`}>{series.name}</Link>}
    >
      <div className="post-page__header">
        <div className="post-page__header__content">
          {tags.length > 0 && (
            <div className="post-page__header__tags">
              {tags.map(tag => (
                <span key={tag}>
                  <Link to={`/tag/${tag}`}>{tag}</Link>
                </span>
              ))}
            </div>
          )}
          <div className="post-page__header__title">
            {pick(post, 'frontmatter.title')}
          </div>
          <div className="post-page__header__author">
            <Link to={`/author/${pick(post, 'frontmatter.author.id')}`}>
              <img
                className="avatar"
                src={pick(
                  post,
                  'frontmatter.author.avatar.childImageSharp.resize.src'
                )}
                alt={pick(post, 'frontmatter.author.nickname')}
              />
            </Link>
            <div className="content">
              <div className="nickname">
                <Link to={`/author/${pick(post, 'frontmatter.author.id')}`}>
                  {pick(post, 'frontmatter.author.nickname')}
                </Link>
              </div>
              <div className="desc">
                <div className="date">{pick(post, 'frontmatter.date')}</div>
                <div className="ttr">{pick(post, 'timeToRead')}min read</div>
              </div>
            </div>
          </div>
        </div>
        <div className="post-page__header__cover">
          <Img fluid={pick(post, 'frontmatter.cover.childImageSharp.fluid')} />
        </div>
      </div>
      <div
        className="post-page__content"
        dangerouslySetInnerHTML={{ __html: pick(post, 'html') }}
      />
    </Layout>
  );
};

export const query = graphql`
  fragment PostPageDetail on MarkdownRemark {
    id
    fields {
      slug
    }
    excerpt
    timeToRead
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
      date: date(formatString: "MMM D")
      author {
        id
        nickname
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

  query PostPageQuery($id: String, $prevSlug: String, $nextSlug: String) {
    prevPost: markdownRemark(fields: { slug: { eq: $prevSlug } }) {
      ...PostPageDetail
    }
    nextPost: markdownRemark(fields: { slug: { eq: $nextSlug } }) {
      ...PostPageDetail
    }
    post: markdownRemark(id: { eq: $id }) {
      id
      fields {
        slug
      }
      html
      excerpt
      headings {
        value
        depth
      }
      timeToRead
      wordCount {
        paragraphs
        sentences
        words
      }
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
        date: date(formatString: "MMM D")
        author {
          id
          nickname
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
        tags
        series {
          id
          name
        }
      }
    }
  }
`;
