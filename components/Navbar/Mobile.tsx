import { UserProfile } from "@/types/api.types";
import Link from "next/link";
import React from "react";
import Navbar from "../../components/Navbar/Primary";

function MobileNavbar({ user }: { user?: UserProfile | null }) {
  return (
    <div>
      <div className="bg-gray-100 flex gap-3 items-center justify-end border-b py-2 px-2">
        {!user?.is_company ? (
          <Link className="text-sm cursor-pointer font-medium" href="/jobs">
            Find jobs
          </Link>
        ) : null}
        {user?.is_company ? (
          <Link
            className="text-sm cursor-pointer font-medium"
            href="/company-profile"
          >
            Company Profile
          </Link>
        ) : null}
        <div className="text-sm cursor-pointer font-medium">About us</div>
        <div className="text-sm cursor-pointer font-medium">Contact us</div>
      </div>

      <Navbar user={user}></Navbar>
    </div>
  );
}

export default MobileNavbar;
