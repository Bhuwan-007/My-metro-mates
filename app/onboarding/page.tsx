import { createUser } from "@/actions/user.actions";
import OnboardingForm from "@/components/OnboardingForm";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  // 1. Get the current user
  const user = await createUser();

  // 2. Safety: If not logged in, kick out
  if (!user) redirect("/");

  // 3. If ALREADY onboarded, don't show this page again
  //if (user.onboarded) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      
      {/* Background decoration */}
      <div className="fixed inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Setup Profile
          </h1>
          <p className="text-gray-400">
            Tell us your route so we can find your mates.
          </p>
        </div>

        <OnboardingForm user={user} />
      </div>

    </div>
  );
}