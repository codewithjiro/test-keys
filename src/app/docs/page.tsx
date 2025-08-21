"use client";

import AuthGuard from "../component/AuthGuard";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { motion } from "framer-motion";
import { BookOpen, KeyRound, Shield, Rocket } from "lucide-react";

export default function DocsPage() {
  const router = useRouter();

  const sections = [
    {
      id: "overview",
      title: "Overview",
      icon: <Rocket className="h-5 w-5 text-yellow-400" />,
      content: (
        <p>
          Welcome to <span className="text-yellow-400 font-semibold">KeyVault</span> API
          documentation. Learn how to create, manage, and use your API keys
          securely.
        </p>
      ),
    },
    {
      id: "authentication",
      title: "Authentication",
      icon: <Shield className="h-5 w-5 text-yellow-400" />,
      content: (
        <div className="mt-3">
  <pre className="rounded-lg bg-[#2a2838] p-3 text-sm text-gray-200 font-mono overflow-x-auto">
    <code>
      {`curl -H "Authorization: Bearer YOUR_API_KEY" https://api.example.com/data`}
    </code>
  </pre>
</div>

      ),
    },
    {
      id: "endpoints",
      title: "Endpoints",
      icon: <BookOpen className="h-5 w-5 text-yellow-400" />,
      content: (
        <ul className="list-disc pl-6 space-y-2 text-gray-300">
          <li>
            <span className="text-yellow-400">GET</span> /api/data — Fetch your
            data.
          </li>
          <li>
            <span className="text-yellow-400">POST</span> /api/data — Add new
            data.
          </li>
          <li>
            <span className="text-yellow-400">DELETE</span> /api/data/:id —
            Delete an entry.
          </li>
        </ul>
      ),
    },
    {
      id: "keys",
      title: "Managing Keys",
      icon: <KeyRound className="h-5 w-5 text-yellow-400" />,
      content: (
        <ul className="list-disc pl-6 space-y-2 text-gray-300">
          <li>Generate new keys from the dashboard.</li>
          <li>Revoke keys you no longer use.</li>
          <li>Store keys in environment variables for security.</li>
        </ul>
      ),
    },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#12101a] px-8 py-10 text-gray-100 space-y-10">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-800 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-yellow-400">
            API Documentation
          </h1>
          <Button
            className="rounded-lg bg-neutral-800 text-gray-200 shadow-md transition hover:bg-neutral-700"
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </header>

        {/* Search */}
        <div className="max-w-lg">
          <Input
            placeholder="Search documentation..."
            className="rounded-lg border-gray-700 bg-[#1e1c2a] text-gray-100 focus:border-yellow-400 focus:ring-yellow-400"
          />
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((s, i) => (
            <motion.section
              key={s.id}
              id={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="scroll-mt-20"
            >
              <Card className="rounded-2xl border border-gray-700/60 bg-[#1e1c2a]/80 shadow-lg backdrop-blur-md">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    {s.icon}
                    <h2 className="text-lg font-semibold text-yellow-400">
                      {s.title}
                    </h2>
                  </div>
                  <div className="text-gray-300 leading-relaxed">
                    {s.content}
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
