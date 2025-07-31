"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { deleteUserAccount } from "@/app/actions/user";

type UserContextType = {
   user: UserDetails | null;
   isLoadingUser: boolean;
   deleteAccount: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
   const { status } = useSession();
   const [user, setUser] = useState<UserDetails | null>(null);
   const [isLoadingUser, setIsLoadingUser] = useState(true)

   const getUser = async () => {
      const result = await fetch('/api/user').then(res => res.json());
      return result;
   }
   
   const deleteAccount = async () => {
      if (!user) return;
      const deleted = await deleteUserAccount(user.userid);
      if (deleted) {
         toast.success(`Successfully deleted ${user.name}'s account`);
         signOut();
      } else {
         toast.error(`Failed to delete ${user.name}'s account`);
      }
   }

   useEffect(() => {
      const load = async () => {
         setIsLoadingUser(true);
         if (status === "authenticated") {
            try {
               const result = await getUser();
               setUser(result);
            } catch (err) {
               setUser(null);
               console.error("Failed to load user", err);
            }
         } else {
            setUser(null);
         }
         setIsLoadingUser(false);
      };

      load();
   }, [status])

   return (
      <UserContext.Provider value={{ user, isLoadingUser, deleteAccount }}>
         {children}
      </UserContext.Provider>
   );
};

export const useUser = () => {
   const context = useContext(UserContext);
   if (!context) throw new Error("useUser must be used within UserProvider");
   return context;
};