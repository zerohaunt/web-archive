import { useRequest } from 'ahooks'
import { PageCardList } from '~/components/card-view'
import PageDataPieCard from '~/components/page-data-pie-card'
import R2UsageCard from '~/components/r2-usage-card'
import { getRecentSavePage } from '~/data/page'

function ArchiveHome() {
  const { data: pages } = useRequest(getRecentSavePage)
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <PageCardList pages={pages?.filter((_, index) => index % 3 === 0)} onPageDelete={() => {}}>
        <PageDataPieCard />
      </PageCardList>
      <PageCardList pages={pages?.filter((_, index) => index % 3 === 1)} onPageDelete={() => {}}>
        <R2UsageCard />
      </PageCardList>
      <PageCardList pages={pages?.filter((_, index) => index % 3 === 2)} onPageDelete={() => {}}>
      </PageCardList>
    </div>
  )
}

export default ArchiveHome
