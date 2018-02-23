import React, { Component } from 'react'
import { isMobile } from 'utils/common'

import './category-index.styl'

export default class CategoryIndexTemplate extends Component {
  componentDidMount() {
    this.props.setUnsplashCover()
    this.props.setTitle('CATEGORY')
  }

  render() {
    return (
      <div className="page-resume">
        <h2>RESUME</h2>
      </div>
    )
  }
}
