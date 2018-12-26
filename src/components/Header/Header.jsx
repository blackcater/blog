import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link, StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import pick from 'utils/pick';
import { getAttribute, setAttribute } from 'utils/attribute';

import { Icon } from 'components/common';

import './style.less';

const $html = document.getElementsByTagName('html')[0];

class Header extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      theme: getAttribute($html, 'theme', 'light'),
    };
  }

  toggleTheme = t => {
    const themes = ['light', 'dark'];
    const theme = getAttribute($html, 'theme', this.state.theme);

    if (theme === t) return;

    const newTheme =
      themes.indexOf(t) !== -1
        ? t
        : themes[(themes.indexOf(theme) + 1) % themes.length];

    setAttribute($html, 'theme', newTheme);

    this.setState({ theme: newTheme });
  };

  render() {
    const { theme } = this.state;
    const { title } = this.props;

    return (
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
                  <div className="logo">
                    <Link to="/">Blog</Link>
                  </div>
                  {title && <div className="title">{title || 'Home'}</div>}
                </div>
                <div className="header__content__right">
                  <nav className="header__menu">
                    <ul>
                      <li>
                        <Link to="/series">合集</Link>
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
                      <li onClick={this.toggleTheme}>
                        <Icon
                          icon={
                            theme === 'light' ? 'moon-outline' : 'sun-outline'
                          }
                          size={20}
                        />
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
                    <Link to="/archive">归档</Link>
                  </li>
                </ul>
              </nav>
            </div>
          </>
        )}
      />
    );
  }
}

Header.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

export default Header;
