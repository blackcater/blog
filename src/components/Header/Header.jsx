import React, { PureComponent } from 'react';
import Media from 'react-media';
import PropTypes from 'prop-types';
import { Link, StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import cls from 'classnames';
import pick from 'utils/pick';
import { getAttribute, setAttribute } from 'utils/attribute';

import { Icon } from 'components/common';

import './style.less';

const DEFAULT_THEME = 'light';
let $html;

if (typeof window !== 'undefined') {
  $html = document.getElementsByTagName('html')[0];
}

class Header extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
      theme: $html
        ? getAttribute($html, 'theme', DEFAULT_THEME)
        : DEFAULT_THEME,
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

  toggleMenu = () => {
    this.setState({ showMenu: !this.state.showMenu });
  };

  render() {
    const { theme, showMenu } = this.state;
    const { title, shadow, maxWidth } = this.props;

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
            <div className={cls(['header', shadow && 'header--shadow'])}>
              <div className="header__content" style={{ maxWidth }}>
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
                      <Media query="(max-width: 768px)">
                        {matches =>
                          matches && (
                            <li onClick={this.toggleMenu}>
                              {showMenu ? (
                                <Icon icon="close" size={20} />
                              ) : (
                                <Icon icon="menu" size={20} />
                              )}
                            </li>
                          )
                        }
                      </Media>
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
                        <Link to="/">
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
              <Media query="(max-width: 768px)">
                {matches => (
                  <nav
                    className="header__menu"
                    style={{ display: matches && showMenu ? 'block' : 'none' }}
                  >
                    <ul>
                      <li>
                        <Link to="/series">合集</Link>
                      </li>
                      <li>
                        <Link to="/archive">归档</Link>
                      </li>
                    </ul>
                  </nav>
                )}
              </Media>
            </div>
          </>
        )}
      />
    );
  }
}

Header.propTypes = {
  title: PropTypes.node,
  shadow: PropTypes.bool,
  maxWidth: PropTypes.number,
  children: PropTypes.node,
};

Header.defaultProps = {
  shadow: true,
  maxWidth: 1224,
};

export default Header;
