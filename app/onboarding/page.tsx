import { createUser } from "@/actions/user.actions";
import { redirect } from "next/navigation";
import OnboardingForm from "@/components/OnboardingForm"; // You keep your existing logic component

export default async function OnboardingPage() {
  const user = await createUser();
  if (!user) redirect("/");

  return (
    <div className="min-h-screen flex items-center justify-center p-6 pb-24">
      
      {/* The Paper Sheet */}
      <div className="paper-card w-full max-w-lg p-8 relative bg-white rotate-1">
        
        {/* Tape at top */}
        <div className="tape"></div>

        <div className="mb-8 text-center mt-4">
            <h1 className="font-hand text-4xl font-bold text-slate-900 highlight-yellow inline-block px-4">
                Student ID
            </h1>
            <p className="font-mono text-xs text-slate-500 mt-2 uppercase tracking-widest">
                Registration Form v1.0
            </p>
        </div>

        {/* NOTE: You need to pass 'user' to your form component.
           Ensure your OnboardingForm.tsx uses the new CSS classes!
           (See instructions below for OnboardingForm styles)
        */}
        <OnboardingForm user={JSON.parse(JSON.stringify(user))} />
        
      </div>
    </div>
  );
}