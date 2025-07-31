import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AddEditor from "./AddEditor";

export async function generateMetadata() {
   const session = await getServerSession(authOptions);
   return {
      title: `Add Editor - Admin - ${session?.user?.name!}`,
   };
}

export default async function AddEditorPage () {
   const session = await getServerSession(authOptions);
   if (session?.user) {
      return <AddEditor />;
   } else {
      redirect('/login');
   }
}
