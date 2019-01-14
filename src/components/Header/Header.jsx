import React, { PureComponent } from 'react';
import Media from 'react-media';
import PropTypes from 'prop-types';
import { Link, StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import { on, off, addStyle, animation } from 'dom-lib';
import cls from 'classnames';
import pick from 'utils/pick';

import ThemeContext from 'components/ThemeContext';
import { Icon } from 'components/common';

import './style.less';

class Header extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      hideMenu: false,
      showMenu: false,
      waiting: false,
    };

    this.$header = null;
    this.lastScrollY = 0;
  }

  componentDidMount() {
    const { autoHidden } = this.props;

    if (autoHidden) {
      on(window, 'scroll', this._handleScroll);
    }
  }

  componentWillUnmount() {
    off(window, 'scroll', this._handleScroll);
  }

  _handleScroll = () => {
    if (this.waiting) return;

    this.waiting = true;

    animation.requestAnimationFramePolyfill(() => {
      const { hideMenu } = this.state;
      const scrollY = window.scrollY || window.pageYOffset;
      const delta = scrollY > this.lastScrollY;

      this.lastScrollY = scrollY;

      if (delta && !hideMenu) {
        if (this.$header) {
          addStyle(this.$header, { transform: 'translate(0, -200%)' });
        }

        this.setState({ hideMenu: true }, () => (this.waiting = false));

        return;
      }

      if (!delta && hideMenu) {
        if (this.$header) {
          addStyle(this.$header, { transform: 'translate(0, 0)' });
        }

        this.setState({ hideMenu: false }, () => (this.waiting = false));

        return;
      }

      this.waiting = false;
    });
  };

  toggleMenu = () => {
    this.setState({ showMenu: !this.state.showMenu });
  };

  render() {
    const { showMenu } = this.state;
    const { title, shadow, maxWidth, toggleTheme } = this.props;
    const theme = this.context;

    return (
      <StaticQuery
        query={graphql`
          query HeaderComponentQuery {
            avatar: file(relativePath: { eq: "avatar.png" }) {
              childImageSharp {
                fixed(width: 64, height: 64, cropFocus: CENTER) {
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
          <div
            ref={ref => (this.$header = ref)}
            className={cls(['header', shadow && 'header--shadow'])}
          >
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
                    <li onClick={toggleTheme}>
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
                      <Link to="/archive">归档</Link>
                    </li>
                  </ul>
                </nav>
              )}
            </Media>
          </div>
        )}
      />
    );
  }
}

Header.contextType = ThemeContext;

Header.propTypes = {
  title: PropTypes.node,
  shadow: PropTypes.bool,
  maxWidth: PropTypes.number,
  children: PropTypes.node,
  autoHidden: PropTypes.bool,
};

Header.defaultProps = {
  shadow: true,
  autoHidden: false,
  maxWidth: 1224,
};

export default Header;
