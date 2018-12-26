import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class DropdownItem extends PureComponent {
  render() {
    const { children } = this.props;

    return <div className="dropdown__item">{children}</div>;
  }
}

DropdownItem.propTypes = {
  name: PropTypes.string.isRequired,
};

export default DropdownItem;
