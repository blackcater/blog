import React from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';

function ParallelLine({
  className,
  style,
  wrapperStyle,
  flex,
  width,
  children,
}) {
  const styles = { ...style };

  if (width) {
    styles.width = width;
  } else if (flex) {
    styles.flex = flex;
  }

  return (
    <div className={cls(['parallel__line', className])} style={styles}>
      <div style={{ padding: '1px', boxSizing: 'border-box', ...wrapperStyle }}>
        {children}
      </div>
    </div>
  );
}

ParallelLine.displayName = 'ParallelLine';

ParallelLine.propTypes = {
  flex: PropTypes.number,
  width: PropTypes.number,
  wrapperStyle: PropTypes.object,
};

ParallelLine.defaultProps = {
  flex: 1,
  wrapperStyle: {},
};

export default ParallelLine;
