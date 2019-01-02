import React from 'react';
import { Link } from 'gatsby';

import './style.less';

export default ({ next, prev }) => (
  <div className="pagination">
    {prev && (
      <div className="pagination__prev">
        <Link to={prev}>prev</Link>
      </div>
    )}
    {next && (
      <div className="pagination__next">
        <Link to={next}>NEXT</Link>
      </div>
    )}
  </div>
);
