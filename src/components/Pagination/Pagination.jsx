import React from 'react';
import { Link } from 'gatsby';

import './style.less';

export default ({ next, prev, onPrev, onNext }) =>
  (prev || next) && (
    <div className="pagination">
      <div className="pagination__prev">
        {prev && (
          <Link to={prev} onClick={onPrev}>
            PREV
          </Link>
        )}
      </div>
      <div className="pagination__next">
        {next && (
          <Link to={next} onClick={onNext}>
            NEXT
          </Link>
        )}
      </div>
    </div>
  );
