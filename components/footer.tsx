"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Skill Swap
            </span>
          </Link>

          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/about"
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              About
            </Link>
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              Contact
            </Link>
          </div>

          <div className="text-sm text-gray-500">
            © {currentYear} Skill Swap. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
