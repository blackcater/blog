import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class PostSmall extends PureComponent {
  render() {
    return <div />;
  }
}

PostSmall.propTypes = {
  post: PropTypes.object,
};

PostSmall.defaultProps = {
  post: {},
};

export default PostSmall;
