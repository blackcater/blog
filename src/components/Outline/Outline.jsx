import React, { PureComponent } from 'react';
import { on, off } from 'dom-lib';

import { Icon, Popover } from 'components/common';

import './style.less';

class Outline extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      maxHeight: this._getMaxHeight(),
    };
  }

  componentDidMount() {
    on(window, 'resize', this._handleResize);
  }

  componentWillUnmount() {
    off(window, 'resize', this._handleResize);
  }

  _handleResize = () => {
    this.setState({ maxHeight: this._getMaxHeight() });
  };

  _getMaxHeight = () => {
    return typeof window !== 'undefined' ? window.innerHeight - 200 : 200;
  };

  _handleGotoAnchor = ({ value }) => {
    window.location.hash = `#${value}`;
  };

  render() {
    const { maxHeight } = this.state;
    const { list } = this.props;

    if (maxHeight < 0) return null;

    return (
      <Popover
        namespace="outline"
        placement="top-start"
        reference={<Icon icon="menu" />}
      >
        <div
          className="outline__anchor"
          style={{ maxHeight, overflow: 'auto' }}
        >
          <div className="outline__anchor-title">Outline</div>
          <div className="outline__anchor-list">
            {list.map(({ value, depth }) => (
              <div
                key={`${depth}-${value}`}
                className="outline__anchor-item"
                data-depth={depth}
                onMouseDown={() => this._handleGotoAnchor({ depth, value })}
              >
                {value}
              </div>
            ))}
          </div>
        </div>
      </Popover>
    );
  }
}

Outline.propTypes = {};

Outline.defaultProps = {};

export default Outline;
