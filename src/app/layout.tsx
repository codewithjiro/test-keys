import { ClerkProvider } from "@clerk/nextjs";
import "../styles/globals.css";

export const metadata = {
  title: "API Key Dashboard",
  description: "UI-only API Key Management Lab",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#1e1c2a] text-white">
        <ClerkProvider
          afterSignInUrl="/dashboard"
          afterSignOutUrl="/"
          appearance={{
            baseTheme: "dark" // just a string in the latest App Router version
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
