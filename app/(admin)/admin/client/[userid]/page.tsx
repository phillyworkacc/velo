import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/db/db";
import { VeloClientProvider } from "@/hooks/useVeloClient";
import ClientPage from "./ClientPage";
import UsersDb from "@/db/user";
import ClientsDb from "@/db/client";

type ClientAdminPageProps = {
   params: Promise<{
      userid: string;
   }>
}

export async function generateMetadata ({ params }: ClientAdminPageProps) {
   const { userid } = await params;
   await connectToDatabase();
   const client = await UsersDb.findOne({ userid });
   return {
      title: `${client.name} - Client`,
   };
}

export default async function ClientAdminPage ({ params }: ClientAdminPageProps) {
   await connectToDatabase();
   const { userid } = await params;
   const session = await getServerSession(authOptions);
   const client = await ClientsDb.findOne({ userid });
   const clientUser = await UsersDb.findOne({ userid });
   const clientUserDetails: ClientDetails = {
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
   }

   if (session?.user) {
      return <VeloClientProvider userid={userid}>
         <ClientPage clientUserDetails={JSON.parse(JSON.stringify(clientUserDetails))} />;
      </VeloClientProvider>
   } else {
      redirect('/login');
   }

}
