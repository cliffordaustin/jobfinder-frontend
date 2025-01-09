"use client";

import Logo from "./Logo";
import Burger from "./Burger";

import { UserProfile } from "@/types/api.types";
import { Button, Menu } from "@mantine/core";
import Link from "next/link";
import Image from "next/image";
import { IoLogOutOutline } from "react-icons/io5";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { defaultToastStyle } from "@/utils/theme";
import NProgress from "nprogress";
import { FaUser } from "react-icons/fa6";

const NavbarComponent = ({ user }: { user?: UserProfile | null }) => {
  const router = useRouter();
  const handleLogout = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/rest-auth/logout/`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${Cookies.get("token")}`,
        },
      }
    );

    if (res.ok) {
      Cookies.remove("token");
      NProgress.start();
      router.replace("/");
      return;
    }

    toast.error("Unable to logout", defaultToastStyle);
  };
  return (
    <div className="flex px-5 border-b border-b-zinc-200 bg-white/40 backdrop-blur-sm sticky top-0 left-0 right-0 z-50 md:px-20 py-4 justify-between items-center">
      {/* <div className="md:hidden">
        <Burger></Burger>
      </div> */}
      <Link href={{ pathname: "/" }}>
        <Logo type="small"></Logo>
      </Link>
      <div className="flex items-center text-black font-semibold gap-3 md:gap-8">
        {!user?.is_company ? (
          <Link
            className="text-base cursor-pointer hidden md:block"
            href="/jobs"
          >
            Find jobs
          </Link>
        ) : null}
        {user?.is_company ? (
          <Link
            className="text-base cursor-pointer hidden md:block"
            href="/company-profile"
          >
            Company Profile
          </Link>
        ) : null}
        <div
          className={
            "text-base cursor-pointer hidden lg:block " +
            (user?.is_company ? "md:block" : "")
          }
        >
          About us
        </div>
        <div className="text-base cursor-pointer hidden lg:block">
          Contact us
        </div>
        {user ? (
          <div>
            {user.is_company ? (
              <Button color="dark" className="hidden md:block">
                Find an intern
              </Button>
            ) : (
              <Button color="dark" className="hidden md:block">
                Find a company
              </Button>
            )}
          </div>
        ) : (
          <Button color="dark" className="hidden md:block">
            Find an intern
          </Button>
        )}
        {user ? (
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <div className="relative cursor-pointer border-2 bg-gray-400 flex items-center justify-center border-white/50 overflow-hidden w-[40px] h-[40px] rounded-full">
                {user.profile_pic ? (
                  <Image
                    src={user.profile_pic}
                    className="rounded-full object-cover"
                    alt="Profile Image"
                    fill
                  />
                ) : (
                  <FaUser size={25} />
                )}
              </div>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={
                  <IoLogOutOutline className="text-red-500" size={25} />
                }
                onClick={() => {
                  handleLogout();
                }}
              >
                <p className="text-red-500">Logout</p>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <Link
            href={{
              pathname: "/signup",
            }}
          >
            <Button variant="outline" color="dark.8" className="">
              Sign up
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavbarComponent;
