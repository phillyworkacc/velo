'use client'
import "@/styles/app.css"
import PlatformCards from "./PlatformCards"
import ClientInfo from "./ClientInfo"
import LoadingPage from "@/components/LoadingPage/LoadingPage"
import ClientPosts from "./ClientPosts"
import YouTubeClientInfo from "./YouTubeClientInfo"
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import ClientNotes from "./ClientNotes"
import Selector from "@/components/Selector/Selector"
import { useVeloClient } from "@/hooks/useVeloClient"
import { useState } from "react"

export default function ClientPage ({ clientUserDetails }: { clientUserDetails: UserDetails }) {
   const { client } = useVeloClient();
   const [selectorPage, setSelectorPage] = useState(0)

   if (client == null) return <LoadingPage />;

   return (
      <AppWrapper>
         <ClientInfo />
         <div className="text-s mb-2" />

         <Selector 
            options={["Platforms", "Notes", "Posts"]}
            selectedIndex={selectorPage}
            onClickAction={(index) => setSelectorPage(index)}
         />

         {(selectorPage == 0) && (<>
            <PlatformCards />
            <div className="text-s mb-4" />
            
            <YouTubeClientInfo />
            <div className="text-s mb-1" />
         </>)}

         {(selectorPage == 1) && (<>
            <ClientNotes />
            <div className="text-s mb-1" />
         </>)}

         {(selectorPage == 2) && (<>
            <ClientPosts />
            <div className="text-s mb-1" />
         </>)}
      </AppWrapper>
   )
}