import React, { PureComponent } from 'react';
import { Link, graphql } from 'gatsby';
import Img from 'gatsby-image';
import PropTypes from 'prop-types';
import pick from 'utils/pick';

import './post-big.less';

class PostBig extends PureComponent {
  render() {
    const { post } = this.props;

    return (
      <div className="post-big">
        <Link to={pick(post, 'fields.slug')}>
          <Img fluid={pick(post, 'frontmatter.cover.childImageSharp.fluid')} />
          <div className="post-big__title">
            {pick(post, 'frontmatter.title')}
          </div>
          <div className="post-big__excerpt">{pick(post, 'excerpt')}</div>
        </Link>
        <div className="post-big__footer">
          <div className="post-big__author">
            <Link to={`/author/${pick(post, 'frontmatter.author.id')}`}>
              <img
                className="post-big__author__avatar"
                src={pick(
                  post,
                  'frontmatter.author.avatar.childImageSharp.resize.src'
                )}
                alt={pick(post, 'frontmatter.author.nickname')}
              />
            </Link>
            <div className="post-big__author__content">
              <div className="post-big__author__nickname">
                <Link to={`/author/${pick(post, 'frontmatter.author.id')}`}>
                  {pick(post, 'frontmatter.author.nickname')}
                </Link>
              </div>
              <div className="post-big__author__external">
                <div className="date">{pick(post, 'frontmatter.date')}</div>
                <div className="ttr">{pick(post, 'timeToRead')}min read</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PostBig.propTypes = {
  post: PropTypes.object,
};

PostBig.defaultProps = {
  post: {},
};

export const postBigQuery = graphql`
  fragment PostBig on MarkdownRemark {
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
`;

export default PostBig;
