import React, { Component } from 'react'
import { isMobile } from 'utils/common'

import './about.styl'

export default class AboutPage extends Component {
  componentDidMount() {
    this.props.setUnsplashCover()
    this.props.setTitle('ABOUT')
  }

  render() {
    return (
      <div className="page-about">
        <h2>ABOUT</h2>
      </div>
    )
  }
}
