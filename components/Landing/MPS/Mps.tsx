'use client'
import "./Mps.css"
import { ArrowUp, Calendar } from "lucide-react";
import Link from "next/link";

export default function Mps () {
   return (
      <div className="mps">
         <div className="text-s pd-15 text-center">
            <img src={"https://www.mypocketskill.com/static/images/MyPocketSkill.svg"} width={200} />
         </div>
         <div className="headline text-xxl bold-600 mb-1 text-center pdx-3">
            Book Philip Opadijo on MyPocketSkill
         </div>
         <div className="sub-headline text-xs mb-2 text-center pdx-1 full" style={{maxWidth: "800px"}}>
            I am a software, game and web developer. I offer skills such as making websites, applications, making presentations, and more! I also offer video editing, logo design, poster design, game development, social media management and others.
         </div>
         <div className="text-s bold-800 mb-1 text-center pdx-3 dfb align-center gap-5 full justify-center">
            <ArrowUp size={20} strokeWidth={3} /> 40+ Completed Bookings
         </div>
         <div className="call-to-action text-xxs dfb align-center justify-center gap-10 mt-05">
            <Link href={"https://mypocketskill.com/listings/66222/"} target="_blank">
               <button className="outline-black xxs pd-1 pdx-2">View Profile <Calendar size={17} /></button>
            </Link>
         </div>
      </div>
   )
}
