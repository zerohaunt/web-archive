import { isNil } from '@web-archive/shared/utils'
import { Hono } from 'hono'
import { validator } from 'hono/validator'
import type { HonoTypeUserInformation } from '~/constants/binding'
import { insertTag, selectAllTags } from '~/model/tag'
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
    return {
      name: value.name as string,
    }
  }),
  async (c) => {
    const { name } = c.req.valid('json')

    if (await insertTag(c.env.DB, { name })) {
      return c.json(result.success(true))
    }

    return c.json(result.error(500, 'Failed to create tag'))
  },
)

export default app
