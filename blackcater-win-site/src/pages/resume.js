import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { isMobile } from 'utils/common'

import './resume.styl'

class ResumePage extends Component {
  componentDidMount() {
    this.props.setUnsplashCover()
    this.props.setTitle(this.props.t('resume'))
  }

  render() {
    const { t } = this.props
    const resumeInfos = t('resumeInfos', { returnObjects: true })

    console.dir(resumeInfos)

    return (
      <div className="page-resume">
        <h2>{t('resume')}</h2>
      </div>
    )
  }
}

export default translate('translation')(ResumePage)
