'use server'
import { connectToDatabase } from "@/db/db";
import { generateRandomCode, hashPassword } from "@/utils/hash";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import UsersDb from "@/db/user"
import ClientsDb from "@/db/client";
import EditorsDb from "@/db/editor";
import EditorTasksDb from "@/db/editorTask";
import { deleteClientAccount } from "./client";
import { deleteEditorAccount } from "./editor";

export async function getUserDetails(userid: string) {
   try {
      await connectToDatabase();
      const user = await UsersDb.findOne({ userid });
      return {
         userid: user.userid,
         name: user.name,
         description: user.description,
         email: user.email,
         image: user.image,
         role: user.role,
         credentialMethod: user.credentialMethod,
         onboarded: user.onboarded,
         date: user.date
      } as UserDetails
   } catch (e) {
      return null
   }
}

export async function getUserDetailsViaLogin (email: string, password: string) {
   try {
      await connectToDatabase();
      const user = await UsersDb.findOne({ email, password: hashPassword(password) });
      return {
         userid: user.userid,
         name: user.name,
         description: user.description,
         email: user.email,
         image: user.image,
         role: user.role,
         credentialMethod: user.credentialMethod,
         onboarded: user.onboarded,
         date: user.date
      } as UserDetails
   } catch (e) {
      return null
   }
}

export async function getUserDetailsByEmailServer (): Promise<UserDetails | null> {
   try {
      const session = await getServerSession(authOptions);
      if (!session) return null;
      if (!session.user) return null;

      await connectToDatabase();
      const user = await UsersDb.findOne({ email: session.user?.email! });

      return {
         userid: user.userid,
         name: user.name,
         description: user.description,
         email: user.email,
         image: user.image,
         role: user.role,
         credentialMethod: user.credentialMethod,
         onboarded: user.onboarded,
         date: user.date
      } as UserDetails
   } catch (e) {
      return null
   }
}

export async function updatePlatforms (email: string, newPlatforms: SocialMediaPlatform[]): Promise<boolean> {
   try {
      await connectToDatabase();
      
      const user = await UsersDb.findOne({ email });
      user.platforms = [...newPlatforms]
      await user.save();

      return true
   } catch (e) {
      return false
   }
}

export async function doesEmailExist (email: string): Promise<boolean> {
   try {
      await connectToDatabase();
      const user = await UsersDb.findOne({ email });
      return user ? true : false
   } catch (e) {
      return false
   }
} 

export async function createClientAccount (user: Omit<User, 'userid' | 'role'>, googleDriveFolderLink: string): Promise<boolean> {
   try {
      const userid = `user-${generateRandomCode(32)}`
      await UsersDb.create({
         ...user, userid,
         password: hashPassword(user.password),
         role: 'client'
      });
      await ClientsDb.create({ userid, platforms: [], posts: [], notes: '', googleDriveFolderLink })
      return true;
   } catch (e) {
      return false
   }
}

export async function createEditorAccount (user: Omit<User, 'userid' | 'role'>, googleDriveFolderLink: string): Promise<boolean> {
   try {
      const userid = `editor-${generateRandomCode(32)}`
      await UsersDb.create({
         ...user, userid,
         password: hashPassword(user.password),
         role: 'editor'
      });
      await EditorsDb.create({
         userid, googleDriveFolderLink,
         tasksCompleted: [],
         tasksApproved: [],
         payments: []
      })
      return true;
   } catch (e) {
      return false
   }
}

export async function createEditorTask (task: Omit<EditorTasks, 'taskId'>): Promise<boolean> {
   try {
      const taskId = `editor-task-${generateRandomCode(30)}`
      await EditorTasksDb.create({
         taskId,
         title: task.title,
         task: task.task,
         date: task.date
      })
      return true;
   } catch (e) {
      return false
   }
}

export async function deleteUserAccount (userid: string): Promise<boolean> {
   try {
      const user = await UsersDb.findOne({ userid });
      if (!user) return false;
      if (user.role == "client") {
         return await deleteClientAccount(userid);
      }
      if (user.role == "editor") {
         return await deleteEditorAccount(userid);
      }
      await UsersDb.deleteOne({ userid });
      return true;
   } catch (e) {
      return false;
   }
}

export async function changeUserPassword (email: string, password: string): Promise<boolean> {
   try {
      await connectToDatabase();

      const user = await UsersDb.findOne({ email });
      user.password = hashPassword(password);
      await user.save();

      return true;
   } catch (e) {
      return false
   }
}