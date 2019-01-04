import React from 'react';
import { Link } from 'gatsby';

import './style.less';

export default ({ next, prev }) => (
  <div className="pagination">
    <div className="pagination__prev">
      {prev && <Link to={prev}>PREV</Link>}
    </div>
    <div className="pagination__next">
      {next && <Link to={next}>NEXT</Link>}
    </div>
  </div>
);
