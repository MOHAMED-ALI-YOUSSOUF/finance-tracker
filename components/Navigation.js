"use client";
import Image from "next/image";
import { ImStatsBars } from "react-icons/im";
import React, { useContext } from "react";
import { authContext } from "@/lib/store/auth-context";

const Nav = () => {
  const { user, loading, logout } = useContext(authContext); // Utilisez la destructuration d'objet

  return (
    <header className="container max-w-2xl px-6 py-6 mx-auto">
      <div className="flex justify-between items-center p-4">
        {/* Chargement */}
        { user && !loading && (
          // Utilisateur connecté
          <div className="flex items-center gap-2">
            <div className="rounded-full overflow-hidden w-[40px] h-[40px] relative">
              <Image
                src={user.photoURL || "https://picsum.photos/200/300"} // Utilisez `user.photoURL` si disponible
                alt="Profile Image"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <small className="font-medium">Hi, {user.displayName || "User"}</small>
          </div>
        )}

        {/* Navigation */}
        {user && !loading && (
          <nav className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <a href="#stats">
              <ImStatsBars size={24} />
                </a>
            </div>
            <button className="btn btn-danger" onClick={logout}>
              Logout
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Nav;
