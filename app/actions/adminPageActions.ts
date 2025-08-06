"use server"
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/db/db";
import ClientsDb from "@/db/client";
import EditorsDb from "@/db/editor";
import UsersDb from "@/db/user";
import EditorTasksDb from "@/db/editorTask";

export async function adminAppContentAnalysis (): Promise<AdminAppContentAnalytics> {
   try {
      await connectToDatabase();
      const session = await getServerSession(authOptions);
      
      if (session?.user) {
         const clients = await ClientsDb.find({});
         const editors = await EditorsDb.find({});
         const admins = await UsersDb.find({ role: 'admin' });
   
         return {
            noOfAdmins: admins.length,
            noOfClients: clients.length,
            noOfEditors: editors.length
         }
      } else {
         return {
            noOfAdmins: 0,
            noOfClients: 0,
            noOfEditors: 0
         }
      } 
   } catch (err) {
      return {
         noOfAdmins: 0,
         noOfClients: 0,
         noOfEditors: 0
      }
   }
}

export async function getAllEditorsDetails () {
   try {
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
         return JSON.parse(JSON.stringify(editorsUserDetailsFilter));
      } else { return null; }
   } catch (err) {
      return null;
   }
}

export async function getAllClientsDetails () {
   try {
      const session = await getServerSession(authOptions);
      if (session?.user) {
         await connectToDatabase();
         const clients = await ClientsDb.find({});
         const clientsUserDetailsFilter = await Promise.all(
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
         return JSON.parse(JSON.stringify(clientsUserDetailsFilter));
      } else {
         return null;
      }
   } catch (err) {
      return null;
   }
}

export async function getAllEditorTasks () {
   try {
      const session = await getServerSession(authOptions);
      if (session?.user) {
         await connectToDatabase();
         const editorsTasks = await EditorTasksDb.find({});
         return JSON.parse(JSON.stringify(editorsTasks));
      } else {
         return null;
      }
   } catch (err) {
      return null;
   }
}

export async function getEditorAnalytics (editorUserId: string) {
   try {
      await connectToDatabase();
      const session = await getServerSession(authOptions);
      if (session?.user) {
         const editor = await EditorsDb.findOne({ userid: editorUserId });
         const editorTotalMoneyMade = editor.payments.reduce((acc: number, payment: EditorPayments) => {
            acc += payment.price;
            return acc;
         }, 0)
         return JSON.parse(JSON.stringify({
            totalAmountMade: editorTotalMoneyMade,
            noOfTasksApproved: editor.tasksApproved.length,
            noOfTaskCompleted: editor.tasksCompleted.length,
            payments: editor.payments
         }))
      } else {
         return null;
      }
   } catch (err) {
      return null;
   }
}

export async function getEditorTasksCompletedDetail (editorUserId: string) {
   try {
      const session = await getServerSession(authOptions);
      if (session?.user) {
         await connectToDatabase();
         const editor = await EditorsDb.findOne({ userid: editorUserId });
         const tasksCompletedByEditor = await Promise.all(
            editor.tasksCompleted.map(async(task: EditorTaskStatus) => {
               const editorTask = await EditorTasksDb.findOne({ taskId: task.taskId });
               return {
                  taskId: task.taskId,
                  taskName: editorTask.title,
                  googleDriveLink: task.googleDriveLink,
                  date: task.date
               } as TaskCompletedDetail
            })
         )
         return JSON.parse(JSON.stringify(tasksCompletedByEditor))
      } else {
         return null;
      }
   } catch (err) {
      return null;
   }
}