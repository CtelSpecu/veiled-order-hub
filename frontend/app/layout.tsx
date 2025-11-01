import type { Metadata } from "next";
import "./globals.css";
import { BrandLogo } from "@/components/BrandLogo";
import { WalletConnectButton } from "@/components/WalletConnectButton";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Veiled Order Hub",
  description:
    "Submit, manage, and decrypt privacy-preserving orders on FHEVM.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="zama-bg text-foreground antialiased">
        <div className="fixed inset-0 h-full w-full zama-bg z-[-20]" />
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <header className="sticky top-0 z-20 border-b border-base-200 bg-base-100/80 backdrop-blur">
              <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between px-4 py-6">
                <BrandLogo />
                <WalletConnectButton />
              </div>
            </header>
            <main className="relative z-10 flex-1">
              <div className="mx-auto w-full max-w-screen-xl px-4 pb-16 pt-8">
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
