import React, { Component, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { Transition } from 'react-transition-group';
import PropTypes from 'prop-types';
import PopperJS from 'popper.js';
import cls from 'classnames';
import { on, off } from 'dom-lib';

import './style.less';

const $root = document.getElementById('popover-root');
const transitionStyles = {
  exited: { display: 'none' },
  entered: { display: 'block' },
};

class Popper extends PureComponent {
  constructor(props) {
    super(props);

    const { className } = props;

    this.$container = document.createElement('div');
    this.$container.className = className;
  }

  componentDidMount() {
    $root && $root.appendChild(this.$container);

    on(this.$container, 'click', this._handleClick);
  }

  componentWillUnmount() {
    $root && $root.removeChild(this.$container);

    off(this.$container, 'click', this._handleClick);
  }

  _handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  render() {
    const { children } = this.props;

    return ReactDOM.createPortal(children, this.$container);
  }
}

class Popover extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };

    this.$reference = React.createRef();
    this.$popper = React.createRef();
    this.$arrow = React.createRef();
    this.popperJS = null;
  }

  static getDerivedStateFromProps(props, state) {
    if (state.trigger === props.trigger) {
      return null;
    }

    return {
      trigger: props.trigger,
    };
  }

  componentDidMount() {
    this._addTriggerEvent(this.state.trigger);
    this._updatePopper();

    on(document, 'click', this.hide);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.trigger !== this.state.trigger) {
      this._removeTriggerEvent(prevState.trigger);
      this._addTriggerEvent(this.state.trigger);
    }

    this._updatePopper();
  }

  componentWillUnmount() {
    off(document, 'click', this.hide);
  }

  hide = () => {
    this.setState({ visible: false });
  };

  show = () => {
    this.setState({ visible: true });
  };

  _addTriggerEvent = trigger => {
    if (trigger === 'click') {
      on(this.$reference.current, 'click', this._handleClickEvent);
    }
  };

  _removeTriggerEvent = trigger => {
    if (trigger === 'click') {
      off(this.$reference.current, 'click', this._handleClickEvent);
    }
  };

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
      placement: this.props.placement,
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
  };

  _handleCreate = () => {};

  _handleClickEvent = e => {
    e.stopPropagation();

    this.setState(state => ({ visible: !state.visible }));
  };

  render() {
    const { visible } = this.state;
    const {
      namespace,
      reference,
      arrow,
      children,
      className,
      referenceClassName,
      popperClassName,
    } = this.props;

    return (
      <div className={cls(['popover', className, namespace && `${namespace}`])}>
        <div
          ref={this.$reference}
          className={cls([
            'popover__reference',
            referenceClassName,
            namespace && `${namespace}__reference`,
          ])}
        >
          {reference}
        </div>
        <Transition in={visible} timeout={16.67}>
          {state => (
            <Popper
              ref={this.$popper}
              className={cls([
                'popover__popper',
                arrow && 'popover__popper--arrow',
                popperClassName,
                namespace && `${namespace}__popper`,
              ])}
            >
              <div
                style={{ ...transitionStyles[state] }}
                className={cls([
                  'popover__popper__wrapper',
                  namespace && `${namespace}__popper__wrapper`,
                ])}
              >
                <div
                  className={cls([
                    'popover__popper__content',
                    namespace && `${namespace}__popper__content`,
                  ])}
                >
                  {children}
                </div>
                {arrow && (
                  <div ref={this.$arrow} className="popover__popper__arrow" />
                )}
              </div>
            </Popper>
          )}
        </Transition>
      </div>
    );
  }
}

Popover.propTypes = {
  namespace: PropTypes.string,
  trigger: PropTypes.oneOf(['click', 'hover', 'active']),
  placement: PropTypes.oneOf(PopperJS.placements),
  reference: PropTypes.node,
  arrow: PropTypes.bool,
  referenceClassName: PropTypes.string,
  popperClassName: PropTypes.string,
};

Popover.defaultProps = {
  namespace: '',
  trigger: 'click',
  placement: 'bottom',
  arrow: true,
};

export default Popover;
