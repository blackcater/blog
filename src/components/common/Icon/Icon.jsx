import React from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';

function Icon({ icon, size, color, className, style, ...rest }) {
  const styles = { ...(style || {}) };

  if (size) {
    styles.size = `${size}px`;
  }

  if (color) {
    styles.color = color;
  }

  return (
    <i
      className={cls([`micon-${icon}`, className])}
      style={{ fontSize: size, color }}
      {...rest}
    />
  );
}

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
};

export default Icon;
