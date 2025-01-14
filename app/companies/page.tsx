import React from "react";
import { getUserProfile } from "@/actions/userProfile";
import { getAllCompanies } from "@/actions/companies";
import CompanyList from "@/components/CompanyList";

async function Companies() {
  const user = await getUserProfile();
  const companies = await getAllCompanies();
  return (
    <div>
      <CompanyList companies={companies} user={user?.[0]}></CompanyList>
    </div>
  );
}

export default Companies;
