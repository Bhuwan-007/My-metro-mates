import { createUser, getPendingUsers, approveUser, rejectUser } from "@/actions/user.actions";
import { redirect } from "next/navigation"; // <--- We will use this now

// ... (Keep the approve/reject helper functions exactly the same) ...
async function approve(formData: FormData) {
  "use server";
  await approveUser(formData.get("id") as string);
}

async function reject(formData: FormData) {
  "use server";
  await rejectUser(formData.get("id") as string, "ID not clear / invalid");
}

export default async function AdminPage() {
  const user = await createUser();
  
  // 🔒 SECURITY CONFIGURATION
  // Replace this string with the EXACT email you use to log in
  const ADMIN_EMAILS = ["chugh.bhuwan@gmail.com"]; 
  
  // 1. Security Check
  // If user is missing OR their email is not in the list -> KICK THEM OUT
  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    redirect("/"); 
  }

  const pendingUsers = await getPendingUsers();

  return (
    <div className="min-h-screen bg-black text-white p-10 font-sans">
      <h1 className="text-3xl font-bold mb-8">👮‍♂️ Admin Dashboard</h1>
      
      <div className="grid gap-6 max-w-4xl">
        {pendingUsers.length === 0 && (
            <div className="p-10 border border-dashed border-zinc-800 rounded-xl text-zinc-500 text-center">
                ✅ All clear! No pending verifications.
            </div>
        )}

        {pendingUsers.map((u: any) => (
            <div key={u.clerkId} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex items-center justify-between">
                
                <div className="flex items-center gap-4">
                    {/* Click to see full image in new tab */}
                    <a href={u.idCardUrl} target="_blank" className="block hover:opacity-80 transition-opacity">
                        <img src={u.idCardUrl} className="w-24 h-16 object-cover rounded-lg border border-zinc-700" />
                    </a>
                    <div>
                        <h3 className="font-bold text-lg text-white">{u.firstName} {u.lastName}</h3>
                        <p className="text-zinc-400 text-sm font-mono">{u.email}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <form action={reject}>
                        <input type="hidden" name="id" value={u.clerkId} />
                        <button className="bg-red-900/20 text-red-400 border border-red-900/50 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-900/40 transition-colors">
                            Reject
                        </button>
                    </form>
                    
                    <form action={approve}>
                        <input type="hidden" name="id" value={u.clerkId} />
                        <button className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-green-500 transition-colors shadow-lg shadow-green-900/20">
                            Approve
                        </button>
                    </form>
                </div>

            </div>
        ))}
      </div>
    </div>
  );
}