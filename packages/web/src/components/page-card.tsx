import type { Page } from '@web-archive/shared/types'
import React, { useRef, useState } from 'react'
import { useDrag, useRequest } from 'ahooks'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@web-archive/shared/components/card'
import { Button } from '@web-archive/shared/components/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@web-archive/shared/components/tooltip'
import { ExternalLink, Eye, EyeOff, Move, Trash } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import ScreenshotView from './screenshot-view'
import { useNavigate } from '~/router'
import { dragIcon } from '~/utils/drag'
import { updatePageShowcase } from '~/data/page'

function PageCard({ page, onPageDelete }: { page: Page, onPageDelete?: (page: Page) => void }) {
  const navigate = useNavigate()

  const location = useLocation()
  const isShowcased = location.pathname.startsWith('/showcase')

  const handleClickPageCard = (page: Page) => {
    navigate(isShowcased ? '/showcase/page/:slug' : '/page/:slug', { params: { slug: String(page.id) } })
  }

  const handleClickPageUrl = (e: React.MouseEvent, page: Page) => {
    e.stopPropagation()
    window.open(page.pageUrl, '_blank')
  }

  const cardDragTarget = useRef(null)
  useDrag(page, cardDragTarget, {
    dragImage: {
      image: dragIcon,
    },
  })

  const handleDeletePage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this page?')) {
      onPageDelete?.(page)
    }
  }

  const [showcaseSate, setShowcaseState] = useState(page.isShowcased)
  const { run: updateShowcase } = useRequest(
    updatePageShowcase,
    {
      manual: true,
      onSuccess() {
        toast.success('Success')
        setShowcaseState(showcaseSate === 1 ? 0 : 1)
      },
    },
  )

  return (
    <Card
      key={page.id}
      onClick={() => handleClickPageCard(page)}
      className="cursor-pointer hover:shadow-lg transition-shadow flex flex-col relative group"
    >
      <CardHeader>
        <CardTitle className="leading-8 text-lg line-clamp-2">{page.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ScreenshotView
          screenshotId={page.screenshotId}
          className="w-full mb-2"
          loadingClassName="w-full h-48"
        >
        </ScreenshotView>
        <p className="h-auto text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{page.pageDesc}</p>
      </CardContent>
      <CardFooter className="flex space-x-2 justify-end w-full backdrop-blur-sm py-4 absolute bottom-0 group-hover:opacity-100 opacity-0 transition-opacity">
        {
          !isShowcased && (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" ref={cardDragTarget}>
                    <Move className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Drag to other folder
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        }

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={e => handleClickPageUrl(e, page)}>
                <ExternalLink className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Open original link
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {
          !isShowcased && (
            <>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleDeletePage}>
                      <Trash className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Delete this page
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        updateShowcase({ id: page.id, isShowcased: showcaseSate === 1 ? 0 : 1 })
                      }}
                    >
                      {
                        showcaseSate === 1 ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />
                      }
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {
                      showcaseSate === 1 ? 'Remove from showcase' : 'Show in showcase'
                    }
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )
        }
      </CardFooter>
    </Card>
  )
}

export default PageCard
