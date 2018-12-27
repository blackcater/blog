import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';

class ParallelLine extends PureComponent {
  render() {
    const {
      className,
      style,
      wrapperStyle,
      flex,
      width,
      children,
    } = this.props;
    const styles = { ...style };

    if (width) {
      styles.flexBasis = width;
    } else if (flex) {
      styles.flex = flex;
    }

    return (
      <div className={cls(['parallel__line', className])} style={styles}>
        <div style={wrapperStyle}>{children}</div>
      </div>
    );
  }
}

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
