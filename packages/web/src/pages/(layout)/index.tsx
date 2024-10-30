import { useRequest } from 'ahooks'
import { memo, useMemo } from 'react'
import { useMediaQuery } from '~/hooks/useMediaQuery'
import { PageCardList } from '~/components/card-view'
import PageDataPieCard from '~/components/page-data-pie-card'
import R2UsageCard from '~/components/r2-usage-card'
import { getRecentSavePage } from '~/data/page'

const MemoizedPageCardList = memo(PageCardList)

function ArchiveHome() {
  const { data: pages = [] } = useRequest(getRecentSavePage)
  const isLargeScreen = useMediaQuery('(min-width: 1024px)')
  const isMediumScreen = useMediaQuery('(min-width: 768px)')

  const columnCount = useMemo(() => {
    if (isLargeScreen)
      return 3
    if (isMediumScreen)
      return 2
    return 1
  }, [isLargeScreen, isMediumScreen])

  const reorganizedPages = useMemo(() => {
    const result = Array.from({ length: columnCount }, () => [] as typeof pages)

    pages.forEach((page, index) => {
      const columnIndex = Math.floor(index / Math.ceil(pages.length / columnCount))
      result[columnIndex].push(page)
    })

    return result
  }, [pages, columnCount])

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <MemoizedPageCardList pages={reorganizedPages[0]} onPageDelete={() => {}}>
        <PageDataPieCard />
      </MemoizedPageCardList>
      {columnCount >= 2 && (
        <MemoizedPageCardList pages={reorganizedPages[1]} onPageDelete={() => {}}>
          <R2UsageCard />
        </MemoizedPageCardList>
      )}
      {columnCount >= 3 && (
        <MemoizedPageCardList pages={reorganizedPages[2]} onPageDelete={() => {}}>
        </MemoizedPageCardList>
      )}
    </div>
  )
}

export default ArchiveHome
