import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { Icon } from 'components'
import { isMobile } from 'utils/common'

import './resume.styl'

class ResumePage extends Component {
  componentDidMount() {
    this.props.setUnsplashCover()
    this.props.setTitle(this.props.t('resume'))
  }

  renderDesc(desc = []) {
    if (
      Object.prototype.toString.call(desc).toLowerCase() !== '[object array]'
    ) {
      desc = [{ type: 'text', value: desc }]
    }

    return desc.map(({ type, value }) => {
      if (type === 'text') {
        return <p key={value}>{value}</p>
      }

      if (type === 'img' || type === 'image' || type === 'pic') {
        return (
          <p key={value}>
            <img src={value} alt={value} />
          </p>
        )
      }

      return null
    })
  }

  render() {
    const { t } = this.props
    const { contact, application, basic, experience, projects, skills } = t(
      'resumeInfos',
      { returnObjects: true }
    )

    return (
      <div className="page-resume">
        <h2>{t('resume')}</h2>
        <div className="resume">
          <div className="left">
            <div className="avatar-section">
              <img src="/favicon.png" alt="blackcater" />
            </div>
            <div className="contact-section">
              <h3 className="title">{contact.title.toUpperCase()}</h3>
              <div className="contact-item mail">
                <Icon
                  type="mail"
                  style={{
                    color: '#fff',
                    fontSize: '16px',
                    marginRight: '0.6em',
                  }}
                />
                {contact.mail}
              </div>
              <div className="contact-item phone">
                <Icon
                  type="phone"
                  style={{
                    color: '#fff',
                    fontSize: '16px',
                    marginRight: '0.6em',
                  }}
                />
                {contact.phone}
              </div>
            </div>
            <div className="application-section">
              <h3 className="title">{application.title.toUpperCase()}</h3>
              <div className="application">{application.data}</div>
            </div>
          </div>
          <div className="right">
            <div className="section">
              <h3 className="title">{basic.title.toUpperCase()}</h3>
              <div className="basic-section">
                <div className="info-item name">
                  <span>{basic.name.key}</span>
                  {basic.name.value}
                </div>
                <div className="info-item nickname">
                  <span>{basic.nickname.key}</span>
                  {basic.nickname.value}
                </div>
                <div className="info-item age">
                  <span>{basic.age.key}</span>
                  {basic.age.value}
                </div>
                <div className="info-item gender">
                  <span>{basic.gender.key}</span>
                  {basic.gender.value}
                </div>
                <div className="info-item school">
                  <span>{basic.school.key}</span>
                  {basic.school.value}
                </div>
                <div className="info-item blog">
                  <span>{basic.blog.key}</span>
                  <a href={basic.blog.link} target="__blank">
                    {basic.blog.value}
                  </a>
                </div>
                <div className="info-item github">
                  <span>{basic.github.key}</span>
                  <a href={basic.github.link} target="__blank">
                    {basic.github.value}
                  </a>
                </div>
              </div>
            </div>
            <div className="section">
              <h3 className="title">{experience.title.toUpperCase()}</h3>
              <div className="experience-section">
                {experience.data.map(({ logo, name, time, link, projects }) => (
                  <div key={name + time} className="experience-item">
                    <div className="title">
                      <a href={link} target="__blank">
                        <img src={logo} alt={name} />
                        {name}
                        {time}
                      </a>
                    </div>
                    {projects && projects.length > 0 ? (
                      <ul className="project-list">
                        {projects.map(project => (
                          <li key={project.name} className="project-item">
                            <div className="pname">{project.name}</div>
                            <div
                              className="pdesc"
                              dangerouslySetInnerHTML={{ __html: project.desc }}
                            />
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
            <div className="section">
              <h3 className="title">{projects.title.toUpperCase()}</h3>
              <div className="project-section" />
            </div>
            <div className="section">
              <h3 className="title">{skills.title.toUpperCase()}</h3>
              <div className="skill-section" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default translate('translation')(ResumePage)
