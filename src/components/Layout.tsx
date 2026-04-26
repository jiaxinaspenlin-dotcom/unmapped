import { ReactNode } from "react";
import { Logo } from "./Logo";

export type AppView = "home" | "youth" | "institution" | "localize" | "data";

interface LayoutProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  children: ReactNode;
}

export function Layout({ activeView, onNavigate, children }: LayoutProps) {
  const isHome = activeView === "home";

  return (
    <div className="min-h-screen bg-[#c8d2da] text-ink">
      <header className={`sticky top-0 z-20 ${isHome ? "border-b border-white/5 bg-[#071832]" : "border-b border-slate-200/70 bg-white"}`}>
        <div className={`mx-auto flex h-[72px] items-center ${isHome ? "max-w-[1608px] px-6 sm:px-8 xl:px-0" : "max-w-[1680px] px-6 sm:px-10 lg:px-16"}`}>
          <Logo variant={isHome ? "light" : "dark"} onClick={() => onNavigate("home")} />
        </div>
      </header>
      <main id="top" className={isHome ? "max-w-none p-0" : "mx-auto max-w-[1680px] px-6 py-8 sm:px-10 sm:py-10 lg:px-16"}>
        {children}
      </main>
    </div>
  );
}
