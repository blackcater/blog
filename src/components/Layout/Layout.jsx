import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';

import 'styles/index.less';

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query LayoutComponentQuery {
        site {
          siteMetadata {
            title
            description
          }
        }
      }
    `}
    render={data => <div>{children}</div>}
  />
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
