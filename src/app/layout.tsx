import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
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
            baseTheme: dark
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}