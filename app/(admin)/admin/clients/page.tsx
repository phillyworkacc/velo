import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/db/db";
import UsersDb from "@/db/user";
import Clients from "./Clients";
import ClientsDb from "@/db/client";

export async function generateMetadata() {
   const session = await getServerSession(authOptions);
   return {
      title: `Clients - Admin - ${session?.user?.name!}`,
   };
}

export default async function ClientsPage () {
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
      return <Clients clients={JSON.parse(JSON.stringify(clientsUserDetailsFilter))} />;
   } else {
      redirect('/login');
   }

}
