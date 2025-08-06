import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import EditorTasks from "./EditorTasks";

export async function generateMetadata() {
   const session = await getServerSession(authOptions);
   return {
      title: `Editor Tasks - Admin - ${session?.user?.name!}`,
   };
}

export default async function EditorTasksPage () {
   const session = await getServerSession(authOptions);
   if (session?.user) {
      return <EditorTasks />;
   } else {
      redirect('/login');
   }

}
