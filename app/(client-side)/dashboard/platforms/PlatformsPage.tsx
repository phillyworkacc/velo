'use client'
import "@/styles/app.css"
import LoadingPage from "@/components/LoadingPage/LoadingPage"
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import PlatformCards from "./PlatformCards"
import { useVeloClient } from "@/hooks/useVeloClient"

export default function PlatformsPage ({ clientUserDetails }: { clientUserDetails: UserDetails }) {
   const { client } = useVeloClient();

   if (client == null) return <LoadingPage />;

   return (
      <AppWrapper>
         <div className="text-xxl bold-700 mb-05">Platforms</div>
         <div className="text-xs grey-4 pd-05 mb-05">
            {client.platforms.length} {(client.platforms.length == 1) ? 'platform' : 'platforms'}
         </div>
         <PlatformCards />
         <div className="text-s mb-1" />
      </AppWrapper>
   )
}