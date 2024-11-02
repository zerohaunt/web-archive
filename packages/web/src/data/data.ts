import fetcher from '~/utils/fetcher'

interface HomeChartData {
  folders: {
    id: string
    name: string
    pageCount: number
  }[]
  all: number
}

async function getPageChartData(): Promise<HomeChartData> {
  return fetcher('/data/page_chart_data', {
    method: 'GET',
  })
}

interface R2UsageData {
  count: number
  size: number
}

async function getR2Usage(): Promise<R2UsageData> {
  return fetcher('/data/r2_usage', {
    method: 'GET',
  })
}

export {
  getPageChartData,
  getR2Usage,
}
