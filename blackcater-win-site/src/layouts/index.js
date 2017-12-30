import React, { Component } from "react"
import { Helmet } from "react-helmet"
import { Icon } from "components"

import "./index.styl"

export default class IndexLayout extends Component {
  render() {
    const { children, data: { site: { siteMetadata: metaData } } } = this.props

    console.dir(this.props)

    return (
      <div className="layout">
        <Helmet>
          <title>{metaData.title}</title>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <meta name="description" content={metaData.description} />
          <link href="/favicon.ico" rel="shortcut icon" type="image/x-icon" />
          <link
            href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700"
            rel="stylesheet"
          />
        </Helmet>
        <div className="layout-header" />
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
