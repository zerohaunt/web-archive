import { ScrollArea } from '@web-archive/shared/components/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@web-archive/shared/components/collapsible'
import { ChevronDown, FolderIcon, HomeIcon, LogOut, Plus, Settings, Trash2 } from 'lucide-react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from '@web-archive/shared/components/side-bar'
import type { Folder as FolderType } from '@web-archive/shared/types'
import Folder from '@web-archive/shared/components/folder'
import { Skeleton } from '@web-archive/shared/components/skeleton'
import { useRequest } from 'ahooks'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { cn, isNil, isNumberString } from '@web-archive/shared/utils'
import { useLocation } from 'react-router-dom'
import { Button } from '@web-archive/shared/components/button'
import NewFolderDialog from './new-folder-dialog'
import EditFolderDialog from './edit-folder-dialog'
import SettingDialog from './setting-dialog'
import { useNavigate, useParams } from '~/router'
import emitter from '~/utils/emitter'
import { deleteFolder, getAllFolder } from '~/data/folder'

function getNextFolderId(folders: Array<FolderType>, index: number) {
  if (index === 0 && folders.length === 1) {
    return null
  }
  if (index === 0) {
    return folders[index + 1].id
  }
  return folders[index - 1].id
}

function Component() {
  const navigate = useNavigate()
  const { data: folders, refresh, mutate: setFolders, loading: foldersLoading } = useRequest(getAllFolder)

  const [openedFolder, setOpenedFolder] = useState<number | null>(null)
  const handleFolderClick = (id: number) => {
    setOpenedFolder(id)
  }

  const handleDeleteFolder = async (folderId: number) => {
    if (isNil(folders) || !confirm('Are you sure you want to delete this folder?'))
      return

    try {
      await deleteFolder(folderId)
      const oldFolderIndex = folders.findIndex(folder => folder.id === folderId)
      const nextFolderId = getNextFolderId(folders, oldFolderIndex)
      setFolders(folders.filter((_, index) => index !== oldFolderIndex))
      if (nextFolderId !== null)
        setOpenedFolder(nextFolderId)
      else
        navigate('/')
      toast.success('Folder deleted successfully')
    }
    catch (error) {
      toast.error('Failed to delete folder')
    }
  }

  const [editFolderDialogOpen, setEditFolderDialogOpen] = useState(false)
  const [editFolder, setEditFolder] = useState<FolderType>()
  const handleEditFolder = (folderId: number) => {
    setEditFolder(folders?.find(folder => folder.id === folderId))
    setEditFolderDialogOpen(true)
  }

  useEffect(() => {
    if (openedFolder !== null) {
      navigate('/folder/:slug', { params: { slug: openedFolder.toString() } })
    }
  }, [openedFolder])

  const { slug } = useParams('/folder/:slug')
  const { pathname } = useLocation()
  useEffect(() => {
    if (pathname.startsWith('/folder/') && isNumberString(slug))
      setOpenedFolder(Number(slug))
  }, [slug, pathname])

  emitter.on('refreshSideBar', refresh)

  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const [settingDialogOpen, setSettingDialogOpen] = useState(false)

  const [isFoldersCollapseOpen, setIsFoldersCollapseOpen] = useState(true)

  return (
    <Sidebar>
      <NewFolderDialog afterSubmit={refresh} open={newFolderDialogOpen} setOpen={setNewFolderDialogOpen} />
      <EditFolderDialog
        afterSubmit={refresh}
        open={editFolderDialogOpen}
        setOpen={setEditFolderDialogOpen}
        editFolder={editFolder}
      />
      <SettingDialog open={settingDialogOpen} setOpen={setSettingDialogOpen} />

      <SidebarHeader>
        <div className="flex justify-center items-center">
          <img src="/logo.svg" className="w-10 scale-x-[-1]" />
          <h2 className="mt-2 pr-4 pl-2 text-lg font-semibold tracking-tight leading-5">
            Web
            <br />
            {' '}
            Archive
          </h2>
        </div>
      </SidebarHeader>

      <SidebarContent className="mt-4">
        <SidebarMenu>
          <SidebarMenuButton className="w-full justify-between" onClick={() => navigate('/')}>
            <div className="flex items-center">
              <HomeIcon className="mr-2 h-4 w-4" />
              Home
            </div>
          </SidebarMenuButton>
        </SidebarMenu>
        <SidebarMenu>
          <Collapsible open={isFoldersCollapseOpen} onOpenChange={setIsFoldersCollapseOpen}>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton className="w-full justify-between">
                <div className="flex items-center">
                  <FolderIcon className="mr-2 h-4 w-4" />
                  Folders
                </div>
                <ChevronDown className={cn('h-4 w-4 transition-transform', isFoldersCollapseOpen && 'rotate-180')} />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <ScrollArea className="max-h-72">
                  {foldersLoading
                    ? (
                      <>
                          {Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton key={index} className="w-full h-10" />
                          ))}
                        </>
                      )
                    : (
                        folders?.map(folder => (
                          <SidebarMenuItem key={folder.id}>
                              <SidebarMenuButton>
                                <Folder
                                  name={folder.name}
                                  id={folder.id}
                                  isOpen={openedFolder === folder.id}
                                  onClick={handleFolderClick}
                                  onDelete={handleDeleteFolder}
                                  onEdit={handleEditFolder}
                                />
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))
                      )}
                </ScrollArea>
                <SidebarMenuItem>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setNewFolderDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Folder
                  </Button>
                </SidebarMenuItem>
              </SidebarMenuSub>

            </CollapsibleContent>
          </Collapsible>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => {
              setSettingDialogOpen(true)
              setOpenedFolder(null)
            }}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => {
              setOpenedFolder(null)
              navigate('/trash')
            }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Trash
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => {
              setOpenedFolder(null)
              handleLogout()
            }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

    </Sidebar>
  )
}

export default Component
