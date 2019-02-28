import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import { getAttribute, setAttribute } from 'utils/attribute';
import cls from 'classnames';

import Header from 'components/Header';
import Footer from 'components/Footer';
import ThemeContext, { THEMES, DEFAULT_THEME } from 'components/ThemeContext';

import 'styles/index.less';
import './style.less';

let $html;

if (typeof window !== 'undefined') {
  $html = document.getElementsByTagName('html')[0];
}

class Layout extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { theme: DEFAULT_THEME };
  }

  _toggleTheme = t => {
    const themes = THEMES;
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
    const { className, headerClassName, headerStyle, children, ...rest } = this.props;

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
  children: PropTypes.node.isRequired,
};

export default Layout;
