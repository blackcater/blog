/**
 * 整理 graphql 查询的 post 信息
 *
 * @param post
 */
export function formatGraphqlPost(post) {
  if (!post) return null

  const { frontmatter: { header } } = post
  const isCover = typeof header === 'string'

  return {
    ...post,
    frontmatter: {
      ...post.frontmatter,
      cover: isCover ? header : header.childImageSharp.sizes.src,
      header: isCover ? null : header.childImageSharp,
    },
  }
}

/**
 * 整理 graphql 查询的 posts 信息
 *
 * @param postList
 */
export function formatGraphqlPostList(postList = []) {
  const posts = postList.edges || postList

  return posts.map(post => formatGraphqlPost(post.node || post))
}
