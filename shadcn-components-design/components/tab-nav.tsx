"use client";

import { useState } from "react";
import { cn } from "@/lib/utils"; // Asumiendo que usas la utilidad estándar de Shadcn

const tabs = ["Home", "Initiatives", "Foundations", "About Us"];

export function TabNav() {
  const [activeTab, setActiveTab] = useState("Home");

  return (
    <nav className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        {/* Contenedor con scroll oculto pero funcional */}
        <div className="flex gap-8 overflow-x-auto scrollbar-hide items-center justify-start md:justify-center">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "relative pb-4 pt-4 text-sm font-medium whitespace-nowrap transition-all duration-200 ease-in-out outline-none",
                activeTab === tab
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab}
              {/* Línea animada inferior */}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
