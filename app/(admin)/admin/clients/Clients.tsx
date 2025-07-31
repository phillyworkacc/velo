'use client'
import "@/styles/app.css"
import Card from "@/components/Card/Card";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import { useUser } from "@/hooks/useUser";
import { formatMilliseconds } from "@/utils/date";
import { redirect, useRouter } from "next/navigation";
import { CustomIcon } from "@/components/Icons/Icon";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import { BadgeCheck } from "lucide-react";

export default function Clients ({ clients }: { clients: ClientDetails[] }) {
   const { user, isLoadingUser } = useUser();

   if (isLoadingUser) return <LoadingPage />;
   if (user == null) return <LoadingPage />;
   if (user.role == "client") redirect('/dashboard');
   if (user.role == "editor") redirect('/editor');
   
   return (
      <AppWrapper>
         <div className="text-xxl bold-700 mb-1">All Clients</div>
         <div className="text-xxs grey-4 mb-2">These are all the clients that are on Velo, {clients.length} client{clients.length !== 1 && 's'}</div>
         <div className="text-s dfb wrap gap-15 w-full">
            {(clients.length > 0) ? (<>
               {clients.map((client, index) => (<Client key={index} clientDetail={client} />))}
            </>) : (<>
               <div className="text-xxs grey-4">No clients yet</div>
            </>)}
         </div>
      </AppWrapper>
   );
}

function Client ({ clientDetail }: { clientDetail: ClientDetails }) {
   const router = useRouter();

   return <Card className="pd-2 pdx-2" maxWidth="500px" cursor onClick={() => router.push(`/admin/client/${clientDetail.userid}`)} hoverAnimate analyticsCard>
      <div className="text-s bold-700 dfb align-center gap-7">
         <CustomIcon url={clientDetail.user.image} size={26} round />
         {clientDetail.user.name}
         {(clientDetail.user.onboarded) && (<BadgeCheck fill="#2054FF" color="#ffffff" size={20} />)}
      </div>
      <div className="text-xxs grey-4 pd-1">{clientDetail.user.email}</div>
      <div className="text-xxs grey-4 dfb align-center gap-7">
         <span>{clientDetail.platforms.length} {clientDetail.platforms.length == 1 ? 'platform' : 'platforms'} added</span>
         <span className="text-s dfb align-center gap-1 fit">
            {clientDetail.platforms.map((platform, index) => (
               <CustomIcon key={index} url={`/platforms/${platform.platform}.png`} size={20} />
            ))}
         </span>
      </div>
      <div className="text-xxxs grey-4 full mt-1">Joined Velo on {formatMilliseconds(clientDetail.user.date).split(',')[0]}</div>
   </Card>
}