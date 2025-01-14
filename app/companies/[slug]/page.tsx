import { getCompany } from "@/actions/companyProfile";
import { getJobs } from "@/actions/jobs";
import { getUserProfile } from "@/actions/userProfile";
import Profile from "@/components/CompanyProfile/Profile";
import Footer from "@/components/Footer";
import NavbarComponent from "@/components/Navbar/Primary";
import React from "react";

type tParams = Promise<{ slug: string }>;

async function CompanyProfile({ params }: { params: tParams }) {
  const { slug } = await params;
  const user = await getUserProfile();
  const company = await getCompany(slug);
  const jobs = await getJobs(company?.slug);

  return (
    <div className="text-black">
      <NavbarComponent user={user?.[0]}></NavbarComponent>
      <Profile
        viewer={true}
        user={user?.[0]}
        company={company}
        jobs={jobs}
      ></Profile>
      <div className="mt-20">
        <Footer></Footer>
      </div>
    </div>
  );
}

export default CompanyProfile;
