import React, { Component } from 'react'
import { Layout, Icon } from 'antd'
import Link from 'gatsby-link'

import styles from './index.module.less'

const { Header, Content, Footer } = Layout

export default class MainLayout extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const { children } = this.props

    return (
      <Layout className={styles.main}>
        <Header className={styles.header}>
          <div className={styles.title}>
            <h1>blackcater.</h1>
          </div>
          <div className={styles.menu}>
            <ul className={styles.links}>
              <li className={styles.link}><Link to="/">Home</Link></li>
              <li className={styles.link}><Link to="/">Resume</Link></li>
              <li className={styles.link}><Link to="/">About</Link></li>
              <li className={styles.link}><Link to="/">Tags</Link></li>
              <li className={styles.link}><Link to="/">Archive</Link></li>
              <li className={styles.link}><Link to="/">Projects</Link></li>
            </ul>
          </div>
        </Header>
        <Content className={styles.content}>
          {children()}
        </Content>
        <Footer className={styles.footer}>
          <div className={styles['bg-text']}>contact</div>
          <div className={styles['footer-content']}>
            <div className={styles['footer-slogan']}>一心所向，必有回响</div>
            <div className={styles['footer-email']}>blackcater2015@gmail.com</div>
            <div className={styles['footer-social']}>
              <a><Icon className={styles['footer-social--icon']} type="twitter" /></a>
              <a><Icon className={styles['footer-social--icon']} type="facebook" /></a>
              <a><Icon className={styles['footer-social--icon']} type="google" /></a>
              <a><Icon className={styles['footer-social--icon']} type="github" /></a>
              <a><Icon className={styles['footer-social--icon']} type="weibo" /></a>
            </div>
          </div>
        </Footer>
      </Layout>
    )
  }
}
