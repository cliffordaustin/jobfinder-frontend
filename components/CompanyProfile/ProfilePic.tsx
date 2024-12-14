import { CompanyProfile, UserProfile } from "@/types/api.types";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa6";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

function ProfilePic({
  company,
  user,
}: {
  company: CompanyProfile | null;
  user?: UserProfile | null;
}) {
  const [showProfilePics, setShowProfilePics] = useState(false);

  const router = useRouter();

  const imageRef = React.useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<{
    image: File | null;
    profileImageProgress: number;
  }>({
    image: null,
    profileImageProgress: 0,
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;

    setFile({ ...file, image: event.target.files[0] });
  };

  useEffect(() => {
    if (file.image) {
      sendProfileImage();
    }
  }, [file.image]);

  const sendProfileImage = async () => {
    const fd = new FormData();
    if (!file.image || !user) return;

    fd.append("profile_pic", file.image, file.image.name);

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${user.id}/`,
        fd,
        {
          headers: {
            Authorization: "Token " + Cookies.get("token"),
          },
          onUploadProgress: (progressEvent) => {
            let percentCompleted = progressEvent.total
              ? Math.floor((progressEvent.loaded * 100) / progressEvent.total)
              : 0;

            setFile({ ...file, profileImageProgress: percentCompleted });
          },
        }
      );

      setFile({ image: null, profileImageProgress: 0 });

      if (imageRef.current) imageRef.current.value = "";
      location.reload();
    } catch (error) {
      if (imageRef.current) imageRef.current.value = "";
      setFile({ image: null, profileImageProgress: 0 });
      console.log("error", error);
    }
  };
  return (
    <div
      onMouseEnter={() => setShowProfilePics(true)}
      onMouseLeave={() => setShowProfilePics(false)}
      className="w-44 h-44 md:w-36 md:h-36 rounded-full relative cursor-pointer"
    >
      {company?.company_profile_image ? (
        <div className="relative border-4 border-white/50 overflow-hidden w-full h-full rounded-full">
          <Image
            src={company.company_profile_image}
            className="rounded-full object-cover"
            alt="Profile Image"
            fill
          />
        </div>
      ) : (
        <div className="w-full h-full relative flex bg-gray-300 items-center justify-center rounded-full">
          <FaUser size={90} />
        </div>
      )}

      <label
        className={
          "cursor-pointer z-50 " +
          (showProfilePics && company?.user === user?.email ? null : "hidden")
        }
      >
        <input
          className="hidden"
          accept="image/*"
          type="file"
          onChange={handleFileChange}
          ref={imageRef}
        />

        <div className="bg-black bg-opacity-70 w-44 h-44 md:w-36 md:h-36 rounded-full absolute top-0"></div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-purple-800 absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </label>
      {file.profileImageProgress > 0 ? (
        <div className="mt-2 relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="bg-purple-600 rounded-full h-full"
            style={{ width: file.profileImageProgress + "%" }}
          ></div>
          <div className="absolute right-2 text-sm text-zinc-800 top-2/4 font-bold z-20 -translate-y-2/4">
            {file.profileImageProgress}%
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ProfilePic;
