import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export default async function Login() {
   const session  = await getServerSession(authOptions);
   
   if (session?.user) {
      redirect('/dashboard');
   } else {
      return <LoginForm />;
   }

}
