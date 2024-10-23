import type { FormEvent } from 'react'
import { useState } from 'react'
import { Button } from '@web-archive/shared/components/button'
import { Input } from '@web-archive/shared/components/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@web-archive/shared/components/card'
import toast, { Toaster } from 'react-hot-toast'
import router from '~/utils/router'

export default function LoginPage() {
  const [key, setKey] = useState('')
  const [loading, setLoading] = useState(false)
  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    setLoading(true)
    e.preventDefault()
    if (key.length === 0) {
      toast.error('Key is required')
      return
    }
    fetch('api/auth', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
      },
    })
      .then(async (res) => {
        if (res.status === 200) {
          localStorage.setItem('token', key)
          router.navigate('/')
          return
        }
        if (res.status === 201) {
          toast.success('Admin token set, please use it login again')
          return
        }
        const json = await res.json()
        toast.error(json.error)
      })
      .catch(() => {
        toast.error('Something went wrong')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Web Archive</CardTitle>
          <CardDescription>Please enter your key to login</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Enter your key"
                value={key}
                onChange={e => setKey(e.target.value)}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
