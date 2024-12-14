"use server";

import { JobsData } from "@/types/api.types";
import { cookies } from "next/headers";

export async function getJobs(slug?: string): Promise<JobsData | null> {
  let jobs: JobsData | null;

  const token = (await cookies()).get("token")?.value;

  if (!slug) {
    return null;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/companies/${slug}/jobs/`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!res.ok) {
    return null;
  }

  jobs = await res.json();

  return jobs;
}
