import type { Tag } from '~/sql/types'

async function selectAllTags(DB: D1Database) {
  const sql = `
    SELECT 
      *
    FROM tags
  `
  const sqlResult = await DB.prepare(sql).all<Tag>()
  if (sqlResult.error) {
    throw sqlResult.error
  }
  const tagList = sqlResult.results.map((tag) => {
    return {
      ...tag,
      pageIds: JSON.parse(tag.pageIds),
    }
  })
  return tagList
}

async function insertTag(DB: D1Database, options: { name: string }) {
  const sql = `
    INSERT INTO tags (name, color) 
    VALUES (?, '#ffffff')
  `
  const sqlResult = await DB.prepare(sql).bind(options.name).run()
  return sqlResult.success
}

export {
  selectAllTags,
  insertTag,
}
