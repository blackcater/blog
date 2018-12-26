import React from 'react';
import PropTypes from 'prop-types';
import { Link, StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import pick from 'utils/pick';

import { Icon } from 'components/common';

import './style.less';

const Header = ({ title, children }) => (
  <StaticQuery
    query={graphql`
      query HeaderComponentQuery {
        avatar: file(relativePath: { eq: "avatar.png" }) {
          childImageSharp {
            fixed(width: 64, height: 64) {
              ...GatsbyImageSharpFixed
            }
          }
        }
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
              {title && <div className="title">{title || 'Home'}</div>}
            </div>
            <div className="header__content__right">
              <nav className="header__menu">
                <ul>
                  <li>
                    <Link to="/series">合集</Link>
                  </li>
                  <li>
                    <Link to="/tag">标签</Link>
                  </li>
                  <li>
                    <Link to="/archive">归档</Link>
                  </li>
                </ul>
              </nav>
              <div className="header__content__custom">
                <ul>
                  <li>
                    <Link to="/search">
                      <Icon icon="search" size={20} />
                    </Link>
                  </li>
                  <li>
                    <Link to="/resume">
                      <Img
                        style={{ width: 32, height: 32, borderRadius: 16 }}
                        fixed={pick(data, 'avatar.childImageSharp.fixed')}
                      />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <nav className="header__menu">
            <ul>
              <li>
                <Link to="/series">合集</Link>
              </li>
              <li>
                <Link to="/tag">标签</Link>
              </li>
              <li>
                <Link to="/archive">归档</Link>
              </li>
            </ul>
          </nav>
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
