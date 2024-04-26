import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import { remarkCodeHike } from '@code-hike/mdx'

const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `posts/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: doc =>
        `/posts/${doc._raw.flattenedPath}`,
    },
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [
      [remarkCodeHike, { theme: 'github-from-css' }],
    ],
  },
})
