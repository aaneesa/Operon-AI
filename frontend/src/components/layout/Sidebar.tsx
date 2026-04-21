"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Upload, 
  FileText, 
  BrainCircuit, 
  MessageSquare, 
  FileDown,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Upload Data", href: "/upload-data", icon: Upload },
  { name: "Upload Policy", href: "/upload-policy", icon: FileText },
  { name: "AI Insights", href: "/insights", icon: BrainCircuit },
  { name: "Chat", href: "/chat", icon: MessageSquare },
  { name: "Reports", href: "/reports", icon: FileDown },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-white border-r border-black/10 h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <Image src="/logo.png" alt="Operon AI" width={40} height={40} className="rounded-sm" />
        <span className="text-xl font-bold tracking-tighter">OPERON AI</span>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-black text-white" 
                  : "text-black/60 hover:bg-black/5 hover:text-black"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-black/10">
        <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-black/60 hover:text-black transition-colors w-full">
          <Settings className="w-5 h-5" />
          Settings
        </button>
      </div>
    </div>
  );
}
