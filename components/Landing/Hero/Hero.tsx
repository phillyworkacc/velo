'use client'
import "./Hero.css"
import { ArrowRight, Calendar } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import HeroTag from "./HeroTag"
import Link from "next/link";

export default function Hero () {
   const { data: session } = useSession();
   const router = useRouter();

   return (
      <div className="hero">
         <HeroTag />
         <div className="headline text-xxl bold-600 mb-1 text-center pdx-3">Effortless Social Media Management for You</div>
         <div className="sub-headline text-xs mb-2 text-center pdx-1">
            Track client posts, assign editor tasks, and manage your entire SMMA workflow — all in one powerful dashboard.
         </div>
         <div className="call-to-action text-xxs dfb align-center justify-center gap-10">
            {session?.user ? <>
               <button className="xxs pd-1 pdx-2" onClick={() => router.push('/app')}>Go to dashboard <ArrowRight size={17} /></button>
            </> : <>
               <button className="xxs pd-1 pdx-2" onClick={() => router.push('/login')}>Get Started</button>
            </>}
            <Link href={"https://mypocketskill.com/listings/66222/"} target="_blank">
               <button className="outline-black xxs pd-1 pdx-2">Book a Call <Calendar size={17} /></button>
            </Link>
         </div>
      </div>
   )
}
