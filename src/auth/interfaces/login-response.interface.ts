export interface LoginResponseInterface {
  name: string;
  role: string;
  permissions: string[];
  expires_at: Date;
  access_token: string;
}
