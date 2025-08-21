"use client";

import AuthGuard from "../component/AuthGuard";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";

// UI Components
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
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
import {
  Copy,
  Edit2,
  Trash2,
  BookOpen,
  Plus,
  KeyRound,
  Shield,
} from "lucide-react";

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

    setGenerateDialogOpen(false);
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
      <div className="min-h-screen space-y-10 bg-gradient-to-b from-[#12101a] to-[#1a1825] px-8 py-10 text-gray-100">
        {/* Header */}
        <header className="flex flex-col gap-6 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-yellow-400" />
              <h1 className="text-3xl font-bold tracking-tight text-yellow-400">
                KeyVault
              </h1>
            </div>
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
          </div>

          {/* Mobile-Friendly Welcome Section */}
          <div className="flex flex-col items-center gap-6 rounded-3xl bg-gradient-to-r from-[#1e1c2a]/80 to-[#2c2937]/80 p-6 shadow-2xl backdrop-blur-md sm:p-8 lg:flex-row">
            {/* Left: Text */}
            <div className="flex-1 space-y-3 text-center text-gray-200 lg:text-left">
              <h2 className="text-2xl font-extrabold text-yellow-400 sm:text-3xl">
                Welcome, {user?.fullName || "User"}!
              </h2>
              <p className="text-xs text-gray-400 sm:text-sm">
                You’re now in your KeyVault dashboard. Here, you can generate
                secure API keys, manage your existing keys, and integrate them
                safely with your applications. Keep your keys private and
                monitor their usage to stay secure.
              </p>
              <p className="text-xs text-gray-400 sm:text-sm">
                Tip: Only share your API keys with trusted applications. You can
                revoke or rename any key at any time directly from this
                dashboard.
              </p>
            </div>

            {/* Right: Circular Robot Image */}
            <div className="flex flex-1 items-center justify-center">
              <div className="relative h-36 w-36 overflow-hidden rounded-full shadow-xl sm:h-48 sm:w-48 lg:h-56 lg:w-56">
                <img
                  src="https://media3.giphy.com/media/v1.Y2lkPTZjMDliOTUybzR6bW8zYW1nM2wzNGE3YW5vZjhibnNta3V0eWpkcnpkbHA2cTVwbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/7x3PHPSMXSONHFuOK4/giphy.gif"
                  alt="Robot Illustration"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Generate Section */}
        <Card className="rounded-2xl border border-gray-700/60 bg-[#1e1c2a]/80 shadow-xl backdrop-blur-md transition hover:shadow-yellow-500/10">
          <CardHeader>
            <h2 className="text-lg font-semibold">Generate API Key</h2>
            <p className="text-sm text-gray-400">
              Create secure keys to integrate KeyVault with your applications.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Dialog
              open={generateDialogOpen}
              onOpenChange={setGenerateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 rounded-lg bg-yellow-500 text-black transition hover:bg-yellow-400">
                  <Plus size={16} /> New Key
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

        {/* Keys Section - Modern Card Layout */}
        <Card className="rounded-2xl border border-gray-700/60 bg-[#1e1c2a]/80 shadow-xl backdrop-blur-md transition hover:shadow-yellow-500/10">
          <CardHeader>
            <h2 className="text-lg font-semibold">Your Keys</h2>
            <p className="text-sm text-gray-400">
              Manage, copy, rename, or revoke your API keys.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {keys.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <KeyRound size={40} className="mb-3 text-gray-500" />
                <p>No API keys yet. Create one above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {keys.map((k) => (
                  <div
                    key={k.id}
                    className="flex flex-col justify-between rounded-xl border border-gray-700/40 bg-[#2a2838]/80 p-4 shadow-md transition hover:shadow-yellow-400/30"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-yellow-400">
                        {k.name}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          k.status === "Active"
                            ? "bg-green-900/40 text-green-400"
                            : "bg-red-900/40 text-red-400"
                        }`}
                      >
                        {k.status}
                      </span>
                    </div>

                    {/* Key */}
                    <p className="mt-2 font-mono text-sm break-all text-yellow-300">
                      {k.key}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Created on{" "}
                      {new Date(k.id).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>

                    {/* Actions */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 rounded-lg border-gray-700 hover:bg-gray-700"
                        onClick={() => copyKey(k.key)}
                      >
                        <Copy size={16} className="mr-1" /> Copy
                      </Button>

                      <Dialog
                        open={renameDialogOpen}
                        onOpenChange={setRenameDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 rounded-lg border-gray-700 hover:bg-gray-700"
                            onClick={() => openRenameModal(k.id, k.name)}
                          >
                            <Edit2 size={16} className="mr-1" /> Rename
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
                          className="flex-1 rounded-lg bg-red-600 hover:bg-red-500"
                          onClick={() => revokeKey(k.id)}
                        >
                          <Trash2 size={16} className="mr-1" /> Revoke
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Toaster */}
        <Toaster richColors />
      </div>
    </AuthGuard>
  );
}
