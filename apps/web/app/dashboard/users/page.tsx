import { getCurrentUser } from "@/lib/getCurrentUser";
import { requireAdmin } from "@/lib/requireAdmin";
import CreateUserForm from "./CreateUserForm";

export default async function UsersPage() {
  const user = await getCurrentUser();
  requireAdmin(user);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Onboard New User</h2>
        <p className="text-gray-400 mb-6 text-sm">
          Register an existing Supabase authentication user into the CMS system.
          They must have signed up via Auth provider first.
        </p>
        <CreateUserForm />
      </div>
    </div>
  );
}
