import { memo } from 'react'
import { GithubIcon } from './github'

function Comp() {
  return (
    <a href="https://github.com/ray-d-song/web-archive" target="_blank" rel="noreferrer" className="flex items-center justify-end gap-1 h-16 m-2 text-white bg-blue-600 p-2 rounded-lg self-end w-52">
      <div className="flex flex-col">
        <span>powered by</span>
        <span className="font-bold text-lg">
          Web Archive
        </span>
      </div>
      <GithubIcon className="inline-block h-10 w-10" />
    </a>
  )
}

const PoweredBy = memo(Comp)

export default PoweredBy
