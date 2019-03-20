import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { Transition } from 'react-transition-group';
import { on, off, getOffset, addStyle } from 'dom-lib';

import './style.less';

const PADDING = 5;
let $root;

if (typeof window !== `undefined`) {
  $root = document.getElementById('gallery-root');
}

class Gallery extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      curr: 0,
      images: [],

      entering: {},
      entered: {},
      exiting: {},
      exited: {},
    };

    this.$imgs = [];
    this.$imgFuncs = [];
  }

  load = $imgs => {
    const images = [];

    this.$imgs = $imgs;

    $imgs.forEach(($img, index) => {
      const func = e => this._handleImageClick(e, $img, index);

      images.push($img.src);

      this.$imgFuncs.push(func);

      on($img, 'click', func);
    });

    this.setState({ images });
  };

  destroy = () => {
    this.$imgs.forEach(($img, index) => {
      off($img, 'click', this.$imgFuncs[index]);
    });
  };

  _handleImageClick = (e, $img, index) => {
    e.preventDefault();

    const scrollY = window.scrollY || window.pageYOffset;
    const windowW = window.innerWidth;
    const windowH = window.innerHeight;
    const offset = getOffset($img);
    const entering = {
      top: offset.top - scrollY,
      left: offset.left,
      width: offset.width,
      height: offset.height,
    };
    let entered = {};

    if (offset.width / offset.height > windowW / windowH) {
      const imgW = windowW - PADDING * 2;
      const imgH = (imgW * offset.height) / offset.width;

      entered = {
        top: (windowH - imgH) / 2,
        left: PADDING,
        width: imgW,
        height: imgH,
      };
    } else {
      const imgH = windowH - PADDING * 2;
      const imgW = (offset.width / offset.height) * imgH;

      entered = {
        top: PADDING,
        left: (windowW - imgW) / 2,
        width: imgW,
        height: imgH,
      };
    }

    addStyle($img, { opacity: 0 });

    this.setState({
      show: true,
      curr: index,
      entering,
      entered,
    });
  };

  _handleExitingGallery = e => {
    const { curr, show } = this.state;

    e.preventDefault();

    if (!show) return;
    if (this.waiting) return;

    this.waiting = true;

    const $img = this.$imgs[curr];
    const scrollY = window.scrollY || window.pageYOffset;
    const offset = getOffset($img);

    addStyle($img, { opacity: 1 });

    this.setState(
      {
        show: false,
        exiting: {
          top: offset.top - scrollY,
          left: offset.left,
          width: offset.width,
          height: offset.height,
        },
        exited: {},
      },
      () => (this.waiting = false)
    );
  };

  _handleEnter = () => {
    addStyle(document.body, { overflow: 'hidden' });
  };

  _handleExited = () => {
    addStyle(document.body, { overflow: 'auto' });
  };

  _renderPortal = () => {
    const {
      images,
      curr,
      show,
      entering,
      entered,
      exiting,
      exited,
    } = this.state;
    const image = images[curr];
    const stateMap = {
      entering,
      entered,
      exiting,
      exited,
    };
    const maskMap = {
      entering: {
        visibility: 'hidden',
        opacity: 0,
      },
      entered: {
        visibility: 'visible',
        opacity: 1,
      },
      exiting: {
        visibility: 'hidden',
        opacity: 0,
      },
      exited: {},
    };

    return (
      <Transition
        mountOnEnter
        unmountOnExit
        in={show}
        timeout={300}
        onEnter={this._handleEnter}
        onExited={this._handleExited}
      >
        {state => (
          <div className="gallery" onClick={this._handleExitingGallery}>
            <div className="gallery__mask" style={maskMap[state]} />
            <img
              className="gallery__preview"
              style={{ ...stateMap[state], ...maskMap[state] }}
              src={image}
              alt="preview"
            />
          </div>
        )}
      </Transition>
    );
  };

  render() {
    if (!$root) return null;

    return ReactDOM.createPortal(this._renderPortal(), $root);
  }
}

Gallery.propTypes = {};
Gallery.defaultProps = {};

export default Gallery;
