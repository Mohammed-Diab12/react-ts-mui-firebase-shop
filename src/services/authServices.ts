import { signInWithPopup, signOut } from "firebase/auth";
import { auth, GoogleProvider, GithubProvider } from "./firebase";

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, GoogleProvider);

  return result.user;
};

export const signInWithGithub = async () => {
  const result = await signInWithPopup(auth, GithubProvider);

  return result.user;
};

export const logout = async () => {
  await signOut(auth);
};
