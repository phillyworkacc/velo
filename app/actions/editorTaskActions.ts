"use server"
import { connectToDatabase } from "@/db/db";
import EditorsDb from "@/db/editor";
import EditorTasksDb from "@/db/editorTask";
import UsersDb from "@/db/user";

export async function getEditorTask (taskId: string) {
   try {
      await connectToDatabase();
      const editorTask = await EditorTasksDb.findOne({ taskId });
      return JSON.parse(JSON.stringify(editorTask));
   } catch (e) {
      return null;
   }
}

export async function getEditorTaskAnalytics (editorTaskId: string) {
   try {
      await connectToDatabase();
      const editors = await EditorsDb.find({});
      
      const editorsCompleted = editors.reduce((acc: number, editor: Editor) => {
         if (editor.tasksCompleted.filter(tasksComp => tasksComp.taskId === editorTaskId).length > 0) {
            acc += 1;
         }
         return acc;
      }, 0);
   
      const editorsApproved = editors.reduce((acc: number, editor: Editor) => {
         if (editor.tasksApproved.filter(tasksComp => tasksComp.taskId === editorTaskId).length > 0) {
            acc += 1;
         }
         return acc;
      }, 0);

      return {
         completed: editorsCompleted,
         approved: editorsApproved
      }
   } catch (e) {
      return null;
   }
}

export async function getEditorsWhoAreApprovedForTask (editorTaskId: string) {
   try {
      await connectToDatabase();
      const editors = await EditorsDb.find({});
      const editorsWhoAreApproved = editors.filter((editor: Editor) => (
         editor.tasksApproved.filter(taskApp => taskApp.taskId == editorTaskId).length > 0
      ))
      const ewa = await Promise.all(
         editorsWhoAreApproved.map(async(editor: Editor) => {
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

      return JSON.parse(JSON.stringify(ewa));
   } catch (e) {
      return null;
   }
}

export async function deleteEditorTaskCompletion(userid: string, taskId: string) {
   try {
      await connectToDatabase();

      const editor = await EditorsDb.findOne({ userid });
      editor.tasksCompleted = [...editor.tasksCompleted.filter((taskComp: any) => taskComp.taskId !== taskId)];
      editor.tasksApproved = [...editor.tasksApproved.filter((taskApp: any) => taskApp.taskId !== taskId)];
      editor.payments = [...editor.payments.filter((payment: any) => payment.taskId !== taskId)];

      await editor.save();
      return true;
   } catch (err) {
      return false;
   }
}

export async function getTasksCompletedByEditor (userid: string) {
   try {
      await connectToDatabase();

      const editor = await EditorsDb.findOne({ userid });
      const tasksCompletedByEditor = editor.tasksCompleted.reduce((acc: string[], task: EditorTaskStatus) => {
         acc.push(task.taskId);
         return acc;
      }, [])

      return JSON.parse(JSON.stringify(tasksCompletedByEditor));
   } catch (err) {
      return null;
   }
}

export async function checkIfEditorHasCompletedTask (userid: string, editorTaskId: string) {
   try {
      await connectToDatabase();
      const editor = await EditorsDb.findOne({ userid });
      return (editor.tasksCompleted.filter((tasksComp: EditorTaskStatus) => (tasksComp.taskId == editorTaskId)).length > 0)
   } catch (err) {
      return null;
   }
}

export async function getEditorSubmissionForTask (userid: string, editorTaskId: string) {
   try {
      await connectToDatabase();
      const editor = await EditorsDb.findOne({ userid });
      return editor.tasksCompleted.find((tasksComp: EditorTaskStatus) => (tasksComp.taskId == editorTaskId))
         ? JSON.parse(JSON.stringify(editor.tasksCompleted.find((tasksComp: EditorTaskStatus) => (tasksComp.taskId == editorTaskId))))
         : false;
   } catch (err) {
      return null;
   }
}