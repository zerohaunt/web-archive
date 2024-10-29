import { isNil } from '@web-archive/shared/utils'
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

async function getTagById(DB: D1Database, id: number) {
  const sql = `
    SELECT 
      *
    FROM tags
    WHERE id = ?
  `
  const tag = await DB.prepare(sql).bind(id).first<Tag>()
  return tag
}

async function insertTag(DB: D1Database, options: { name: string, color: string }) {
  const { name, color } = options
  const sql = `
    INSERT INTO tags (name, color) 
    VALUES (?, ?)
  `
  const sqlResult = await DB.prepare(sql).bind(name, color).run()
  return sqlResult.success
}

async function updateTag(DB: D1Database, options: { id: number, name?: string, color?: string, pageIds?: Array<number> }) {
  const { id, name, color, pageIds } = options
  if (isNil(id)) {
    throw new Error('Tag id is required')
  }
  if (isNil(name) && isNil(color) && isNil(pageIds)) {
    throw new Error('At least one field is required')
  }
  let sql = `
    UPDATE tags
    SET 
  `
  const bindParams: (number | string)[] = []
  if (name) {
    sql += `name = ?, `
    bindParams.push(name)
  }
  if (color) {
    sql += `color = ?, `
    bindParams.push(color)
  }
  if (pageIds) {
    sql += `pageIds = ?, `
    bindParams.push(JSON.stringify(pageIds))
  }
  sql = `${sql.slice(0, -2)} WHERE id = ?`
  bindParams.push(id)
  const sqlResult = await DB.prepare(sql).bind(...bindParams).run()
  return sqlResult.success
}

export {
  selectAllTags,
  insertTag,
  getTagById,
  updateTag,
}
