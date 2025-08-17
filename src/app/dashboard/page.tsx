'use client'

import AuthGuard from '../component/AuthGuard'
import { useState } from 'react'
import { Toaster, toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { UserButton, useUser } from '@clerk/nextjs'

import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'

// Lucide Icons
import { Copy, Edit2, Trash2, BookOpen, Plus } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useUser()

  const [keys, setKeys] = useState([
    { id: 1, name: 'Test Key', key: 'abcd-1234-efgh' },
  ])
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [renameKeyId, setRenameKeyId] = useState<number | null>(null)
  const [renameValue, setRenameValue] = useState('')

  // Generate mock key
  const generateMockKey = () => {
    const newKey = { id: Date.now(), name: 'New Key', key: 'xxxx-xxxx-xxxx' }
    setKeys([newKey, ...keys])
    toast.success(`API Key "${newKey.name}" generated!`)
  }

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast.success('API Key copied to clipboard!')
  }

  const openRenameModal = (id: number, currentName: string) => {
    setRenameKeyId(id)
    setRenameValue(currentName)
    setRenameDialogOpen(true)
  }

  const handleRenameSubmit = () => {
    if (renameKeyId !== null && renameValue.trim() !== '') {
      setKeys(
        keys.map((k) =>
          k.id === renameKeyId ? { ...k, name: renameValue } : k
        )
      )
      toast.success('API Key renamed!')
      setRenameDialogOpen(false)
    } else {
      toast.error('Name cannot be empty.')
    }
  }

  const revokeKey = (id: number) => {
    setKeys(keys.filter((k) => k.id !== id))
    toast.error('API Key revoked!')
  }

  return (
    <AuthGuard>
      <div className="p-8 space-y-8 min-h-screen bg-gray-900 text-gray-100">
        {/* Header */}
        <header className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-yellow-400">API Dashboard</h1>

          <div className="flex items-center space-x-4">
            <Button
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white"
              onClick={() => router.push('/docs')}
            >
              <BookOpen size={18} />
              <span>Docs</span>
            </Button>

            {/* Clerk User Menu */}
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Generate API Key Button */}
        <div className="flex justify-start">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-400 text-black">
                <Plus size={16} />
                <span>Generate API Key</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-gray-100">
              <DialogHeader>
                <DialogTitle>API Key Generated</DialogTitle>
              </DialogHeader>
              <p className="my-4">
                This is a mock key (UI-only): <strong>xxxx-xxxx-xxxx</strong>
              </p>
              <Button
                onClick={generateMockKey}
                className="bg-yellow-500 hover:bg-yellow-400 text-black"
              >
                Add to Table
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        {/* API Keys Table */}
        <Card className="bg-gray-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((k) => (
                <TableRow key={k.id}>
                  <TableCell>{k.name}</TableCell>
                  <TableCell>{k.key}</TableCell>
                  <TableCell className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyKey(k.key)}
                    >
                      <Copy size={16} />
                    </Button>

                    <Dialog
                      open={renameDialogOpen}
                      onOpenChange={setRenameDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openRenameModal(k.id, k.name)}
                        >
                          <Edit2 size={16} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800 text-gray-100">
                        <DialogHeader>
                          <DialogTitle>Rename API Key</DialogTitle>
                        </DialogHeader>
                        <Input
                          placeholder="New Name"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          className="my-2 w-full"
                        />
                        <Button
                          className="mt-2 bg-yellow-500 hover:bg-yellow-400 text-black"
                          onClick={handleRenameSubmit}
                        >
                          Submit
                        </Button>
                      </DialogContent>
                    </Dialog>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => revokeKey(k.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Toaster */}
        <Toaster richColors />
      </div>
    </AuthGuard>
  )
}
