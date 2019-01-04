import React from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';

const Icon = ({ className, style, icon, size, color, ...rest }) => {
  const styles = { ...(style || {}) };

  if (size) {
    styles.size = `${size}px`;
  }

  if (color) {
    styles.color = color;
  }

  return (
    <i className={cls([`micon-${icon}`, className])} style={styles} {...rest} />
  );
};

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
};

export default Icon;
