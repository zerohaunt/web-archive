import { useRequest } from 'ahooks'
import { PageCardList } from '~/components/card-view'
import TotalPieCard from '~/components/total-pie-card'
import { getRecentSavePage } from '~/data/page'

function ArchiveHome() {
  const { data: pages, loading } = useRequest(getRecentSavePage)
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <PageCardList pages={pages?.filter((_, index) => index % 3 === 0)}>
        <TotalPieCard />
      </PageCardList>
      <PageCardList pages={pages?.filter((_, index) => index % 3 === 1)} />
      <PageCardList pages={pages?.filter((_, index) => index % 3 === 2)} />
    </div>
  )
}

export default ArchiveHome
