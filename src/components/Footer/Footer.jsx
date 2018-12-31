import React from 'react';
import { Link } from 'gatsby';

import './style.less';

export default () => {
  return (
    <div className="footer">
      <div className="footer__wrapper">
        <div className="footer__logo">Blog</div>
        <ul className="footer__links">
          <li>
            <Link to="/rss.xml">RSS</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
