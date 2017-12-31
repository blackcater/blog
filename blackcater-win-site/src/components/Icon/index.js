import React from 'react'
import cx from 'classnames'

export default ({ type, style }) => (
  <i className={cx('wbi', `wbi-${type}`)} style={style} />
)
