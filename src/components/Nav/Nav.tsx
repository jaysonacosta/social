import React from "react";

import { useUser } from "@supabase/auth-helpers-react";

const Nav: React.FC = () => {
  const user = useUser();

  return (
    <nav className="bg-slate-500 p-5 text-white">
      <div className="container mx-auto flex items-center justify-between">
        <ul>
          <li>Social</li>
        </ul>
        <ul className="flex gap-x-5">
          {user ? (
            <>
              <li>Home</li>
              <li>Profile</li>
            </>
          ) : (
            <li>Sign in</li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
