import React, { Component } from "react"
import { Helmet } from "react-helmet"
import { Icon } from "components"
import cx from "classnames"

import "./index.styl"

export default class IndexLayout extends Component {
  constructor(props) {
    super(props)

    this.state = {
      menu: false,
    }
  }

  // 切换 菜单栏显隐
  toggleMenu = menu => {
    this.setState({
      menu: !menu,
    })
  }

  render() {
    const { menu } = this.state
    const { children, data: { site: { siteMetadata: metaData } } } = this.props
    const { title, description, nickname } = metaData

    console.dir(this.props)

    return (
      <div className="layout">
        <Helmet>
          <title>{title}</title>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <meta name="description" content={description} />
          <link href="/favicon.png" rel="shortcut icon" type="image/x-icon" />
          <link
            href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700"
            rel="stylesheet"
          />
          <link href="/favicon.png" rel="apple-touch-icon-precomposed" />
        </Helmet>
        <div className="layout-header">
          <div className="title-section">
            <img
              className="avatar"
              src={require("images/avatar.png")}
              alt={nickname}
            />
            <div className="title">{title}</div>
            <div className="icon" onClick={() => this.toggleMenu(menu)}>
              <Icon
                type={menu ? "x" : "menu"}
                style={{ color: "#758db0", fontSize: "20px" }}
              />
            </div>
          </div>
          <div
            className={cx({
              "menu-list": true,
              active: menu,
            })}>
            <div className="menu-item">HOME</div>
            <div className="menu-item">TAG</div>
            <div className="menu-item">ARCHIVE</div>
            <div className="menu-item">RESUME</div>
            <div className="menu-item">ABOUT</div>
          </div>
        </div>
        <div className="layout-content">{children()}</div>
        <div className="layout-footer" />
      </div>
    )
  }
}

export const query = graphql`
  query LayoutData {
    site {
      siteMetadata {
        title
        description
        nickname
        slogan
        email
        socials {
          type
          url
        }
      }
    }
  }
`
