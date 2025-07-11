// src/services/auth/AuthService.ts
export class AuthService {
  constructor(env: any) {}
  async login(email: string, password: string) {
    return { token: "stub-token", email };
  }
  async register(data: any) {
    return { userId: "stub-user", ...data };
  }
}
