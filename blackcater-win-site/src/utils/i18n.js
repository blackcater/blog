import { merge } from 'lodash'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const loadResources = langs => {
  const resources = {}

  for (const l of langs) {
    const lc = require(`./locales/${l}`)
    merge(resources, { [l]: lc })
  }

  return resources
}

const instance = i18n.createInstance()

instance.use(LanguageDetector).init({
  fallbackLng: 'zh',
  lng: 'zh',
  resources: loadResources(['en', 'zh']),
  react: {
    wait: true,
  },
})

export default instance
