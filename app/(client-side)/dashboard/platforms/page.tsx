import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/db/db";
import { VeloClientProvider } from "@/hooks/useVeloClient";
import PlatformsPage from "./PlatformsPage";
import UsersDb from "@/db/user";
import ClientsDb from "@/db/client";

export async function generateMetadata () {
   const session = await getServerSession(authOptions);
   return {
      title: `Platforms - ${session?.user?.name!}`,
   };
}

export default async function ClientPlatformsPage () {
   await connectToDatabase();
   const session = await getServerSession(authOptions);
   const clientUser = await UsersDb.findOne({ email: session?.user?.email!, role: 'client' });
   if (!clientUser) redirect("/login");
   
   const client = await ClientsDb.findOne({ userid: clientUser.userid });
   if (!clientUser) redirect("/login");

   const clientUserDetails: ClientDetails = {
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

   if (session?.user) {
      return <VeloClientProvider userid={client.userid}>
         <PlatformsPage clientUserDetails={JSON.parse(JSON.stringify(clientUserDetails))} />;
      </VeloClientProvider>
   } else {
      redirect('/login');
   }

}
