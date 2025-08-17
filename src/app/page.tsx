'use client'

import { SignInButton, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Button } from '~/components/ui/button'
import { useEffect } from 'react'

export default function Page() {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard') // redirect after login
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded || isSignedIn) return null // wait until loaded / redirect

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url('https://media.istockphoto.com/id/1669453534/photo/3d-render-cloud-computing-circuit-board-background.jpg?s=612x612&w=0&k=20&c=hpJ-qm6jT-Ip-1grdsbw6Xkr_fWz36UV_JnMB68geJc=')`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 text-center px-4 space-y-6">
        <h1 className="text-5xl font-bold text-yellow-400 drop-shadow-lg">
          Welcome to API Dashboard
        </h1>
        <p className="text-gray-300 text-lg drop-shadow-sm">
          Manage your API keys effortlessly. Sign in to get started!
        </p>

        <SignInButton>
          <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-200">
            Sign In
          </Button>
        </SignInButton>
      </div>
    </div>
  )
}
