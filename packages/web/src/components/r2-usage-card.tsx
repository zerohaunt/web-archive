import { Card, CardContent, CardHeader, CardTitle } from '@web-archive/shared/components/card'
import { useRequest } from 'ahooks'
import ChartCardSkeleton from './common/chart-card-skeleton'
import { getR2Usage } from '~/data/data'

function R2UsageCard() {
  const { data, loading } = useRequest(getR2Usage)
  return loading
    ? <ChartCardSkeleton />
    : (
      <Card>
        <CardHeader>
          <CardTitle>R2 Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <section>
              <span>{data?.count}</span>
              {' '}
              objects
            </section>
            <section>
              <span>{Math.round((data?.size ?? 0) / 1024 / 1024 / 1024)}</span>
              {' '}
              GB
            </section>
          </div>
        </CardContent>
      </Card>
      )
}

export default R2UsageCard
