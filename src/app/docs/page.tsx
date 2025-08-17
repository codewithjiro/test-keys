'use client'

import AuthGuard from '../component/AuthGuard'
import { useRouter } from 'next/navigation'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'

export default function DocsPage() {
  const router = useRouter()

  return (
    <AuthGuard>
      <div className="p-8 space-y-6">
        <h1 className="text-3xl font-bold text-yellow-400">API Documentation (Placeholder)</h1>
        <Card className="bg-gray-800 p-6 space-y-4">
          <p className="text-gray-300">Section 1: Overview of API</p>
          <p className="text-gray-300">Section 2: Authentication</p>
          <p className="text-gray-300">Section 3: Endpoints</p>
        </Card>
        <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
      </div>
    </AuthGuard>
  )
}
