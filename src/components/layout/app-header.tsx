import Image from "next/image";
import Link from "next/link";
import { FileText } from "lucide-react";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="The Royal Interior Studio"
            width={90}
            height={80}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link
            href="/"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <FileText className="h-4 w-4" />
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
