/* eslint-disable no-console */
import { useState, useEffect } from "react";

import type { Session } from "@supabase/auth-helpers-react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import type { Database } from "../../utils/database.types";
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

export default function Account({ session }: { session: Session }) {
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<Profiles["username"]>(null);
  const [website, setWebsite] = useState<Profiles["website"]>(null);
  const [avatar_url, setAvatarUrl] = useState<Profiles["avatar_url"]>(null);

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true);
        if (!user) throw new Error("No user");

        const { data, error, status } = await supabase
          .from("profiles")
          .select(`username, website, avatar_url`)
          .eq("id", user.id)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setUsername(data.username);
          setWebsite(data.website);
          setAvatarUrl(data.avatar_url);
        }
      } catch (error) {
        alert("Error loading user data!");
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, [session, supabase, user]);

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: Profiles["username"];
    website: Profiles["website"];
    avatar_url: Profiles["avatar_url"];
  }) {
    try {
      setLoading(true);
      if (!user) throw new Error("No user");

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error;
      alert("Profile updated!");
    } catch (error) {
      alert("Error updating the data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-widget">
      <div className="flex flex-col">
        <label className="text-sm text-neutral-600" htmlFor="email">
          Email
        </label>
        <input
          className="rounded p-2 text-neutral-900"
          id="email"
          type="text"
          value={session.user.email}
          disabled
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm text-neutral-600" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
          className="rounded p-2 text-neutral-900 bg-neutral-100"
        />
      </div>

      <div>
        <button
          className="rounded bg-slate-500 p-2 text-white"
          onClick={() => updateProfile({ username, website, avatar_url })}
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>

      <div>
        <button
          className="rounded bg-red-500 p-2 text-white"
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
