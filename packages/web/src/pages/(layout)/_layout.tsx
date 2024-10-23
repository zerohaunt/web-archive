import { Toaster } from 'react-hot-toast'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import SideBar from '~/components/side-bar'
import Header from '~/components/header'

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
      <div className="w-64">
        <SideBar />
      </div>
      <div className="flex-1 flex flex-col">
        <Header keyword={keyword} setKeyword={setKeyword} handleSearch={handleSearch} />
        <Outlet context={{ keyword, searchTrigger }} />
      </div>
    </main>
  )
}

export default Layout
