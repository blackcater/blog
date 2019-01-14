import React from 'react';
import { withPrefix } from 'gatsby';

import './style.less';

export default () => {
  return (
    <div className="footer">
      <div className="footer__wrapper">
        <div className="footer__logo">Blog</div>
        <ul className="footer__links">
          <li>
            <a href={withPrefix('/rss.xml')} target="_blank">
              RSS
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};
