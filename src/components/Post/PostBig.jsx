import React, { PureComponent } from 'react';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import PropTypes from 'prop-types';
import pick from 'utils/pick';

import './post-big.less';

class PostBig extends PureComponent {
  render() {
    const { post } = this.props;

    return (
      <div className="post-big">
        <Img fluid={pick(post, 'frontmatter.cover.childImageSharp.fluid')} />
        <div className="post-big__title">{pick(post, 'frontmatter.title')}</div>
        <div className="post-big__excerpt">{pick(post, 'excerpt')}</div>
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
    excerpt
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
      date: date(formatString: "MMMM DD, YYYY")
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
