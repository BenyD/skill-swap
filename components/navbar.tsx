"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const NavItems = () => (
    <>
      <Link href="/dashboard">
        <Button
          variant="ghost"
          className="text-gray-300 hover:text-white hover:bg-gray-800"
        >
          Dashboard
        </Button>
      </Link>
      <Link href="/profile-setup">
        <Button
          variant="ghost"
          className="text-gray-300 hover:text-white hover:bg-gray-800"
        >
          Profile
        </Button>
      </Link>
      <Link href="/create-post">
        <Button
          variant="ghost"
          className="text-gray-300 hover:text-white hover:bg-gray-800"
        >
          Create Post
        </Button>
      </Link>
      <Link href="/messages">
        <Button
          variant="ghost"
          className="text-gray-300 hover:text-white hover:bg-gray-800"
        >
          Messages
        </Button>
      </Link>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/75 backdrop-blur-xl supports-[backdrop-filter]:bg-gray-900/50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Skill Swap
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <NavItems />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-300">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-gray-900/95 border-gray-800">
              <div className="flex flex-col gap-4 mt-8">
                <NavItems />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
