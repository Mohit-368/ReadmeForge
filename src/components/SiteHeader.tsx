import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.webp";
import NavHeader from "@/components/ui/nav-header";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="ReadmeForge logo" className="h-8 w-8" />
          <span className="font-display text-lg font-semibold tracking-tight">
            README<span className="text-gradient">Forge</span>
          </span>
        </Link>
        <NavHeader />
      </div>
    </header>
  );
}
