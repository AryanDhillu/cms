import { getCurrentUser } from "@/lib/getCurrentUser";
import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { MobileNav } from "./_components/MobileNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col md:flex-row">
      <MobileNav user={user} />

      <aside className="hidden md:flex flex-col w-64 border-r border-gray-200 bg-white shadow-sm h-screen sticky top-0">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">CMS</h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <Link
            href="/dashboard"
            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all"
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/programs"
            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all"
          >
            Programs
          </Link>

          {user.role === "ADMIN" && (
            <Link
              href="/dashboard/users"
              className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-amber-700 hover:bg-amber-50 hover:text-amber-800 transition-all"
            >
              User Management
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                    {user.email?.[0] || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                <LogoutButton />
            </div>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
    </div>
  );
}

