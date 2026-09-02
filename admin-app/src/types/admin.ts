// types/admin.ts

export interface Founder {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Organization {
  id: number | string;
  name: string;
  slug: string;
  status?: string;
}

export interface CreateOrganizationPayload {
  org_name: string;
  org_slug: string;
  admins: Founder[];
}