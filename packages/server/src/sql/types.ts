type Tag = {
  id: number
  name: string
  pageIds: string
  createdAt: Date
  updatedAt: Date

}

export type { Page, Folder } from '@web-archive/shared/types/model'
export type { Tag }
