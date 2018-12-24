import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';

import './style.less';

const Header = ({ title, children }) => (
  <StaticQuery
    query={graphql`
      query HeaderComponentQuery {
        site {
          siteMetadata {
            title
            description
            website
            siteUrl
            nickname
            slogan
            email
          }
        }
      }
    `}
    render={data => (
      <>
        <div className="header">
          <div className="header__content">
            <div className="header__content__left">
              <div className="logo">Blog</div>
              <div className="title">{title || 'Home'}</div>
            </div>
            <div className="header__content__right" />
          </div>
        </div>
        {children}
      </>
    )}
  />
);

Header.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

export default Header;
