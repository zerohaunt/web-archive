import { Hono } from 'hono'
import type { HonoTypeUserInformation } from '~/constants/binding'
import { getHomeChartData } from '~/model/data'
import result from '~/utils/result'

const app = new Hono<HonoTypeUserInformation>()

app.get('/home_chart', async (c) => {
  const data = await getHomeChartData(c.env.DB)

  return c.json(result.success(data))
})

export default app
