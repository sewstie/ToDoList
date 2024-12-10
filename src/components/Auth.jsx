// src/components/Auth.jsx
import React from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

const Auth = () => {
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <button
        onClick={signInWithGoogle}
        className="px-4 py-2 bg-focus text-white rounded hover:bg-focus transition"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default Auth;
