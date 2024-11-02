import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@web-archive/shared/components/collapsible'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from '@web-archive/shared/components/side-bar'
import { cn } from '@web-archive/shared/utils'
import { useRequest } from 'ahooks'
import { ChevronDown, TagIcon } from 'lucide-react'
import { useState } from 'react'
import { getAllTag } from '~/data/tag'

interface SidebarTagMenuProps {
  selectedTag: number | null
  setSelectedTag: (tag: number | null) => void
}

function SidebarTagMenu({ selectedTag, setSelectedTag }: SidebarTagMenuProps) {
  const { data: tags } = useRequest(getAllTag)
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
            {tags?.map(tag => (
              <SidebarMenuItem key={tag.id}>
                <SidebarMenuButton
                  onClick={() => {
                    handleClickTag(tag.id)
                  }}
                  className={cn('w-full justify-between', selectedTag === tag.id && 'bg-secondary')}
                >
                  {`# ${tag.name}`}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenu>
  )
}

export default SidebarTagMenu
