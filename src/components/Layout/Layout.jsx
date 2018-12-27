import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';

import Header from 'components/Header';

import 'styles/index.less';

import './style.less';

class Layout extends PureComponent {
  render() {
    const { children, ...rest } = this.props;

    return (
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
        render={data => (
          <div className="layout">
            <Header {...rest} />
            {children}
          </div>
        )}
      />
    );
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
