import { useRequest } from 'ahooks'
import { useMemo } from 'react'
import { useMediaQuery } from '~/hooks/useMediaQuery'
import PageDataPieCard from '~/components/page-data-pie-card'
import R2UsageCard from '~/components/r2-usage-card'
import { getRecentSavePage } from '~/data/page'
import PageCard from '~/components/page-card'
import { getR2Usage } from '~/data/data'

function ArchiveHome() {
  const { data: pages = [] } = useRequest(getRecentSavePage)
  const { '2xl': is2xlScreen, xl: isXlScreen, md: isMdScreen } = useMediaQuery()

  const columnCount = useMemo(() => {
    if (is2xlScreen)
      return 4
    if (isXlScreen)
      return 3
    if (isMdScreen)
      return 2
    return 1
  }, [is2xlScreen, isXlScreen, isMdScreen])

  const reorganizedPages = useMemo(() => {
    const result = Array.from({ length: columnCount }, () => [])
    return result.map((_, idx) =>
      pages
        .filter((_, index) => index % columnCount === idx)
        .map(page => (
          <PageCard key={page.id} page={page} />
        )),
    )
  }, [pages, columnCount])

  const { data: r2Data, loading: r2Loading } = useRequest(getR2Usage)

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {
        reorganizedPages.map((item, idx) => (
          <div key={idx} className="flex flex-col gap-4">
            {idx === 0 && <PageDataPieCard />}
            {columnCount === 1 ? <R2UsageCard loading={r2Loading} data={r2Data} /> : idx === 1 && <R2UsageCard loading={r2Loading} data={r2Data} />}
            {item}
          </div>
        ))
      }
    </div>
  )
}

export default ArchiveHome
