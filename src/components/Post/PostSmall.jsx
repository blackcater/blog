import React from 'react';
import { graphql, Link } from 'gatsby';
import PropTypes from 'prop-types';

import pick from 'utils/pick';

import './post-small.less';
import Img from 'gatsby-image';

const PostSmall = ({ post }) => (
  <div className="post-small">
    <div className="post-small__cover">
      <Link to={pick(post, 'fields.slug')}>
        <Img fluid={pick(post, 'frontmatter.cover.childImageSharp.fluid')} />
      </Link>
    </div>
    <div className="post-small__content">
      <Link className="post-small__content__top" to={pick(post, 'fields.slug')}>
        <div className="post-small__title">
          {pick(post, 'frontmatter.title')}
        </div>
        <div className="post-small__excerpt">{pick(post, 'excerpt')}</div>
      </Link>
      <div className="post-small__content__bottom">
        <div className="post-small__author">
          <Link to={`/author/${pick(post, 'frontmatter.author.id')}`}>
            {pick(post, 'frontmatter.author.nickname')}
          </Link>
        </div>
        <div className="post-small__external">
          <div className="date">{pick(post, 'frontmatter.date')}</div>
          <div className="ttr">{pick(post, 'timeToRead')}min read</div>
        </div>
      </div>
    </div>
  </div>
);

PostSmall.propTypes = {
  post: PropTypes.object,
};

PostSmall.defaultProps = {
  post: {},
};

export const postSmallQuery = graphql`
  fragment PostSmall on MarkdownRemark {
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
            fluid(maxWidth: 500, maxHeight: 500, cropFocus: CENTER) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
      date: date(formatString: "MMM D")
      author {
        id
        nickname
      }
    }
  }
`;

export default PostSmall;
