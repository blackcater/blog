import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

function useNativeLink(to) {
  return typeof to === 'string' && /^http/.test(to);
}

const LinkAdvance = ({ to, ...rest }) => {
  return useNativeLink(to) ? (
    <a href={to} {...rest} />
  ) : (
    <Link to={to} {...rest} />
  );
};

LinkAdvance.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

LinkAdvance.defaultProps = {
  to: '/',
};

export default LinkAdvance;
