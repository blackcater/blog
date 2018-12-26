import React from 'react';

function Icon(props) {
  const { icon, size, color } = props;

  return <i className={`micon-${icon}`} style={{ fontSize: size, color }} />;
}

export default Icon;
