import React, { Component } from 'react'
import cx from 'classnames'

import './index.styl'

export default class Button extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const { type: t, color: c, children, ...props } = this.props
    const type = t || 'default'
    const color = c || 'primary'

    return (
      <button
        className={cx({
          btn: true,
          [`btn-type--${type}`]: true,
          [`btn-color--${color}`]: true,
        })}
        {...props}
      >
        {children}
      </button>
    )
  }
}
