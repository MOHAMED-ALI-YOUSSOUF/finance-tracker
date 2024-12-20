"use client";
import { createContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebase";

export const authContext = createContext({
  user: null,
  loading: false,
  googleLoginHandler: async () => {},
  logout: async () => {},
});
export default function AuthContextProvider({ children }) {
  const [user, loading] = useAuthState(auth);

  const googleProvider = new GoogleAuthProvider(auth);
  const googleLoginHandler = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      throw error;
    }
  };
  const logout = () =>{
    signOut(auth);
  }

  const values = {
    user,
    loading,
    googleLoginHandler,
    logout,
  };
  return <authContext.Provider value={values}>{children}</authContext.Provider>;
}
