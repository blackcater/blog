import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import { on, off, getOffset, animation } from 'dom-lib';
import getDisplayName from 'utils/getDisplayName';

import './style.less';

class Parallel extends PureComponent {
  constructor(props) {
    super(props);

    const components = this.props.children.filter(
      x => getDisplayName(x) === 'ParallelLine'
    );

    this.state = {
      translateList: components.map(comp => ({
        x: 0,
        y: 0,
        height: 0,
        width: comp.props.width || 0,
        fixed: false,
      })),
    };
    this.$parallel = React.createRef();
    this.waiting = false;
  }

  componentDidMount() {
    on(window, 'scroll', this._handleScroll);
    on(window, 'resize', this._handleResize);
  }

  componentWillUnmount() {
    off(window, 'scroll', this._handleScroll);
    off(window, 'resize', this._handleResize);
  }

  _handleScroll = () => {
    if (this.waiting) return;

    this.waiting = true;

    animation.requestAnimationFramePolyfill(() => {
      if (!this.$parallel.current) return;

      const { offset } = this.props;
      const $parallel = this.$parallel.current;
      const $parallelLines = Array.from(
        $parallel.getElementsByClassName('parallel__line')
      ).map(x => x.children[0]);
      const { top: pTop, height: pHeight } = getOffset($parallel);

      const scrollY = window.scrollY || window.pageYOffset + offset.top;
      const windowH = window.innerHeight - offset.top - offset.bottom;
      const translateList = [];

      for (let i = 0, len = $parallelLines.length; i < len; i++) {
        const $line = $parallelLines[i];
        const { width, height } = getOffset($line);
        const { width: w, height: h, x, y } = this.state.translateList[i];

        translateList[i] = { width: w || width, height: h || height };

        if (scrollY <= pTop) {
          translateList[i] = {
            ...translateList[i],
            x: 0,
            y: 0,
            fixed: false,
          };

          continue;
        }

        if (scrollY + windowH >= pTop + pHeight) {
          translateList[i] = {
            ...translateList[i],
            x: 0,
            y: pHeight - height,
            fixed: false,
          };

          continue;
        }

        if (scrollY < pTop + y) {
          translateList[i] = {
            ...translateList[i],
            x: 0,
            y: scrollY - pTop,
            fixed: 'top',
          };

          continue;
        }

        if (scrollY + windowH > pTop + y + height) {
          translateList[i] = {
            ...translateList[i],
            x: 0,
            y: scrollY + windowH - pTop - height,
            fixed: 'bottom',
          };

          continue;
        }

        translateList[i] = { ...translateList[i], x, y, fixed: false };
      }

      this.setState({ translateList }, () => (this.waiting = false));
    });
  };

  _handleResize = () => {};

  render() {
    const { translateList } = this.state;
    const { offset, className, children } = this.props;
    const lines = children.filter(x => getDisplayName(x) === 'ParallelLine');

    return (
      <div ref={this.$parallel} className={cls(['parallel', className])}>
        {lines.map((child, index) => {
          const { x, y, width, fixed } = translateList[index];
          const wrapperStyle = {};

          if (fixed) {
            wrapperStyle.position = 'fixed';
            wrapperStyle[fixed] = offset[fixed];
            wrapperStyle.width = width;
          } else {
            wrapperStyle.transform = `translate3d(${x}px, ${y}px, 0px)`;
          }

          return React.cloneElement(child, {
            key: index,
            wrapperStyle,
          });
        })}
      </div>
    );
  }
}

Parallel.propTypes = {
  offset: PropTypes.object,
};

Parallel.defaultProps = {
  offset: { top: 0, bottom: 0 },
};

export default Parallel;
