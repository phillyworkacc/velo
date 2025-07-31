'use server'
import { connectToDatabase } from "@/db/db";
import ClientsDb from "@/db/client";
import EditorsDb from "@/db/editor";
import UsersDb from "@/db/user";
import EditorTasksDb from "@/db/editorTask";

export async function getEditorWhoCompletedTask (taskId: string): Promise<EditorDetails[] | false> {
   try {
      await connectToDatabase();
      const editors = await EditorsDb.find({});
      if (editors) {
         const taskCompletedEditors = editors.filter((editor: Editor) => (
            (editor.tasksCompleted.filter(taskComp => taskComp.taskId == taskId).length > 0)
            && (editor.tasksApproved.filter(taskComp => taskComp.taskId == taskId).length < 1)
         ));
         const tce = await Promise.all(
            taskCompletedEditors.map(async(editor: Editor) => {
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
         return JSON.parse(JSON.stringify(tce));
      }
      return false;
   } catch (err) {
      return false;
   }
}

export async function getAllClients (): Promise<ClientDetails[] | false> {
   try {
      await connectToDatabase();
      const clients = await ClientsDb.find({});
      if (!clients) return false;
      const allClients = await Promise.all(
         clients.map(async(client: Client) => {
            const clientUser = await UsersDb.findOne({ userid: client.userid });
            return {
               userid: client.userid,
               platforms: client.platforms,
               googleDriveFolderLink: client.googleDriveFolderLink,
               posts: client.posts,
               notes: client.notes,
               user: {
                  userid: clientUser.userid,
                  name: clientUser.name,
                  description: clientUser.description,
                  email: clientUser.email,
                  image: clientUser.image,
                  role: clientUser.role,
                  credentialMethod: clientUser.credentialMethod,
                  onboarded: clientUser.onboarded,
                  date: clientUser.date
               }
            } as ClientDetails
         })
      )
      return JSON.parse(JSON.stringify(allClients));
   } catch (err) {
      return false;
   }
}

type ApprovePostParams = {
   taskId: string;
   price: number;
   clientUserId: string;
   editorUserId: string;
   postPlatform: SocialMedia;
   postLink: string;
}

export async function approvePost ({taskId, price, clientUserId, editorUserId, postPlatform, postLink}: ApprovePostParams) {
   try {
      await connectToDatabase();

      // add user post
      const client = await ClientsDb.findOne({ userid: clientUserId });
      if (!client) return { result: "Client does not exist", error: true };
      client.posts = [ {
         link: postLink,
         platform: postPlatform,
         date: Date.now()
      }, ...client.posts ];
      await client.save();

      // add task approval into editor
      const editor = await EditorsDb.findOne({ userid: editorUserId });
      if (!editor) return { result: "Editor does not exist", error: true };
      editor.tasksApproved = [ {
         taskId, date: Date.now()
      }, ...editor.tasksApproved ];
      
      // add payment for editor
      editor.payments = [ {
         taskId, price, date: Date.now()
      }, ...editor.payments ];
      await editor.save();

      return {
         result: "Post Approved",
         error: false
      }
   } catch (err) {
      return {
         result: "Failed to approve post",
         error: true
      }
   }
}


export async function deleteEditorTask (taskId: string) {
   try {
      await connectToDatabase();
      await EditorTasksDb.deleteOne({ taskId });
      return true;
   } catch (e) {
      return false;
   }
}

export async function deleteEditorTaskApproval (taskId: string, editorUserId: string) {
   try {
      await connectToDatabase();
      const editor = await EditorsDb.findOne({ userid: editorUserId });
      if (!editor) return false;
      
      editor.payments = [...editor.payments.filter((payment: EditorPayments) => payment.taskId !== taskId)];
      editor.tasksApproved = [...editor.tasksApproved.filter((taskApp: Omit<EditorTaskStatus, 'googleDriveLink'>) => taskApp.taskId !== taskId)];
      await editor.save();
      return true;
   } catch (e) {
      return false;
   }
}