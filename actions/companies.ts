"use server";

import { CompaniesData } from "@/types/api.types";
import { cookies } from "next/headers";

export async function getAllCompanies(): Promise<CompaniesData | null> {
  let companies: CompaniesData | null;

  const token = (await cookies()).get("token")?.value;

  try {
    let res;

    if (token) {
      res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/company-profiles/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
    } else {
      res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company-profiles/`);
    }

    if (!res.ok) {
      return null;
    }

    companies = await res.json();

    return companies;
  } catch (error) {
    return null;
  }
}
