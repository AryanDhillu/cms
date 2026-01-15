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
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-white p-6 flex flex-col shadow-sm">
        <div className="mb-8">
          <h1 className="text-xl font-bold tracking-tight text-gray-900">CMS</h1>
          <p className="text-xs text-gray-500 mt-1">{user.email}</p>
          <p className="text-xs text-blue-600 font-mono mt-1 px-2 py-0.5 bg-blue-50 rounded w-fit capitalize border border-blue-100">
            {user.role}
          </p>
        </div>

        <nav className="space-y-2 flex-1">
          <Link
            href="/dashboard"
            className="block px-3 py-2 text-sm rounded text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/programs"
            className="block px-3 py-2 text-sm rounded text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            Programs
          </Link>

          {user.role === "ADMIN" && (
            <Link
              href="/dashboard/users"
              className="block px-3 py-2 text-sm rounded hover:bg-gray-100 transition-colors text-amber-600 font-medium"
            >
              User Management
            </Link>
          )}
        </nav>

        <div className="pt-6 border-t border-gray-200">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}

