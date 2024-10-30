import { memo } from 'react'

const ChartCardSkeleton = memo(() => {
  return <div className="w-full h-full bg-muted-foreground/20 animate-pulse rounded-lg" />
})

export default ChartCardSkeleton
