import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

function useNativeLink(to) {
  return typeof to === 'string' && /^http/.test(to);
}

const LinkAdvance = ({ to, children, ...rest }) => {
  return useNativeLink(to) ? (
    <a href={to} {...rest}>
      {children}
    </a>
  ) : (
    <Link to={to} {...rest}>
      {children}
    </Link>
  );
};

LinkAdvance.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

LinkAdvance.defaultProps = {
  to: '/',
};

export default LinkAdvance;
