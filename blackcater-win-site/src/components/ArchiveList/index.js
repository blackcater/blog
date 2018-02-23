import React, { Component, PropTypes } from 'react'
import Link from 'gatsby-link'

import './index.styl'

export default class ArchiveList extends Component {
  render() {
    const { groups } = this.props

    return (
      <div className="wbi--archive-list">
        {groups.map(({ title, posts }) => (
          <div key={title} className="wbi--archive-item">
            <div className="wbi--archive-title">{title}</div>
            <ul className="wbi--archive-post-list">
              {posts.map(
                ({ fields: { slug }, frontmatter: { date, title } }) => (
                  <li key={slug}>
                    <Link to={slug} className="wbi--archive-post-item">
                      <div className="date">{date}</div>
                      <div className="title">{title}</div>
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        ))}
        <div className="line" />
      </div>
    )
  }
}

ArchiveList.propTypes = {
  groups: PropTypes.array,
}

ArchiveList.defaultProps = {
  groups: [],
}
