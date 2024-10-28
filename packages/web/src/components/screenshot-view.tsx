import { Skeleton } from '@web-archive/shared/components/skeleton'
import { isNil } from '@web-archive/shared/utils'
import { useRequest } from 'ahooks'
import { getPageScreenshot } from '~/data/page'
import { useObjectURL } from '~/hooks/useObjectUrl'

interface ScreenshotViewProps {
  className?: string
  loadingClassName?: string
  screenshotId: string | null
}

function ScreenshotView({ screenshotId, className, loadingClassName }: ScreenshotViewProps) {
  const { objectURL: screenshot, setObject: setScreenshot } = useObjectURL(null)
  const { loading: screenshotLoading } = useRequest(
    getPageScreenshot(screenshotId),
    {
      onSuccess: (data) => {
        if (isNil(data))
          return
        setScreenshot(data)
      },
    },
  )

  return (
    screenshotLoading || isNil(screenshot)
      ? (
        <Skeleton className={loadingClassName} />
        )
      : (
        <img src={screenshot} className={className} />
        )
  )
}

export default ScreenshotView
