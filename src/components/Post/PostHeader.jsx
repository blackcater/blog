import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class PostHeader extends PureComponent {
  render() {
    return <div />;
  }
}

PostHeader.propTypes = {
  post: PropTypes.object,
};

PostHeader.defaultProps = {
  post: {},
};

export default PostHeader;
