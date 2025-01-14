export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_company: boolean;
  is_superuser: boolean;
  is_admin: boolean;
  is_staff: boolean;
  created_at: Date;
  updated_at: Date;
  profile_pic: string;
}

export interface CompanyProfileImages {
  id: number;
  image: string;
  comment: string | null;
}

export interface CompanyProfile {
  slug: string;
  user: string;
  company_name: string | null;
  num_of_employees: string | null;
  year_started: number | null;
  about_company: string | null;
  company_values: string | null;
  company_profile_image: string | null;
  company_images: CompanyProfileImages[];
}

export interface Job {
  slug: string;
  company: string;
  first_name: string;
  last_name: string;
  email: string;
  job_title: string;
  address: string | null;
  remote: boolean;
  salary: number | null;
  salaryTo: number | null;
  salary_type: string | null;
  work_email: string;
  phone_number: string;
  description: string | null;
  current_role: string;
  is_closed: boolean;
  date_posted: Date;
  company_profile_image: string;
  company_slug: string;
  company_name: string;
  num_applicants: number;
}

export interface JobsData {
  results: Job[];
  previous: string;
  next: string;
  count: number;
}

export interface CompaniesData {
  results: CompanyProfile[];
  previous: string;
  next: string;
  count: number;
}

export interface Seeker {
  slug: string;
  user: string;
  user_profile_image: string;
  name: string;
  phone_number: string | null;
  email: string;
  other_comment: string | null;
  date_posted: Date;
  cv: string | null;
  transcript: string | null;
}

export interface SeekerData {
  results: Seeker[];
  previous: string;
  next: string;
  count: number;
}
