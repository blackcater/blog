/**
 * 整理 graphql 查询的 post 信息
 *
 * @param post
 */
export function formatGraphqlPost(post) {
  if (!post) return null

  const { frontmatter: { header } } = post
  const isCover = typeof header === 'string'
  const obj = !!header
    ? {
        cover: isCover ? header : header.childImageSharp.sizes.src,
        header: isCover ? null : header.childImageSharp,
      }
    : {}

  return {
    ...post,
    frontmatter: {
      ...post.frontmatter,
      ...obj,
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

/**
 * 整理 graphql 分组查询结果
 *
 * @param groups
 */
export function formatGraphqlGroupPostList(groups = []) {
  const rawGroups = groups.groups || groups

  return rawGroups.map(({ title, posts }) => {
    return {
      title,
      posts: formatGraphqlPostList(posts),
    }
  })
}
