import React, { Component, PropTypes } from 'react'
import { Icon } from 'components'
import cx from 'classnames'

import './index.styl'

export default class Pagination extends Component {
  constructor(props) {
    super(props)

    const { current, size, total, count } = this.props

    this.state = {
      current,
      size,
      total,
      count,
    }
  }

  componentWillReceiveProps(nextProps) {
    const state = {}

    if ('current' in nextProps) {
      state.current = nextProps.current
    }

    if ('size' in nextProps) {
      state.size = nextProps.size
    }

    if ('total' in nextProps) {
      state.total = nextProps.total
    }

    if ('count' in nextProps) {
      state.count = nextProps.count
    }

    this.setState(state)
  }

  handleItemClick = index => {
    const { onPagination } = this.props

    this.setState({ current: index })

    if (onPagination) onPagination(index, this.state.size)
  }

  calculateItems() {
    const { current, size, total } = this.state
    const count = Math.ceil(total / size) || this.state.count

    // 1 2 3 4 5
    if (count <= 5) {
      return new Array(count).fill(undefined).map((val, ind) => (
        <div
          key={`${ind}`}
          className={cx({
            item: true,
            active: current === ind + 1,
          })}
          onClick={() => this.handleItemClick(ind + 1)}
        >
          {ind + 1}
        </div>
      ))
    }

    // 1 2 3 4 ... 6
    if (current <= 3) {
      const list = new Array(current + 1).fill(undefined).map((val, ind) => (
        <div
          key={`${ind}`}
          className={cx({
            item: true,
            active: current === ind + 1,
          })}
          onClick={() => this.handleItemClick(ind + 1)}
        >
          {ind + 1}
        </div>
      ))
      const ellipsisIndex = Math.min(current + 2, count)

      list.push(
        <div
          key={`${ellipsisIndex}`}
          className={cx({
            item: true,
          })}
          onClick={() => this.handleItemClick(ellipsisIndex)}
        >
          <Icon type="more-horizontal" />
        </div>
      )
      list.push(
        <div
          key={`${count}`}
          className={cx({
            item: true,
          })}
          onClick={() => this.handleItemClick(count)}
        >
          {count}
        </div>
      )

      return list
    }

    // 1 ... 3 4 5 6
    if (current >= count - 2) {
      const list = new Array(count - current + 2)
        .fill(undefined)
        .map((val, ind) => (
          <div
            key={`${count - ind}`}
            className={cx({
              item: true,
              active: current === count - ind,
            })}
            onClick={() => this.handleItemClick(count - ind)}
          >
            {count - ind}
          </div>
        ))
        .reverse()
      const ellipsisIndex = Math.max(current - 2, 1)

      list.unshift(
        <div
          key={`${ellipsisIndex}`}
          className={cx({
            item: true,
          })}
          onClick={() => this.handleItemClick(ellipsisIndex)}
        >
          <Icon type="more-horizontal" />
        </div>
      )
      list.unshift(
        <div
          key="1"
          className={cx({
            item: true,
          })}
          onClick={() => this.handleItemClick(1)}
        >
          {1}
        </div>
      )

      return list
    }

    const list = []
    const leftEllipsisIndex = Math.max(current - 2, 1)
    const rightEllipsisIndex = Math.min(current + 2, count)

    list.push(
      <div
        key="1"
        className={cx({
          item: true,
        })}
        onClick={() => this.handleItemClick(1)}
      >
        {1}
      </div>
    )
    list.push(
      <div
        key={`${leftEllipsisIndex}`}
        className={cx({
          item: true,
        })}
        onClick={() => this.handleItemClick(leftEllipsisIndex)}
      >
        <Icon type="more-horizontal" />
      </div>
    )
    list.push(
      <div
        key={`${current - 1}`}
        className={cx({
          item: true,
        })}
        onClick={() => this.handleItemClick(current - 1)}
      >
        {current - 1}
      </div>
    )
    list.push(
      <div
        key={`${current}`}
        className={cx({
          item: true,
          active: true,
        })}
        onClick={() => this.handleItemClick(current)}
      >
        {current}
      </div>
    )
    list.push(
      <div
        key={`${current + 1}`}
        className={cx({
          item: true,
        })}
        onClick={() => this.handleItemClick(current + 1)}
      >
        {current + 1}
      </div>
    )
    list.push(
      <div
        key={`${rightEllipsisIndex}`}
        className={cx({
          item: true,
        })}
        onClick={() => this.handleItemClick(rightEllipsisIndex)}
      >
        <Icon type="more-horizontal" />
      </div>
    )
    list.push(
      <div
        key={`${count}`}
        className={cx({
          item: true,
        })}
        onClick={() => this.handleItemClick(count)}
      >
        {count}
      </div>
    )

    return list
  }

  render() {
    const { current, size, total } = this.state
    const count = Math.ceil(total / size) || this.state.count
    const items = this.calculateItems()

    return (
      <div className="wbi--pagination">
        <div
          className={cx({
            item: true,
            disabled: count === 0 || current <= 1,
          })}
        >
          <Icon type="chevron-left" />
        </div>
        {items}
        <div
          className={cx({
            item: true,
            disabled: count === 0 || current >= count,
          })}
        >
          <Icon type="chevron-right" />
        </div>
      </div>
    )
  }
}

Pagination.propTypes = {
  current: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  onPagination: PropTypes.func,
}

Pagination.defaultProps = {
  current: 1,
  size: 20,
  total: 0,
}
