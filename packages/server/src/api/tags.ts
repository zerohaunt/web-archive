import { buildGenerateTagMessage, isNil, isNumberString } from '@web-archive/shared/utils'
import { Hono } from 'hono'
import { validator } from 'hono/validator'
import type { HonoTypeUserInformation } from '~/constants/binding'
import { deleteTagById, insertTag, selectAllTags, updateTag } from '~/model/tag'
import result from '~/utils/result'

const app = new Hono<HonoTypeUserInformation>()

app.get('/all', async (c) => {
  const tags = await selectAllTags(c.env.DB)

  return c.json(result.success(tags))
})

app.post(
  '/create',
  validator('json', (value, c) => {
    if (isNil(value.name) || typeof value.name !== 'string') {
      return c.json(result.error(400, 'Name is required'))
    }
    // todo check color type?
    return {
      name: value.name as string,
      color: value.color,
    }
  }),
  async (c) => {
    const { name, color = '#ffffff' } = c.req.valid('json')

    if (await insertTag(c.env.DB, { name, color })) {
      return c.json(result.success(true))
    }

    return c.json(result.error(500, 'Failed to create tag'))
  },
)

app.post(
  '/update',
  validator('json', (value, c) => {
    if (isNil(value.id) || !isNumberString(value.id)) {
      return c.json(result.error(400, 'ID is required'))
    }
    if (isNil(value.name) && isNil(value.color)) {
      return c.json(result.error(400, 'At least one field is required'))
    }

    return {
      id: Number(value.id),
      name: value.name,
      color: value.color,
    }
  }),
  async (c) => {
    const { id, name, color } = c.req.valid('json')

    if (await updateTag(c.env.DB, { id, name, color })) {
      return c.json(result.success(true))
    }

    return c.json(result.error(500, 'Failed to update tag'))
  },
)

app.delete(
  '/delete',
  validator('query', (value, c) => {
    if (isNil(value.id) || !isNumberString(value.id)) {
      return c.json(result.error(400, 'ID is required'))
    }
    return {
      id: Number(value.id),
    }
  }),
  async (c) => {
    const { id } = c.req.valid('query')

    if (await deleteTagById(c.env.DB, id)) {
      return c.json(result.success(true))
    }

    return c.json(result.error(500, 'Failed to delete tag'))
  },
)

app.post(
  '/generate_tag',
  validator('json', (value, c) => {
    // todo
    return {
      title: value.title,
      pageDesc: value.pageDesc,
      model: value.model,
      tagLanguage: value.tagLanguage,
      preferredTags: value.preferredTags,
    }
  }),
  async (c) => {
    const { title, pageDesc, model, tagLanguage, preferredTags } = c.req.valid('json')

    try {
      const res = await c.env.AI.run(
        model,
        {
          messages: buildGenerateTagMessage({ title, pageDesc, tagLanguage, preferredTags }),
        },
      )

      try {
        if (res instanceof ReadableStream) {
          throw new TypeError('Failed to parse response stream')
        }
        const { tags } = JSON.parse(res.response)
        return c.json(result.success(tags))
      }
      catch (error) {
        console.log(res)
        return c.json(result.error(500, 'Failed to parse response'))
      }
    }
    catch (error) {
      return c.json(result.error(500, error.message))
    }
  },
)

export default app
