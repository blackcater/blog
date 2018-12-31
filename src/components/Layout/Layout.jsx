import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import cls from 'classnames';

import Header from 'components/Header';
import Footer from 'components/Footer';

import 'styles/index.less';

import './style.less';

class Layout extends PureComponent {
  render() {
    const { className, children, ...rest } = this.props;

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
        render={() => (
          <div className={cls(['layout', className])}>
            <Header {...rest} />
            {children}
            <Footer />
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
