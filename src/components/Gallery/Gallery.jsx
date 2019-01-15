import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { on, off } from 'dom-lib';
import cls from 'classnames';

import './style.less';

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

    console.dir($img);
    console.dir(index);
  };

  _renderPortal = () => {
    const { images, curr } = this.state;
    const image = images[curr];

    return (
      <div className="gallery">
        <div className="gallery__mask" />
        <div className="gallery__content">
          <div className="gallery__preview">
            <img src={image} />
          </div>
          <div className="gallery__images">
            {images.map((image, index) => (
              <div
                className={cls([
                  'gallery__image',
                  index === curr && 'gallery__image--active',
                ])}
                key={image}
              >
                <div style={{ backgroundImage: `url(${image})` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  render() {
    return ReactDOM.createPortal(this._renderPortal(), $root);
  }
}

Gallery.propTypes = {};
Gallery.defaultProps = {};

export default Gallery;
