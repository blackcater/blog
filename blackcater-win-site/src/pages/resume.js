import React, { Component } from 'react'
import { isMobile } from 'utils/common'

import './resume.styl'

export default class ResumePage extends Component {
  componentDidMount() {
    this.props.setUnsplashCover()
    this.props.setTitle('RESUME')
  }

  render() {
    return (
      <div className="page-resume">
        <h2>RESUME</h2>
      </div>
    )
  }
}
