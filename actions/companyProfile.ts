"use server";

import { CompanyProfile } from "@/types/api.types";
import { cookies } from "next/headers";

export async function getCompanyProfile(): Promise<CompanyProfile | null> {
  let company: CompanyProfile | null;

  const token = (await cookies()).get("token")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user-company-profile/`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    if (!res.ok) {
      return null;
    }

    company = await res.json();

    return company;
  } catch (error) {
    return null;
  }
}
