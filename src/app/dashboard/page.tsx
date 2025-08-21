"use client";

import AuthGuard from "../component/AuthGuard";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";

// UI Components
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";

// Icons
import { Copy, Edit2, Trash2, BookOpen, Plus, KeyRound } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useUser();

  const [keys, setKeys] = useState<
    { id: number; name: string; key: string; status: "Active" | "Revoked" }[]
  >([]);

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameKeyId, setRenameKeyId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);

  // Fixed Key
  const FIXED_KEY = "abcd-1234-efgh";

  const generateKey = () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a name for your key.");
      return;
    }
    if (keys.some((k) => k.key === FIXED_KEY)) {
      toast.error("API Key already exists!");
      return;
    }

    const newKey = {
      id: Date.now(),
      name: newKeyName.trim(),
      key: FIXED_KEY,
      status: "Active" as const,
    };

    setKeys([newKey, ...keys]);
    setGeneratedKey(FIXED_KEY);
    toast.success(`API Key "${newKey.name}" generated!`);
    setNewKeyName("");
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API Key copied to clipboard!");
  };

  const openRenameModal = (id: number, currentName: string) => {
    setRenameKeyId(id);
    setRenameValue(currentName);
    setRenameDialogOpen(true);
  };

  const handleRenameSubmit = () => {
    if (renameKeyId !== null && renameValue.trim() !== "") {
      setKeys(
        keys.map((k) =>
          k.id === renameKeyId ? { ...k, name: renameValue } : k,
        ),
      );
      toast.success("API Key renamed!");
      setRenameDialogOpen(false);
    } else {
      toast.error("Name cannot be empty.");
    }
  };

  const revokeKey = (id: number) => {
    setKeys(keys.map((k) => (k.id === id ? { ...k, status: "Revoked" } : k)));
    toast.error("API Key revoked!");
  };

  return (
    <AuthGuard>
      <div className="min-h-screen space-y-10 bg-[#12101a] px-8 py-10 text-gray-100">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-800 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-yellow-400">
            KeyVault
          </h1>
          <div className="flex items-center space-x-4">
            <Button
              className="flex items-center gap-2 rounded-xl bg-neutral-800 text-gray-200 shadow-md transition hover:bg-neutral-700"
              onClick={() => router.push("/docs")}
            >
              <BookOpen size={18} />
              Documentation
            </Button>

            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Generate Section */}
        <Card className="rounded-2xl border border-gray-700/60 bg-[#1e1c2a]/80 shadow-xl backdrop-blur-md">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Generate API Key</h2>
              <Dialog
                open={generateDialogOpen}
                onOpenChange={setGenerateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="rounded-lg bg-yellow-500 text-black transition hover:bg-yellow-400">
                    <Plus size={16} className="mr-1" /> Create
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-xl border border-gray-700 bg-[#1e1c2a] text-gray-100 shadow-xl">
                  <DialogHeader className="border-b border-gray-700 pb-3">
                    <DialogTitle className="text-lg font-semibold text-yellow-400">
                      Generate New API Key
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 space-y-4">
                    <Input
                      placeholder="Enter API Key Name"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      className="w-full rounded-lg border-gray-700 bg-[#2a2838] focus:border-yellow-400 focus:ring-yellow-400"
                    />
                    <Button
                      onClick={generateKey}
                      className="w-full rounded-lg bg-yellow-500 text-black hover:bg-yellow-400"
                    >
                      Generate
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Visible once key */}
            {generatedKey && (
              <div className="rounded-lg border border-gray-700 bg-[#2a2838] p-4 transition">
                <p className="mb-2 text-sm font-semibold">
                  Here is your API Key (visible once):
                </p>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm text-yellow-300">
                    {generatedKey}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    onClick={() => copyKey(generatedKey)}
                  >
                    <Copy size={14} className="mr-1" /> Copy
                  </Button>
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  Save this key securely. You won’t be able to see it again.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Keys Table */}
        <Card className="rounded-2xl border border-gray-700/60 bg-[#1e1c2a]/80 shadow-xl backdrop-blur-md">
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Your Keys</h2>
            {keys.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <KeyRound size={40} className="mb-3 text-gray-500" />
                <p>No API keys yet. Create one above.</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-[#2a2838]">
                  <TableRow>
                    <TableHead className="text-gray-300">Label</TableHead>
                    <TableHead className="text-gray-300">Secret Key</TableHead>
                    <TableHead className="text-gray-300">Created On</TableHead>
                    <TableHead className="text-gray-300">State</TableHead>
                    <TableHead className="text-gray-300">Manage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keys.map((k, idx) => (
                    <TableRow
                      key={k.id}
                      className="transition hover:bg-gray-800/40"
                    >
                      <TableCell>{k.name}</TableCell>
                      <TableCell className="font-mono text-sm text-yellow-300">
                        {k.key}
                      </TableCell>
                      <TableCell className="text-sm text-gray-400">
                        {new Date(k.id).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            k.status === "Active"
                              ? "bg-green-900/40 text-green-400"
                              : "bg-red-900/40 text-red-400"
                          }`}
                        >
                          {k.status}
                        </span>
                      </TableCell>
                      <TableCell className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-lg border-gray-700 hover:bg-gray-700"
                          onClick={() => copyKey(k.key)}
                        >
                          <Copy size={16} />
                        </Button>

                        {/* Rename Modal */}
                        <Dialog
                          open={renameDialogOpen}
                          onOpenChange={setRenameDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-lg border-gray-700 hover:bg-gray-700"
                              onClick={() => openRenameModal(k.id, k.name)}
                            >
                              <Edit2 size={16} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="rounded-xl border border-gray-700 bg-[#1e1c2a] text-gray-100 shadow-xl">
                            <DialogHeader className="border-b border-gray-700 pb-3">
                              <DialogTitle className="text-lg font-semibold text-yellow-400">
                                Rename API Key
                              </DialogTitle>
                            </DialogHeader>
                            <Input
                              placeholder="New Name"
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              className="my-3 w-full rounded-lg border-gray-700 bg-[#2a2838] focus:border-yellow-400 focus:ring-yellow-400"
                            />
                            <Button
                              className="w-full rounded-lg bg-yellow-500 text-black hover:bg-yellow-400"
                              onClick={handleRenameSubmit}
                            >
                              Save
                            </Button>
                          </DialogContent>
                        </Dialog>

                        {k.status === "Active" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="rounded-lg bg-red-600 hover:bg-red-500"
                            onClick={() => revokeKey(k.id)}
                          >
                            Revoke
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Toaster */}
        <Toaster richColors />
      </div>
    </AuthGuard>
  );
}
