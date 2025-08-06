import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/db/db";
import { VeloEditorProvider } from "@/hooks/useVeloEditor";
import EditorPage from "./EditorPage";
import UsersDb from "@/db/user";

type ClientAdminPageProps = {
   params: Promise<{
      userid: string;
   }>
}

export async function generateMetadata ({ params }: ClientAdminPageProps) {
   const { userid } = await params;
   await connectToDatabase();
   const editor = await UsersDb.findOne({ userid, role: 'editor' });
   return {
      title: `${editor.name} - Editor`,
   };
}

export default async function EditorAdminPage ({ params }: ClientAdminPageProps) {
   const { userid } = await params;
   await connectToDatabase();
   const session = await getServerSession(authOptions);
   if (session?.user) {
      return <VeloEditorProvider userid={userid}>
         <EditorPage />
      </VeloEditorProvider>
   } else {
      redirect('/login');
   }

}
