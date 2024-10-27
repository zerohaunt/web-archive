import { SquareMenu } from 'lucide-react'

interface HamburgerProps {
  className?: string
  onClick?: () => void
}

function Hamburger({ className, onClick }: HamburgerProps) {
  return (
    <div className={`text-white bg-blue-600 py-2 pr-3 pl-1 rounded-r-[50%] ${className}`} onClick={onClick}>
      <SquareMenu className="h-5 w-5" />
    </div>
  )
}

export default Hamburger
