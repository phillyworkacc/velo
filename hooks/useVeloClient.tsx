"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { checkClientSecurityCode, completeClientOnboarding, deleteClientAccount, finishClientOnboarding, setClientPassword, updateClientNotes, updateClientPlatforms, updateClientPosts } from "@/app/actions/client";
import { toast } from "sonner";
import { titleCase } from "@/lib/str";
import { useRouter } from "next/navigation";

type ClientContextType = {
   client: ClientDetails | null;
   isLoadingClient: boolean;
   actions: {
      deleteAccount: () => void,
      platforms: {
         add: (newPlatform: SocialMediaPlatform) => void;
         edit: (platform: SocialMedia, newPlatform: SocialMediaPlatform) => void;
         delete: (platform: SocialMedia) => void;
      },
      saveNotes: (newNotes: string) => void,
      posts: {
         add: (newPost: ClientPost) => void;
         delete: (date: number) => void;
      }
   }
   onboarding: {
      checkSecurityCode: (code: string) => Promise<boolean>;
      setPassword: (password: string) => Promise<boolean>;
      finishOnboarding: (onboardingAnswers: Onboarding) => Promise<boolean>;
      completeOnboarding: () => Promise<boolean>;
   }
};

const VeloClientContext = createContext<ClientContextType | undefined>(undefined);

export const VeloClientProvider = ({ children, userid }: { children: ReactNode, userid: string }) => {
   const [client, setClient] = useState<ClientDetails | null>(null);
   const [isLoadingClient, setIsLoadingClient] = useState(true);
   const router = useRouter();

   const getUser = async () => {
      const response = await fetch('/api/client', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
         body: JSON.stringify({ userid }) }
      );
      const result = await response.json();
      return result.clientDetails;
   }

   const checkSecurityCode = async (code: string) => {
      if (!client) return false;
      const isValid = await checkClientSecurityCode(client.user.email, code);
      return isValid;
   }

   const setPassword = async (password: string) => {
      if (!client) return false;
      const isSet = await setClientPassword(client.user.email, password);
      return isSet;
   }

   const finishOnboarding = async (onboarding: Onboarding) => {
      if (!client) return false;
      const isFinished = await finishClientOnboarding(onboarding);
      return isFinished;
   }

   const completeOnboarding = async () => {
      if (!client) return false;
      const isFinished = await completeClientOnboarding(client.user.email);
      return isFinished;
   }

   const addPlatform = async (newPlatform: SocialMediaPlatform) => {
      if (client == null) return;
      const isAdded = await updateClientPlatforms(userid, [
         ...client.platforms,
         newPlatform
      ]);
      if (isAdded) {
         toast.success(`Added ${titleCase(newPlatform.platform)} Account to ${client.user.name}'s Account`);
         setClient(prev => ({
            ...client, platforms: [...client.platforms, newPlatform]
         }))
      } else {
         toast.error(`Failed to add ${titleCase(newPlatform.platform)} account to ${client.user.name}'s account`);
      }
   }

   const deletePlatform = async (platform: SocialMedia) => {
      if (client == null) return;
      const isDeleted = await updateClientPlatforms(userid, [
         ...client.platforms.filter((ptForm) => ptForm.platform !== platform),
      ]);
      if (isDeleted) {
         toast.success(`Successfully deleted ${titleCase(platform)} Account`);
         setClient(prev => ({
            ...client, platforms: client.platforms.filter((ptForm) => ptForm.platform !== platform),
         }))
      } else {
         toast.error(`Failed to delete ${titleCase(platform)} account`);
      }
   }

   const editPlatform = async (platform: SocialMedia, newPlatform: SocialMediaPlatform) => {
      if (client == null) return;
      const isEdited = await updateClientPlatforms(userid, [
         ...client.platforms.filter((ptForm) => ptForm.platform !== platform),
         newPlatform
      ]);
      if (isEdited) {
         toast.success(`Edited ${titleCase(platform)} Account`);
         setClient(prev => ({
            ...client, 
            platforms: [
               ...client.platforms.filter((ptForm) => ptForm.platform !== platform),
               newPlatform
            ]
         }))
      } else {
         toast.error(`Failed to edit ${titleCase(platform)} account`);
      }
   }

   const addPost = async (newPost: ClientPost) => {
      if (client == null) return;
      const isAdded = await updateClientPosts(userid, [ newPost, ...client.posts ]);
      if (isAdded) {
         toast.success(`Added Post to ${client.user.name}'s Account`);
         setClient(prev => ({
            ...client, posts: [ newPost, ...client.posts ]
         }))
      } else {
         toast.error(`Failed to add post to ${client.user.name}'s account`);
      }
   }

   const deletePost = async (date: number) => {
      if (client == null) return;
      const isDeleted = await updateClientPosts(userid, [
         ...client.posts.filter((post) => post.date !== date),
      ]);
      if (isDeleted) {
         toast.success(`Successfully deleted post`);
         setClient(prev => ({
            ...client, posts: client.posts.filter((post) => post.date !== date)
         }))
      } else {
         toast.error(`Failed to delete post`);
      }
   }

   const saveNotes = async (newNotes: string) => {
      if (client == null) return;
      const isSaved = await updateClientNotes(userid, newNotes);
      if (isSaved) {
         setClient(prev => ({
            ...client, notes: newNotes
         }))
      };
   }
   
   const deleteAccount = async () => {
      if (!client) return;
      const deleted = await deleteClientAccount(client.userid);
      if (deleted) {
         toast.success(`Successfully deleted ${client.user.name}'s account`);
         router.push('/admin/clients');
      } else {
         toast.error(`Failed to delete ${client.user.name}'s account`);
      }
   }

   useEffect(() => {
      const load = async () => {
         setIsLoadingClient(true);
         try {
            const result = await getUser();
            setClient(result);
         } catch (err) {
            setClient(null);
            console.error("Failed to load client", err);
         }
         setIsLoadingClient(false);
      };
      load();
   }, [])

   return (
      <VeloClientContext.Provider value={{
         client, 
         isLoadingClient,
         actions: {
            deleteAccount,
            platforms: {
               add: addPlatform,
               edit: editPlatform,
               delete: deletePlatform,
            },
            saveNotes,
            posts: {
               add: addPost,
               delete: deletePost
            }
         },
         onboarding: {
            checkSecurityCode,
            setPassword,
            finishOnboarding,
            completeOnboarding
         }
      }}>
         {children}
      </VeloClientContext.Provider>
   );
};

export const useVeloClient = () => {
   const context = useContext(VeloClientContext);
   if (!context) throw new Error("useVeloClient must be used within VeloClientProvider");
   return context;
};