'use server'
import { connectToDatabase } from "@/db/db";
import { hashPassword } from "@/utils/hash";
import OnboardingsDb from "@/db/onboarding";
import UsersDb from "@/db/user"
import ClientsDb from "@/db/client";

export async function updateClientPlatforms (userid: string, newPlatforms: SocialMediaPlatform[]): Promise<boolean> {
   try {
      await connectToDatabase();
      
      const client = await ClientsDb.findOne({ userid });
      client.platforms = [...newPlatforms]
      await client.save();

      return true
   } catch (e) {
      return false
   }
}

export async function updateClientNotes (userid: string, newNote: string): Promise<boolean> {
   try {
      await connectToDatabase();
      
      const client = await ClientsDb.findOne({ userid });
      client.notes = newNote;
      await client.save();

      return true
   } catch (e) {
      return false
   }
}

export async function updateClientPosts (userid: string, newPosts: ClientPost[]): Promise<boolean> {
   try {
      await connectToDatabase();
      
      const client = await ClientsDb.findOne({ userid });
      client.posts = [...newPosts];
      await client.save();

      return true
   } catch (e) {
      return false
   }
}

export async function checkClientSecurityCode (email: string, code: string): Promise<boolean> {
   try {
      await connectToDatabase();
      const user = await UsersDb.findOne({ email });
      if (user.onboarded == false && hashPassword(code) == user.password) {
         return true;
      } else {
         return false;
      }
   } catch (e) {
      return false
   }
}

export async function setClientPassword (email: string, password: string): Promise<boolean> {
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

export async function finishClientOnboarding (onboarding: Onboarding): Promise<boolean> {
   try {
      await connectToDatabase();
      await OnboardingsDb.create(onboarding);
      return true;
   } catch (e) {
      return false
   }
}

export async function completeClientOnboarding (email: string): Promise<boolean> {
   try {
      await connectToDatabase();

      const user = await UsersDb.findOne({ email });
      user.onboarded = true;
      await user.save();

      return true;
   } catch (e) {
      return false
   }
}

export async function deleteClientAccount (userid: string): Promise<boolean> {
   try {
      await UsersDb.deleteOne({ userid });
      await ClientsDb.deleteOne({ userid });
      return true;
   } catch (e) {
      return false;
   }
}