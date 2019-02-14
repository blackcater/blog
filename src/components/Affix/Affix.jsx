import React, { useState, useEffect } from 'react';
import { on, off, animation, scrollTop } from 'dom-lib';
import cls from 'classnames';

import { Icon } from 'components/common';

import './style.less';

let waiting = false;

export default function Affix() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (waiting) return;

      waiting = true;

      animation.requestAnimationFramePolyfill(() => {
        const scrollY = window.scrollY || window.pageYOffset;
        const boundary = 0;

        if (scrollY > boundary && !show) {
          setShow(true);
          waiting = false;

          return;
        }

        if (scrollY <= boundary && show) {
          setShow(false);
          waiting = false;

          return;
        }

        waiting = false;
      });
    }

    on(window, 'scroll', handleScroll);

    return () => {
      off(window, 'scroll', handleScroll);
    };
  });

  return (
    <div
      className={cls(['affix', show && 'affix--show'])}
      onClick={() => scrollTop(window, 0)}
    >
      <Icon icon="arrow-up" />
    </div>
  );
}
