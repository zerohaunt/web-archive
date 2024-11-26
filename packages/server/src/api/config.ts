import { Hono } from 'hono'
import { validator } from 'hono/validator'
import type { AITagConfig } from '@web-archive/shared/types'
import type { HonoTypeUserInformation } from '~/constants/binding'
import { getAITagConfig, getShouldShowRecent, setAITagConfig, setShouldShowRecent } from '~/model/store'
import result from '~/utils/result'

const app = new Hono<HonoTypeUserInformation>()

app.get('/should_show_rencent', async (c) => {
  try {
    const shouldShowRecent = await getShouldShowRecent(c.env.DB)
    return c.json(result.success(shouldShowRecent))
  }
  catch (error) {
    console.error(error)
    return c.json(result.error(500, 'Failed to get config'))
  }
})

app.post(
  '/should_show_rencent',
  validator('json', (value, c) => {
    if (typeof value.shouldShowRecent !== 'boolean') {
      return c.json(result.error(400, 'shouldShowRecent is required'))
    }

    return {
      shouldShowRecent: value.shouldShowRecent as boolean,
    }
  }),
  async (c) => {
    const { shouldShowRecent } = c.req.valid('json')
    try {
      await setShouldShowRecent(c.env.DB, shouldShowRecent)
      return c.json(result.success(shouldShowRecent))
    }
    catch (error) {
      console.error(error)
      return c.json(result.error(500, 'Failed to update config'))
    }
  },
)

app.get('/ai_tag', async (c) => {
  try {
    const aiTagConfig = await getAITagConfig(c.env.DB)
    return c.json(result.success(aiTagConfig))
  }
  catch (error) {
    console.error(error)
    return c.json(result.error(500, 'Failed to get config'))
  }
})

app.post(
  '/ai_tag',
  validator('json', (value, c) => {
    // todo validate
    if (typeof value !== 'object') {
      return c.json(result.error(400, 'aiTagConfig is required'))
    }

    return value as AITagConfig
  }),
  async (c) => {
    const aiTagConfig = c.req.valid('json')
    try {
      await setAITagConfig(c.env.DB, aiTagConfig)
      return c.json(result.success(aiTagConfig))
    }
    catch (error) {
      console.error(error)
      return c.json(result.error(500, 'Failed to update config'))
    }
  },
)

export default app
