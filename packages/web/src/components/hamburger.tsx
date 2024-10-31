import { useSidebar } from '@web-archive/shared/components/side-bar'
import { SquareMenu } from 'lucide-react'

interface HamburgerProps {
  className?: string
  onClick?: () => void
}

function Hamburger({ className, onClick }: HamburgerProps) {
  const { openMobile, setOpenMobile } = useSidebar()
  return (
    <div className={`text-white bg-blue-600 py-2 pr-3 pl-1 rounded-r-[50%] ${className}`} onClick={() => setOpenMobile(!openMobile)}>
      <SquareMenu className="h-5 w-5" />
    </div>
  )
}

export default Hamburger
