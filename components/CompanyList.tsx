"use client";

import React from "react";
import NavbarComponent from "./Navbar/Primary";
import { CompaniesData, UserProfile } from "@/types/api.types";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import Image from "next/image";

function CompanyList({
  companies,
  user,
}: {
  companies: CompaniesData | null;
  user?: UserProfile | null;
}) {
  const router = useRouter();

  const viewCompanyProfile = (slug: string) => {
    nProgress.start();
    router.push(`/companies/${slug}`);
  };
  return (
    <div>
      <NavbarComponent user={user}></NavbarComponent>
      <div className="md:px-20 px-5 mt-10">
        <div className="mt-6">
          <div className="flex justify-center flex-wrap gap-4">
            {companies?.results.map((company) => (
              <div
                key={company.slug}
                onClick={() => viewCompanyProfile(company.slug)}
                className="w-80 sm:w-96 border h-[110px] bg-white flex items-center gap-4 rounded-lg hover:shadow-lg cursor-pointer transition-all duration-200"
              >
                {company.company_profile_image && (
                  <div className="relative h-full w-[100px]">
                    <Image
                      src={company.company_profile_image}
                      alt="Company Profile Image"
                      className="rounded-l-md object-cover"
                      fill
                    />
                  </div>
                )}
                <div>
                  <h1 className="text-xl font-bold truncate">
                    {company.company_name}
                  </h1>
                  <p className="text-base">Since {company.year_started}</p>
                  <p className="text-base text-green-600 font-medium">
                    About {company.num_of_employees} employees
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyList;
