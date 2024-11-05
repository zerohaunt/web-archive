import { Badge } from '@web-archive/shared/components/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@web-archive/shared/components/collapsible'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from '@web-archive/shared/components/side-bar'
import { cn } from '@web-archive/shared/utils'
import { ChevronDown, TagIcon } from 'lucide-react'
import { useContext, useState } from 'react'
import AppContext from '~/store/app'

interface SidebarTagMenuProps {
  selectedTag: number | null
  setSelectedTag: (tag: number | null) => void
}

function SidebarTagMenu({ selectedTag, setSelectedTag }: SidebarTagMenuProps) {
  const { tagCache: tags } = useContext(AppContext)
  const [isTagsCollapseOpen, setIsTagsCollapseOpen] = useState(false)

  const handleClickTag = (tagId: number) => {
    if (selectedTag === tagId) {
      setSelectedTag(null)
    }
    else {
      setSelectedTag(tagId)
    }
  }

  return (
    <SidebarMenu>
      <Collapsible
        open={isTagsCollapseOpen}
        onOpenChange={setIsTagsCollapseOpen}
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="w-full justify-between">
            <div className="flex items-center">
              <TagIcon className="mr-2 h-4 w-4"></TagIcon>
              Tags
            </div>
            <ChevronDown className={cn('h-4 w-4 transition-transform', isTagsCollapseOpen && 'rotate-180')} />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            <div className="space-y-2">
              {tags?.map(tag => (
                <Badge
                  onClick={() => {
                    handleClickTag(tag.id)
                  }}
                  key={tag.id}
                  className="cursor-pointer h-fit mr-2 select-none"
                  variant={selectedTag === tag.id ? 'default' : 'secondary'}
                >
                  {`${tag.name}`}
                </Badge>
              ))}
            </div>

          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenu>
  )
}

export default SidebarTagMenu
