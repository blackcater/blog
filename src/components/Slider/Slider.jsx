import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Img from 'gatsby-image';
import cls from 'classnames';
import pick from 'utils/pick';

import './style.less';

class Slider extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      curr: 0,
    };
    this.timer = null;
  }

  componentDidMount() {
    this._createTimer();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.list.length !== this.props.list.length) {
      this._createTimer();
    }
  }

  componentWillUnmount() {
    this._removeTimer();
  }

  _createTimer = () => {
    this._removeTimer();

    this.timer = setInterval(this._tiktok, this.props.interval);
  };

  _removeTimer = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
  };

  _tiktok = t => {
    const { curr } = this.state;
    const { list } = this.props;
    const len = list.length;

    if (t !== undefined && t === curr) return;

    this._createTimer();

    this.setState({
      curr: t !== undefined ? t : (curr + 1) % len,
    });
  };

  render() {
    const { curr } = this.state;
    const { list } = this.props;

    return (
      <div className="slider">
        <div
          className="slider__slides"
          style={{
            width: `${list.length * 100}%`,
            transform: `translateX(-${(100 / list.length) * curr}%)`,
          }}
        >
          {list.map(edge => (
            <div
              key={pick(edge, 'node.id')}
              className="slider__slide__wrapper"
              style={{ width: `${100 / list.length}%` }}
            >
              <div className="slider__slide">
                <Img
                  fluid={pick(
                    edge,
                    'node.frontmatter.header.childImageSharp.fluid'
                  )}
                  alt={pick(edge, 'node.frontmatter.title')}
                />
              </div>
              <div className="slider__slide__title">
                {pick(edge, 'node.frontmatter.title')}
              </div>
            </div>
          ))}
        </div>
        <ul className="slider__dots">
          {list.map((edge, index) => (
            <li
              key={pick(edge, 'node.id')}
              className={cls([
                'slider__dot',
                index === curr && 'slider__dot--active',
              ])}
              onClick={() => this._tiktok(index)}
            />
          ))}
        </ul>
      </div>
    );
  }
}

Slider.propTypes = {
  auto: PropTypes.bool,
  interval: PropTypes.number,
  list: PropTypes.arrayOf(PropTypes.object),
};

Slider.defaultProps = {
  auto: true,
  interval: 7000,
  list: [],
};

export default Slider;
