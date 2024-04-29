"use server";

import {
  clearAuthenticatedUser,
  getAuthenticatedUser,
  setAuthenticatedUser,
} from "@/lib/auth";
import { uploadFile } from "@/lib/firebase/uploader";
import {
  authenticate,
  createUser,
  setupUserAccount,
  updateUserAccount,
} from "@/server/controllers/users";
import { getViberDetails } from "@/server/controllers/viber";
import { revalidatePath } from "next/cache";

// prettier-ignore
export async function doLogin(formData: FormData, pathname:string):Promise<ActionReturn<AuthUser>> {
    
    const username = formData.get("username")?.toString();
    const password = formData.get("password")?.toString();

    const isPhone = verifyPhoneNumber(username||"");
    const data = {password} as any

    if (isPhone){
        data["phone"] = username
    }else{
        data["username"] = username
    }

    const user = await authenticate(data)

    if (user) {
        setAuthenticatedUser(user);
        revalidatePath(pathname, "layout");

        return {
            data:user,
            success:true,
            message: "You've successfully logged in"
        }
    }

    return {
        success:false,
        message:"Invalid username or password"
    }
}

// prettier-ignore
export async function doSignOut(pathname: string): Promise<ActionReturn<null>> {
  const signedOut = clearAuthenticatedUser();
  if (signedOut) {
    revalidatePath(pathname, "layout");

    return {
      success: true,
      data: null,
      message: "You've successfully logged out",
    };
  }
  return {
    success: false,
    message: "Failed to log out. Please try again",
  };
}

// prettier-ignore
export async function doRegister(formData: FormData, path: string): Promise<ActionReturn<any>> {
  const name = formData.get("name")?.toString();
  const phone = formData.get("phone")?.toString();
  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();

  if (!name){
    return {
      success: false,
      message: "Name is required, please enter your name",
    }
  }

  if (!password){
    return {
      success: false,
      message: "Password is required, please enter your password",
    }
  }

  const isPhone = verifyPhoneNumber(phone || "");
  if (!isPhone) {
    return {
      success: false,
      message: "Invalid phone number format",
    };
  }

  const isUsername = verifyUsername(username || "");
  if (!isUsername) {
    return {
      success: false,
      message: "Invalid username, only letters and numbers are allowed",
    };
  }

  const response = await createUser({
    name,
    phone,
    username,
    password,
  })

  if (!response){
    return {
      success: false,
      message: "Failed to create user. Please try again",
    }
  }

  if (typeof response === "string") {
    return {
      success: false,
      message: response,
    };
  }

  setAuthenticatedUser({
    name:name,
    username:username!,
    avatar:null
  })
  revalidatePath(path, "layout");

  return {
    success: true,
    data: response,
    message: "You've successfully registered. Please log in",
  }
}

// prettier-ignore
export async function setupAccount(formData: FormData, pathname:string): Promise<ActionReturn<boolean>> {
  const user = getAuthenticatedUser();
  if (!user) {
    return {
      success: false,
      message: "Please log in first",
    };
  }

  const userType = formData.get("userType")?.toString() as AuthUser["userType"];

  if (!userType) {
    return {
      success: false,
      message: "User type is required",
    };
  }

  if (!["viber", "user", "admin"].includes(userType)) {
    return {
      success: false,
      message: "Invalid user type",
    };
  }

  const json = Object.fromEntries(formData.entries())
  const response = await setupUserAccount(user.username, {...json, userType})

  if (response === 0)
    {

      const _user = await authenticate({username: user.username, usernameOnly: true} as any)
      if (!_user) return {
        success: false,
        message: "Failed to create user. Please try again",
      }
      setAuthenticatedUser(_user)
      revalidatePath(pathname, "layout");

      return {
        success: true,
        data: true,
        message: "Account setup successfully",
      }
    }

  return {
    success: false,
    message: response,
  }
}

// prettier-ignore
export async function uploadAvatar( formData: FormData, pathname:string): Promise<ActionReturn<boolean>> {
  const user = getAuthenticatedUser();
  if (!user) {
    return {
      success: false,
      message: "Please log in first",
    };
  }
  const file = formData.get("avatar") as File;
  if (!file) {
    return {
      success: false,
      message: "File is required",
    };
  }

  const avatarUrl = await uploadFile(file, "avatar");

  if (!avatarUrl) {
    return {
      success: false,
      message: "Failed to upload avatar. Please try again",
    };
  }

  const updated = await updateUserAccount(user.username, {
    avatar: avatarUrl,
  } as any);

  if (updated !== 0) {
    return {
      success: false,
      message: "Failed to upload avatar. Please try again",
    };
  }
  const _user = await authenticate({username: user.username, usernameOnly: true} as any)
  if (!_user) return {
    success: false,
    message: "Failed to create user. Please try again",
  }
  setAuthenticatedUser(_user)
  revalidatePath(pathname, "layout");
  return {
    success: true,
    data: true,
    message: "Avatar uploaded successfully",
  };
}

export async function getSetupDetails(
  username: string,
  userType?: AuthUser["userType"]
) {
  userType = userType || "viber";

  if (userType === "viber") {
  }
  return await getViberDetails(undefined, undefined, username);
}

function verifyPhoneNumber(phone: string) {
  if (!phone.startsWith("+")) {
    phone = "+220 " + phone;
  }
  // write a code to verify phone number
  const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return regex.test(phone);
}

function verifyUsername(username: string) {
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(username);
}
