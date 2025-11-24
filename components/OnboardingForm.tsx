"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUser } from "@/actions/user.actions";
import { METRO_STATIONS, LINES } from "@/lib/metroData"; // Ensure LINES is exported in metroData.ts

interface OnboardingFormProps {
  user: any;
}

export default function OnboardingForm({ user }: OnboardingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // UPDATE THIS SECTION 👇
  // We use "||" to fall back to empty string if the data is missing
  const [formData, setFormData] = useState({
    homeStation: user.homeStation || "",
    collegeStation: user.collegeStation || "",
    startTime: user.startTime || "08:30",
    contactMethod: user.contactMethod || "instagram",
    contactValue: user.contactValue || "",
    bio: user.bio || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await updateUser({
      clerkId: user.clerkId,
      homeStation: formData.homeStation,
      collegeStation: formData.collegeStation,
      startTime: formData.startTime,
      bio: formData.bio,
      contactMethod: formData.contactMethod,
      contactValue: formData.contactValue,
    });

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6">
      
      {/* 1. Route Selection (Now Categorized!) */}
      <div className="space-y-4 rounded-2xl bg-white/5 p-6 border border-white/10">
        <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2">
          🚇 Your Daily Route
        </h3>
        
        {/* Home Station Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Home Station</label>
          <select
            required
            className="w-full rounded-lg bg-black/50 border border-gray-700 p-3 text-white focus:border-blue-500 focus:outline-none"
            value={formData.homeStation}
            onChange={(e) => setFormData({ ...formData, homeStation: e.target.value })}
          >
            <option value="" disabled>Select Station</option>
            {/* Grouping by Line */}
            {LINES.map((line) => (
              <optgroup key={line} label={`${line} Line`}>
                {METRO_STATIONS.filter(s => s.line === line).map((station) => (
                  <option key={station.id} value={station.name}>
                    {station.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* College Station Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">College Station</label>
          <select
            required
            className="w-full rounded-lg bg-black/50 border border-gray-700 p-3 text-white focus:border-blue-500 focus:outline-none"
            value={formData.collegeStation}
            onChange={(e) => setFormData({ ...formData, collegeStation: e.target.value })}
          >
            <option value="" disabled>Select Station</option>
            {LINES.map((line) => (
              <optgroup key={line} label={`${line} Line`}>
                {METRO_STATIONS.filter(s => s.line === line).map((station) => (
                  <option key={station.id} value={station.name}>
                    {station.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Usually start at</label>
          <input
            type="time"
            required
            className="w-full rounded-lg bg-black/50 border border-gray-700 p-3 text-white focus:border-blue-500 focus:outline-none"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
          />
        </div>
      </div>

      {/* 2. Contact Preference (WhatsApp vs Insta) */}
      <div className="space-y-4 rounded-2xl bg-white/5 p-6 border border-white/10">
        <h3 className="text-xl font-bold text-green-400 flex items-center gap-2">
          📞 Contact Info
        </h3>
        <p className="text-xs text-gray-500">This will only be shared with people you accept.</p>

        {/* The Toggle Switch */}
        <div className="flex gap-4 mb-2">
            <button
                type="button"
                onClick={() => setFormData({ ...formData, contactMethod: "instagram" })}
                className={`flex-1 py-2 rounded-lg text-sm font-bold border ${formData.contactMethod === "instagram" ? "bg-pink-600 border-pink-500 text-white" : "bg-black/40 border-gray-700 text-gray-400"}`}
            >
                Instagram
            </button>
            <button
                type="button"
                onClick={() => setFormData({ ...formData, contactMethod: "whatsapp" })}
                className={`flex-1 py-2 rounded-lg text-sm font-bold border ${formData.contactMethod === "whatsapp" ? "bg-green-600 border-green-500 text-white" : "bg-black/40 border-gray-700 text-gray-400"}`}
            >
                WhatsApp
            </button>
        </div>

        {/* The Input Field (Changes based on toggle) */}
        <div>
          <div className="relative">
             <span className="absolute left-3 top-3 text-gray-500">
                {formData.contactMethod === "instagram" ? "@" : "+91"}
             </span>
             <input
                type={formData.contactMethod === "whatsapp" ? "number" : "text"}
                required
                placeholder={formData.contactMethod === "whatsapp" ? "9876543210" : "username"}
                className="no-spinner w-full rounded-lg bg-black/50 border border-gray-700 p-3 pl-12 text-white focus:border-green-500 focus:outline-none"
                value={formData.contactValue}
                onChange={(e) => setFormData({ ...formData, contactValue: e.target.value })}
             />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Short Bio</label>
          <textarea
            rows={2}
            placeholder="E.g. BTech CSE 2nd Year. I sleep in metro 😴"
            className="w-full rounded-lg bg-black/50 border border-gray-700 p-3 text-white focus:border-blue-500 focus:outline-none resize-none"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-4 font-bold text-white shadow-lg transition-transform hover:scale-[1.02] cursor-pointer active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? "Saving Profile..." : "Complete Profile →"}
      </button>

    </form>
  );
}