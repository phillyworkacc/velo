import { connectToDatabase } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import EditorsDb from "@/db/editor";
import UsersDb from "@/db/user";

export async function POST (req: NextRequest) {
   try {
      const body = await req.json()
      const { userid } = body;
      await connectToDatabase();
      const editor = await EditorsDb.findOne({ userid });
      const editorUser = await UsersDb.findOne({ userid });
      const editorDetails: EditorDetails = {
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
      }
      return NextResponse.json({ editorDetails })
   } catch (e) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 500 });
   } 

}