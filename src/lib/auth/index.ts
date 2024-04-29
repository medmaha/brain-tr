import {
  clearAuthUserCookies,
  getAuthUserCookies,
  setAuthUserCookies,
} from "./cookies";

export function getAuthenticatedUser() {
  const user: AuthUser = {
    name: "John Doe",
    avatar: "https://i.pravatar.cc/300",
    username: "johndoe",
  };

  const { authUser } = getAuthUserCookies();

  return authUser;
}

export function setAuthenticatedUser(user: AuthUser) {
  const modified = setAuthUserCookies(user);
  return Boolean(modified);
}

export function clearAuthenticatedUser() {
  const cleared = clearAuthUserCookies();

  return Boolean(cleared);
}
