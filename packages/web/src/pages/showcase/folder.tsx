import { useInfiniteScroll } from 'ahooks'
import { useRef } from 'react'
import type { Ref } from '@web-archive/shared/components/scroll-area'
import { ScrollArea } from '@web-archive/shared/components/scroll-area'
import LoadingWrapper from '~/components/loading-wrapper'
import CardView from '~/components/card-view'
import EmptyWrapper from '~/components/empty-wrapper'
import { queryShowcase } from '~/data/showcase'
import LoadingMore from '~/components/loading-more'

function ShowcaseFolderPage() {
  const scrollRef = useRef<Ref>(null)
  const totalCount = useRef(0)
  const PAGE_SIZE = 14
  const pageNum = useRef(1)
  const { data: pagesData, loading: pagesLoading, mutate: setPageData, loadingMore, reload } = useInfiniteScroll(
    async () => {
      if (loadingMore) {
        return {
          list: [],
        }
      }
      const res = await queryShowcase({
        pageNumber: pageNum.current,
        pageSize: PAGE_SIZE,
      })
      pageNum.current += 1
      totalCount.current = res.total
      return {
        list: res.list ?? [],
      }
    },
    {
      target: scrollRef.current?.viewport,
      isNoMore: (d) => {
        if (!d)
          return false
        return d.list.length === totalCount.current
      },
    },
  )

  return (
    <div className="flex flex-col flex-1">
      <ScrollArea ref={scrollRef} className="p-4 overflow-auto h-[calc(100vh-58px)]">
        <LoadingWrapper loading={pagesLoading || (!pagesData)}>
          <div className="h-full">
            <EmptyWrapper empty={pagesData?.list.length === 0}>
              <CardView pages={pagesData?.list} onPageDelete={() => {}} />
            </EmptyWrapper>
            {loadingMore && <LoadingMore />}
          </div>
        </LoadingWrapper>
      </ScrollArea>
    </div>
  )
}

export default ShowcaseFolderPage
