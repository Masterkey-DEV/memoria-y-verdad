"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  Heart,
  MessageCircle,
  Home,
  Rocket,
  Building2,
  UserPlus,
  User,
  LogIn,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavLink {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

export function Header() {
  const [open, setOpen] = useState(false);

  const navLinks: NavLink[] = [
    { name: "Inicio", href: "/", icon: <Home className="h-4 w-4" /> },
    {
      name: "Emprendimientos",
      href: "/products",
      icon: <Rocket className="h-4 w-4" />,
    },
    {
      name: "Iniciativas",
      href: "/initiatives",
      icon: <MessageCircle className="h-4 w-4" />,
    },
    {
      name: "Fundaciones",
      href: "/foundations",
      icon: <Building2 className="h-4 w-4" />,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        {/* IZQUIERDA */}
        <div className="flex items-center gap-4">
          {/* MENU MOBILE */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[300px]">
              <SheetTitle className="text-left font-black text-2xl mb-8 italic">
                REINTEGRATION <span className="text-primary">PORTAL</span>
              </SheetTitle>

              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-lg font-semibold hover:bg-primary/10 transition-all"
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}

                <hr className="my-4" />

                {/* Dropdown simplificado en mobile */}
                <Link
                  href="/foundations/register"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-primary"
                >
                  <UserPlus className="h-5 w-5" />
                  Registrar Fundación
                </Link>

                <Link
                  href="/user"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-primary"
                >
                  <User className="h-5 w-5" />
                  Registrar Persona
                </Link>

                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold"
                >
                  <LogIn className="h-5 w-5" />
                  Iniciar Sesión
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* LOGO */}
          <Link href="/" className="flex flex-col leading-[0.85] shrink-0">
            <span className="text-lg font-black tracking-tighter italic">
              REINTEGRATION
            </span>
            <span className="text-lg font-black tracking-tighter text-primary/80 italic">
              PORTAL
            </span>
          </Link>

          {/* NAV DESKTOP */}
          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2 rounded-full text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* DERECHA */}
        <div className="flex items-center gap-3">
          <Link
            href="/apoyo"
            className="hidden sm:flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-red-500 transition-colors"
          >
            <Heart className="h-4 w-4 fill-current" />
            Apoyar
          </Link>

          {/* BOTÓN INICIAR SESIÓN */}
          <Link href="/login">
            <Button variant="ghost" className="hidden md:flex font-bold">
              Iniciar Sesión
            </Button>
          </Link>

          {/* DROPDOWN REGISTRARSE */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="font-black px-5 rounded-xl">
                Registrarse
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link
                  href="/foundations/register"
                  className="flex items-center gap-2"
                >
                  <Building2 className="h-4 w-4" />
                  Fundación
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/user" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Persona Natural
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
