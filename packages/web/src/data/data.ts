import fetcher from '~/utils/fetcher'

interface HomeChartData {
  folders: {
    id: string
    name: string
    pageCount: number
  }[]
  all: number
}

async function getHomeChartData(): Promise<HomeChartData> {
  return fetcher('/data/home_chart', {
    method: 'GET',
  })
}

export {
  getHomeChartData,
}
