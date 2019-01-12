import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './style.less';

class Search extends PureComponent {
  render() {
    const { style, className, loading, ...props } = this.props;

    return (
      <div className="search">
        <input {...props} />
        {loading && <div className="search__loading-line" />}
      </div>
    );
  }
}

Search.propTypes = {
  loading: PropTypes.bool,
};

Search.defaultProps = {};

export default Search;
