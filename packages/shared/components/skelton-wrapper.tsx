import React, { useState, useEffect } from 'react'

interface SkeletonWrapperProps {
  loadingDeps: boolean
  skeleton: React.ReactNode
  children: React.ReactNode
  minDisplayTime?: number
}

function SkeletonWrapper({
  loadingDeps,
  skeleton,
  children,
  minDisplayTime = 500
}: SkeletonWrapperProps) {
  const [showSkeleton, setShowSkeleton] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (loadingDeps) {
      setShowSkeleton(true)
      timer = setTimeout(() => {
        if (!loadingDeps) {
          setShowSkeleton(false)
        }
      }, minDisplayTime)
    } else {
      timer = setTimeout(() => {
        setShowSkeleton(false)
      }, minDisplayTime)
    }
    return () => clearTimeout(timer)
  }, [loadingDeps, minDisplayTime])

  return showSkeleton ? skeleton : children
}

export default SkeletonWrapper
