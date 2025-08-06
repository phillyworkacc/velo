'use server'
import { connectToDatabase } from "@/db/db";
import UsersDb from "@/db/user"
import EditorsDb from "@/db/editor";

export async function completeTask (taskId: string, userid: string, googleDriveLink: string): Promise<boolean> {
   try {
      await connectToDatabase();
      const user = await UsersDb.findOne({ userid, role: 'editor' });
      
      if (user) {
         const editor = await EditorsDb.findOne({ userid });
         editor.tasksCompleted = [ 
            {
               taskId,
               googleDriveLink,
               date: Date.now()
            },
            ...editor.tasksCompleted.filter((taskComp: EditorTaskStatus) => taskComp.taskId !== taskId)
         ]
         await editor.save();
         return true;
      } else {
         return false;
      }
   } catch (e) {
      return false;
   }
}

export async function deleteEditorAccount (userid: string): Promise<boolean> {
   try {
      await UsersDb.deleteOne({ userid });
      await EditorsDb.deleteOne({ userid });
      return true;
   } catch (e) {
      return false;
   }
}