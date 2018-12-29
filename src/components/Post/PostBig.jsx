import React, { PureComponent } from 'react';
import Img from 'gatsby-image';
import PropTypes from 'prop-types';
import pick from 'utils/pick';

import './post-big.less';

class PostBig extends PureComponent {
  render() {
    const { post } = this.props;

    return (
      <div className="post-big">
        <Img
          fluid={pick(post, 'node.frontmatter.header.childImageSharp.fluid')}
        />
        <div className="post-big__title">
          {pick(post, 'node.frontmatter.title')}
        </div>
        <div className="post-big__excerpt">{pick(post, 'node.excerpt')}</div>
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

export default PostBig;
