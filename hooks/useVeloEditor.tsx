"use client"
import { deleteEditorAccount } from "@/app/actions/editor";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";

type EditorContextType = {
   editor: EditorDetails | null;
   isLoadingEditor: boolean;
   actions: {
      deleteAccount: () => void;
   }
};

const VeloEditorContext = createContext<EditorContextType | undefined>(undefined);

export const VeloEditorProvider = ({ children, userid }: { children: ReactNode, userid: string }) => {
   const [editor, setEditor] = useState<EditorDetails | null>(null);
   const [isLoadingEditor, setIsLoadingEditor] = useState(true);
   const router = useRouter();

   const getUser = async () => {
      const response = await fetch('/api/editor', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
         body: JSON.stringify({ userid }) }
      );
      const result = await response.json();
      return result.editorDetails;
   }

   const deleteAccount = async () => {
      if (!editor) return;
      const deleted = await deleteEditorAccount(editor.userid);
      if (deleted) {
         toast.success(`Successfully deleted ${editor.user.name}'s account`);
         router.push('/admin/editors');
      } else {
         toast.error(`Failed to delete ${editor.user.name}'s account`);
      }
   }

   useEffect(() => {
      const load = async () => {
         setIsLoadingEditor(true);
         try {
            const result = await getUser();
            setEditor(result);
         } catch (err) {
            setEditor(null);
            console.error("Failed to load editor", err);
         }
         setIsLoadingEditor(false);
      };
      load();
   }, [])

   return (
      <VeloEditorContext.Provider value={{
         editor, 
         isLoadingEditor,
         actions: {
            deleteAccount
         },
      }}>
         {children}
      </VeloEditorContext.Provider>
   );
};

export const useVeloEditor = () => {
   const context = useContext(VeloEditorContext);
   if (!context) throw new Error("useVeloEditor must be used within VeloEditorProvider");
   return context;
};