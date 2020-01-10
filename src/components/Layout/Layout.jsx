import React, { PureComponent } from 'react';
import Snakke from 'react-snakke';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import { getAttribute, setAttribute } from 'utils/attribute';
import cls from 'classnames';

import Header from 'components/Header';
import Footer from 'components/Footer';
import ThemeContext, {
  THEMES,
  DEFAULT_THEME,
  supportDarkMode,
} from 'components/ThemeContext';

import 'styles/index.less';
import './style.less';

let $html;

if (typeof window !== 'undefined') {
  $html = document.getElementsByTagName('html')[0];
}

class Layout extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      theme: supportDarkMode ? 'dark' : DEFAULT_THEME,
    };
  }

  componentDidMount() {
    if (supportDarkMode) {
      this._setTheme('dark');
    }
  }

  _setTheme = theme => {
    setAttribute($html, 'theme', theme);

    this.setState({ theme });
  };

  _toggleTheme = t => {
    const themes = THEMES;
    const theme = getAttribute($html, 'theme', this.state.theme);

    if (theme === t) return;

    this._setTheme(
      themes.indexOf(t) !== -1
        ? t
        : themes[(themes.indexOf(theme) + 1) % themes.length]
    );
  };

  render() {
    const { theme } = this.state;
    const {
      className,
      headerClassName,
      headerStyle,
      children,
      snakke,
      ...rest
    } = this.props;

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
          <ThemeContext.Provider value={theme}>
            <div className={cls(['layout', className])}>
              <Header
                className={headerClassName}
                style={headerStyle}
                toggleTheme={this._toggleTheme}
                {...rest}
              />
              {snakke && (
                <Snakke
                  shadow
                  color={theme === 'light' ? '#65c0a3' : '#4c8170'}
                  height="3px"
                  opacity=".8"
                />
              )}
              <div className="layout__content">{children}</div>
              <Footer />
            </div>
          </ThemeContext.Provider>
        )}
      />
    );
  }
}

Layout.propTypes = {
  snakke: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

Layout.defaultProps = {
  snakke: false,
};

export default Layout;
