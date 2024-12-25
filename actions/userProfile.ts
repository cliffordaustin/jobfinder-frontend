"use server";

import { UserProfile } from "@/types/api.types";
import { cookies } from "next/headers";

export async function getUserProfile(): Promise<UserProfile[] | null> {
  let user: UserProfile[] | null;

  const token = (await cookies()).get("token")?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!res.ok) {
      return null;
    }

    user = await res.json();

    return user;
  } catch (error) {
    return null;
  }
}
