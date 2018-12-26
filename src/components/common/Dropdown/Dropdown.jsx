import React from 'react';

import { Popover } from 'components/common';

import './style.less';

function Dropdown(props) {
  const { className, children, ...rest } = props;

  return (
    <Popover {...rest} namespace="dropdown">
      {children}
    </Popover>
  );
}

export default Dropdown;
