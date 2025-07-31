import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/db/db";
import EditorTasks from "./EditorTasks";
import EditorTasksDb from "@/db/editorTask";

export async function generateMetadata() {
   const session = await getServerSession(authOptions);
   return {
      title: `Editor Tasks - Admin - ${session?.user?.name!}`,
   };
}

export default async function EditorTasksPage () {
   const session = await getServerSession(authOptions);
   if (session?.user) {
      await connectToDatabase();
      const editorsTasks = await EditorTasksDb.find({});
      return <EditorTasks editorTasks={JSON.parse(JSON.stringify(editorsTasks))} />;
   } else {
      redirect('/login');
   }

}
