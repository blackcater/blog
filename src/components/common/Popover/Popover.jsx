import React, { Component, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import PopperJS, { Placement } from 'popper.js';
import cls from 'classnames';

const $root = document.getElementById('popover-root');

class Popper extends PureComponent {
  constructor(props) {
    super(props);

    const { className } = props;

    this.$container = document.createElement('div');
    this.$container.className = cls(['popover__popper', className]);
  }

  componentDidMount() {
    $root && $root.appendChild(this.$container);
  }

  componentWillUnmount() {
    $root && $root.removeChild(this.$container);
  }

  render() {
    const { children } = this.props;

    return ReactDOM.createPortal(children, this.$container);
  }
}

class Popover extends Component {
  constructor(props) {
    super(props);

    this.$reference = React.createRef();
    this.$popper = React.createRef();
    this.$arrow = React.createRef();
    this.popperJS = null;
  }

  componentDidMount() {
    this._updatePopper();
  }

  _updatePopper = () => {
    if (this.popperJS) {
      return this.popperJS.update();
    }

    this._createPopper();
  };

  _createPopper = () => {
    const $reference = this.$reference.current;
    const $popper = this.$popper.current && this.$popper.current.$container;
    const $arrow = this.$arrow.current;

    if (!$reference || !$popper) return;

    let options = {
      placement: this.props.placement || 'auto',
      onCreate: this._handleCreate,
      // onUpdate: this._handleUpdate,
    };

    if ($arrow) {
      options = Object.assign(options, {
        modifiers: {
          arrow: {
            element: $arrow,
          },
        },
      });
    }

    this.popperJS = new PopperJS($reference, $popper, options);

    console.dir(this.popperJS);
  };

  _handleCreate = () => {};

  render() {
    const {
      reference,
      arrow,
      children,
      className,
      referenceClassName,
      popperClassName,
    } = this.props;

    return (
      <div className={cls(['popover', className])}>
        <div
          ref={this.$reference}
          className={cls(['popover__reference', referenceClassName])}
        >
          {reference}
        </div>
        <Popper ref={this.$popper} className={popperClassName}>
          <div className="content">{children}</div>
          {arrow && (
            <div ref={this.$arrow} className="arrow">
              {arrow}
            </div>
          )}
        </Popper>
      </div>
    );
  }
}

Popover.propTypes = {
  reference: PropTypes.node,
  arrow: PropTypes.node,
  referenceClassName: PropTypes.string,
  popperClassName: PropTypes.string,
};

export default Popover;
