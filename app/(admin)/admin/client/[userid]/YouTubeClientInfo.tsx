'use client'
import Card from "@/components/Card/Card";
import Link from "next/link";
import { CustomIcon, YouTubeIcon } from "@/components/Icons/Icon";
import { useEffect, useState } from "react";
import { getYouTubeChannelInfo } from "@/app/actions/youtube";
import { formatSubscriberCount } from "@/utils/utils";
import { SquareArrowOutUpRight } from "lucide-react";
import { useVeloClient } from "@/hooks/useVeloClient";

export default function YouTubeClientInfo() {
   const { client, isLoadingClient } = useVeloClient();
   const [ytChannelInfo, setYTChannelInfo] = useState<YouTubeChannelInfo | null>(null)
   const [platformUsername, setPlatformUsername] = useState<string | null>(null);

   useEffect(() => {
      const load = async () => {
         if (client?.platforms.length! < 1) return;
         if (client?.platforms.filter(platform => platform.platform == "youtube").length! < 1) return;
         setPlatformUsername(client?.platforms.filter(platform => platform.platform == "youtube")[0].username!)
         const channelInfo = await getYouTubeChannelInfo(client?.platforms.filter(platform => platform.platform == "youtube")[0].username!);
         setYTChannelInfo(channelInfo || null);
      }
      load();
   }, [])
   
   if (isLoadingClient) return null;
   if (client == null) return null;
   if (platformUsername == null) return null;
   if (client.platforms.filter(platform => platform.platform == "youtube").length < 1) return null;
   if (ytChannelInfo == null) return null;

   return (
      <div className="text-s full dfb gap-10">
         <Card full className="pd-15 pdx-15">
            <div className="text-s bold-600 text-left dfb align-center gap-10">
               <div className="text-s fit">
                  <YouTubeIcon url={ytChannelInfo.profileImage!} size={45} round />
               </div>
               <div className="text-xs full">
                  <div className="text-xs fit accent-color dfb align-center gap-5">
                     <Link className="text-xs bold-600 fit accent-color dfb align-center gap-5" target="_blank" href={`https://youtube.com/${ytChannelInfo.customUrl!}`}>
                        {platformUsername}
                        <SquareArrowOutUpRight size={15} strokeWidth={2} />
                     </Link>
                  </div>
               </div>
               <div className="text-s fit">
                  <CustomIcon url={`/platforms/youtube.png`} size={25} />
               </div>
            </div>

            <div className="text-s horizontal-convertible gap-10 pd-15 mt-1">
               <div className="text-s dfb column gap-5">
                  <div className="text-xxs grey-4">Total Subscribers</div>
                  <div className="text-xl bold-700 fit">{formatSubscriberCount(ytChannelInfo.subscriberCount)}</div>
               </div>

               <div className="text-s dfb column gap-5">
                  <div className="text-xxs grey-4">Total View Count</div>
                  <div className="text-xl bold-700 fit">{formatSubscriberCount(ytChannelInfo.totalViewCount)}</div>
               </div>

               <div className="text-s dfb column gap-5">
                  <div className="text-xxs grey-4">Total Videos Posted</div>
                  <div className="text-xl bold-700 fit">{formatSubscriberCount(ytChannelInfo.totalVideos)}</div>
               </div>
            </div>

         </Card>
      </div>
   )
}
