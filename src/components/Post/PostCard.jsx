import React from 'react';
import { Link, graphql } from 'gatsby';
import Img from 'gatsby-image';
import pick from 'utils/pick';

import './post-card.less';

const PostCard = ({ post }) => {
  return (
    <div className="post-card">
      <div className="post-card__header">
        <div className="post-card__avatar">
          <Link to={`/author/${pick(post, 'frontmatter.author.id')}`}>
            <Img
              fluid={pick(
                post,
                'frontmatter.author.avatar.childImageSharp.fluid'
              )}
            />
          </Link>
        </div>
        <div className="post-card__info">
          <div className="post-card__nickname">
            <Link to={`/author/${pick(post, 'frontmatter.author.id')}`}>
              {pick(post, 'frontmatter.author.nickname')}
            </Link>
          </div>
          <div className="post-card__external">
            <div className="date">{pick(post, 'frontmatter.date')}</div>
            <div className="ttr">{pick(post, 'timeToRead')}</div>
          </div>
        </div>
      </div>
      <Link to={pick(post, 'fields.slug')}>
        <div className="post-card__cover">
          <Img fluid={pick(post, 'frontmatter.cover.childImageSharp.fluid')} />
        </div>
        <div className="post-card__title">
          {pick(post, 'frontmatter.title')}
        </div>
        <div className="post-card__excerpt">{pick(post, 'excerpt')}</div>
      </Link>
    </div>
  );
};

export const postCardQuery = graphql`
  fragment PostCard on MarkdownRemark {
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
              fluid(maxWidth: 80, maxHeight: 80) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
`;

export default PostCard;
