import { memo } from 'react'

const LoadingMore = memo(() => {
  return (
    <div className="w-full h-16 flex flex-col items-center justify-center mt-2">
      <div className="m-b-xl h-8 w-8 animate-spin border-4 border-t-transparent rounded-full border-primary"></div>
      <div>Loading more...</div>
    </div>
  )
})

export default LoadingMore
