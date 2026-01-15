"use client";

import { useState } from "react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export function MobileNav({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">CMS</h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-600 rounded-md hover:bg-gray-100 focus:outline-none"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 space-y-3 shadow-lg">
           <div className="flex items-center gap-3 py-2 border-b border-gray-200 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                    {user.email?.[0] || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
            </div>

          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-white hover:text-blue-600 transition-colors"
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/programs"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-white hover:text-blue-600 transition-colors"
          >
            Programs
          </Link>

          {user.role === "ADMIN" && (
            <Link
              href="/dashboard/users"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-sm font-medium rounded-md text-amber-700 hover:bg-amber-50"
            >
              User Management
            </Link>
          )}

          <div className="pt-2 border-t border-gray-200 mt-2">
             <LogoutButton />
          </div>
        </div>
      )}
    </div>
  );
}
