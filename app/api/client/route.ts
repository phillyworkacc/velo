import ClientsDb from "@/db/client";
import UsersDb from "@/db/user";
import { connectToDatabase } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST (req: NextRequest) {
   try {
      const body = await req.json()
      const { userid } = body;
      await connectToDatabase();
      const client = await ClientsDb.findOne({ userid });
      const clientUser = await UsersDb.findOne({ userid });
      const clientDetails: ClientDetails = {
         userid: client.userid,
         googleDriveFolderLink: client.googleDriveFolderLink,
         platforms: client.platforms,
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
      }
      return NextResponse.json({ clientDetails })
   } catch (e) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 500 });
   } 

}