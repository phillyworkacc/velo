import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AddEditorTask from "./AddEditorTask";

export async function generateMetadata() {
   const session = await getServerSession(authOptions);
   return {
      title: `Add Editor Task - Admin - ${session?.user?.name!}`,
   };
}

export default async function AddEditorTaskPage () {
   const session = await getServerSession(authOptions);
   if (session?.user) {
      return <AddEditorTask />;
   } else {
      redirect('/login');
   }
}
