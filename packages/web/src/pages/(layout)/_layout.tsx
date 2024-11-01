import { Toaster } from 'react-hot-toast'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { SidebarProvider } from '@web-archive/shared/components/side-bar'
import SideBar from '~/components/side-bar'
import Hamburger from '~/components/hamburger'

function Layout() {
  const [keyword, setKeyword] = useState('')
  const [searchTrigger, setSearchTrigger] = useState(false)

  const handleSearch = () => {
    setSearchTrigger(prev => !prev)
  }

  return (
    <main className="flex min-h-screen">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <SidebarProvider>
        <div className="flex-1 flex">
          <SideBar />
          <div className="flex-1">
            <Hamburger className="lg:hidden block fixed top-[50%] left-0 cursor-pointer z-50" />
            <Outlet context={{ keyword, searchTrigger, handleSearch, setKeyword }} />
          </div>
        </div>
      </SidebarProvider>
    </main>
  )
}

export default Layout
