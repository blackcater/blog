import React, { Component } from 'react'

export default class MainLayout extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const { children } = this.props

    return (
      <div>
        {children()}
      </div>
    )
  }
}
