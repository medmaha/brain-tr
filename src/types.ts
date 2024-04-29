interface AuthUser {
  name: string;
  avatar: string | null;
  username: string;
  userType?: "user" | "viber" | "admin" | null;
}
