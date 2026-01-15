import { getCurrentUser } from "@/lib/getCurrentUser";
import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

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
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-xl font-bold tracking-tight">CMS</h1>
          <p className="text-xs text-gray-400 mt-1">{user.email}</p>
          <p className="text-xs text-blue-400 font-mono mt-1 px-2 py-0.5 bg-blue-900/20 rounded w-fit capitalize">
            {user.role}
          </p>
        </div>

        <nav className="space-y-2 flex-1">
          <Link
            href="/dashboard"
            className="block px-3 py-2 text-sm rounded hover:bg-white/10 transition-colors"
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/programs"
            className="block px-3 py-2 text-sm rounded hover:bg-white/10 transition-colors"
          >
            Programs
          </Link>

          {user.role === "ADMIN" && (
            <Link
              href="/dashboard/users"
              className="block px-3 py-2 text-sm rounded hover:bg-white/10 transition-colors text-yellow-500 font-medium"
            >
              User Management
            </Link>
          )}
        </nav>

        <div className="pt-6 border-t border-gray-800">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}

