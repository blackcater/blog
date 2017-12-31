import React, { Component } from 'react'
import { Icon } from 'components'
import axios from 'axios'

import './index.styl'

const NAMESPACE = 'UNSPLASH_IMG__BL0G_INDEX_PAGE'

export default class IndexPage extends Component {
  componentDidMount() {
    if (this.shouldFetchUnsplashPhoto()) {
      // 需要更新
      this.fetchUnsplashPhoto(urls => {
        window.localStorage.setItem(
          NAMESPACE,
          JSON.stringify({
            date: Date.now(),
            urls,
          })
        )

        this.props.setCover(`${urls.full}?w=2200`)
      })
    } else {
      const { urls } = JSON.parse(
        window.localStorage.getItem(NAMESPACE) || '{}'
      )

      this.props.setCover(`${urls.full}?w=2200`)
    }
  }

  // 判断是否需要更新图片
  shouldFetchUnsplashPhoto = () => {
    const { date } = JSON.parse(window.localStorage.getItem(NAMESPACE) || '{}')
    const now = new Date()

    if (!date) return true

    const past = new Date(date)

    return !(
      past.getFullYear() === now.getFullYear() &&
      past.getMonth() === now.getMonth() &&
      past.getDay() === now.getDay()
    )
  }

  fetchUnsplashPhoto = (cb, errCb) => {
    axios
      .get('https://api.unsplash.com/photos/random', {
        params: {
          query: 'landscape',
          orientation: 'landscape',
        },
        headers: {
          'Accept-Version': 'v1',
          Authorization:
            'Client-ID 2293f4e76a8b62a4e5c08a6d05f74d0f12c4cc9e84dc697736d50a422d9a541c',
        },
      })
      .then(({ data }) => {
        if (cb) cb(data.urls)
      })
      .catch(errCb)
  }

  render() {
    return <div>这是首页啊</div>
  }
}
