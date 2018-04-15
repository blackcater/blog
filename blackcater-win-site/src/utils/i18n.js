import { merge } from 'lodash'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { reactI18nextModule } from 'react-i18next'

const loadResources = langs => {
  const resources = {}

  for (const l of langs) {
    const lc = require(`../locales/${l}`)

    merge(resources, { [l]: lc })
  }

  return resources
}

i18n
  .use(LanguageDetector)
  .use(reactI18nextModule)
  .init({
    debug: process.env.NODE_ENV === 'development',

    fallbackLng: 'zh',
    lng: 'zh',

    resources: loadResources(['en', 'zh']),

    interpolation: {
      escapeValue: false, // not needed for react!!
    },

    react: {
      wait: true,
    },
  })

export default i18n
