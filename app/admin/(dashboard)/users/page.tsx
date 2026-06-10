import { getStaffSession } from "@/lib/auth";
import { listInvitations, serializeInvitation } from "@/lib/invitations";
import { listUsers, serializeUser } from "@/lib/users";
import UsersManager from "../../../components/admin/UsersManager";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await getStaffSession();
  const roleFilter = session?.role === "admin" ? "client" : undefined;

  let users: ReturnType<typeof serializeUser>[] = [];
  let invitations: ReturnType<typeof serializeInvitation>[] = [];
  let loadError: string | null = null;

  try {
    const [userDocs, invitationDocs] = await Promise.all([
      listUsers(roleFilter),
      listInvitations(roleFilter),
    ]);
    users = userDocs.map(serializeUser);
    invitations = invitationDocs.map(serializeInvitation);
  } catch (err) {
    console.error("Failed to load users", err);
    loadError = "טעינת המשתמשים נכשלה. ודאו שמחרוזת ה-MongoDB מוגדרת כראוי.";
  }

  return (
    <div>
      <div>
        <h1 className="text-lg font-semibold text-white">ניהול משתמשים</h1>
        <p className="mt-1 text-sm text-zinc-400">
          {session?.role === "super-admin"
            ? "הזמינו אדמינים ולקוחות חדשים ועקבו אחרי המשתמשים הקיימים."
            : "הזמינו לקוחות חדשים ועקבו אחרי הלקוחות הקיימים."}
        </p>
      </div>

      <div className="mt-8">
        {loadError ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-300">
            {loadError}
          </div>
        ) : (
          <UsersManager
            initialUsers={users}
            initialInvitations={invitations}
            canInviteAdmins={session?.role === "super-admin"}
          />
        )}
      </div>
    </div>
  );
}
