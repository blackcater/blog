import React, { PureComponent } from 'react';
import { on, off, animation, scrollTop } from 'dom-lib';
import cls from 'classnames';

import { Icon } from 'components/common';

import './style.less';

class Affix extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
    };
  }

  componentDidMount() {
    on(window, 'scroll', this._handleScroll);
  }

  componentWillUnmount() {
    off(window, 'scroll', this._handleScroll);
  }

  _handleScroll = () => {
    if (this.waiting) return;

    this.waiting = true;

    animation.requestAnimationFramePolyfill(() => {
      const scrollY = window.scrollY || window.pageYOffset;
      const boundary = 0;

      if (scrollY > boundary && !this.state.show) {
        this.setState({ show: true }, () => (this.waiting = false));

        return;
      }

      if (scrollY <= boundary && this.state.show) {
        this.setState({ show: false }, () => (this.waiting = false));

        return;
      }

      this.waiting = false;
    });
  };

  _handleScrollToTop = () => {
    scrollTop(window, 0);
  };

  render() {
    const { show } = this.state;

    return (
      <div
        className={cls(['affix', show && 'affix--show'])}
        onClick={this._handleScrollToTop}
      >
        <Icon icon="arrow-up" />
      </div>
    );
  }
}

export default Affix;
