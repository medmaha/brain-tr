import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY!;

if (!SECRET_KEY) throw new Error("Application is missing a SECRET_KEY");

const MAX_AGE = 60 * 60 * 24 * 7; // 7 day

/**
 * Gets the auth token from the cookies
 * And decodes it with the secret key
 */
export function getAuthUserCookies() {
  const session = cookies().get("_sid")?.value;
  const authUser = decodeJWT<AuthUser>(session);
  return { authUser };
}

/**
 * Sets the user's session in the cookies
 * @param AuthUser user - The user to authenticated
 * @returns {boolean} True if the session was set
 */
export function setAuthUserCookies(user: AuthUser) {
  try {
    const session = jwt.sign(user, SECRET_KEY, { expiresIn: MAX_AGE });
    const cookie = cookies().set("_sid", session, {
      maxAge: MAX_AGE,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });
    return session && cookie.get("_sid")?.value;
  } catch (error) {
    return false;
  }
}

/**
 * Securely Clears the user's session from the cookies
 * @returns {boolean} True if the session was cleared
 */
export function clearAuthUserCookies() {
  try {
    const session = cookies().get("_sid")?.value;
    if (session) {
      const cleared = cookies().set("_sid", "", {
        maxAge: 0,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });
      // TODO: Check if the session is a valid JWT
      // TODO: Blacklist the session if it's still a valid session
      return Boolean(cleared);
    }
  } catch (error) {}
  return true;
}

export function decodeJWT<T>(token?: string) {
  if (token) {
    try {
      const decoded = jwt.decode(token);
      return decoded as T;
    } catch (error) {
      return null;
    }
  }
  return null;
}
