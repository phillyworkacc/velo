import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/db/db";
import UsersDb from "@/db/user";
import Editors from "./Editors";
import EditorsDb from "@/db/editor";

export async function generateMetadata() {
   const session = await getServerSession(authOptions);
   return {
      title: `Editors - Admin - ${session?.user?.name!}`,
   };
}

export default async function EditorsPage () {
   const session = await getServerSession(authOptions);
   if (session?.user) {
      await connectToDatabase();
      const editors = await EditorsDb.find({});
      const editorsUserDetailsFilter = await Promise.all(
         editors.map(async(editor: Editor) => {
            const editorUser = await UsersDb.findOne({ userid: editor.userid });
            return {
               userid: editor.userid,
               tasksCompleted: editor.tasksCompleted,
               tasksApproved: editor.tasksApproved,
               payments: editor.payments,
               googleDriveFolderLink: editor.googleDriveFolderLink,
               user: {
                  userid: editorUser.userid,
                  name: editorUser.name,
                  description: editorUser.description,
                  email: editorUser.email,
                  image: editorUser.image,
                  role: editorUser.role,
                  credentialMethod: editorUser.credentialMethod,
                  onboarded: editorUser.onboarded,
                  date: editorUser.date
               }
            } as EditorDetails
         })
      )
      return <Editors editors={JSON.parse(JSON.stringify(editorsUserDetailsFilter))} />;
   } else {
      redirect('/login');
   }

}
