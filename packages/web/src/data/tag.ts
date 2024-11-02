import type { Tag } from '@web-archive/shared/types'
import fetcher from '~/utils/fetcher'

function getAllTag(): Promise<Tag[]> {
  return fetcher<Tag[]>('/tags/all', {
    method: 'GET',
  })
}

export {
  getAllTag,
}
