'use client'
import "@/styles/app.css"
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Card from "@/components/Card/Card";
import Select from "@/components/Select/Select";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { CSSProperties, useState } from "react";
import { useVeloClient } from "@/hooks/useVeloClient";
import { numberFormatting } from "@/utils/utils";
import { suffixS, titleCase } from "@/lib/str";
import { CustomIcon } from "@/components/Icons/Icon";

type PlatformDateRangeSelector = {
   platform: SocialMedia;
   range: number;
}
type TimeRange = {
   [type: string]: number
}

export default function AppContent () {
   const { user, isLoadingUser } = useUser();
   const { client, isLoadingClient } = useVeloClient();
   const router = useRouter();
   const cardStyle: CSSProperties = {
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '20px'
   }
   const [platformDateRangeSelector, setPlatformDateRangeSelector] = useState<PlatformDateRangeSelector[]>([])

   if (isLoadingUser) return <LoadingPage />;
   if (user == null) return <LoadingPage />;
   if (user.role == "admin") router.push("/admin");
   if (user.role == "editor") router.push("/editor");
   if (isLoadingClient) return <LoadingPage />;
   if (client == null) return <LoadingPage />;

   const timeRangesInMs: TimeRange = {
      "Last Hour": 60 * 60 * 1000,
      "Last 24 hours": 24 * 60 * 60 * 1000,
      "Last Week": 7 * 24 * 60 * 60 * 1000,
      "Last Month": 30 * 24 * 60 * 60 * 1000,
      "Last Year": 365 * 24 * 60 * 60 * 1000
   };

   return (
      <AppWrapper>
         <div className="text-xxl bold-700 mb-2">Welcome {user.name}</div>
         <div className="text-xxs grey-4 pd-1">You have {client.platforms.length} connected {suffixS('platform', client.platforms.length)}</div>
         <div className="horizontal-convertible gap-7">
            {client.platforms.map((platform, index) => (
               <div key={index} className="text-xxs grey-4 fit dfb align-center gap-5">
                  <CustomIcon url={`/platforms/${platform.platform}.png`} size={20} />
                  {titleCase(platform.username)}
               </div>
            ))}
         </div>

         {(client.platforms.length > 0) && (
            <>
               <div className="text-ml bold-700 mb-1 mt-3">Insights</div>
               <div className='text-s dfb wrap gap-15 w-full'>
                  {/* Row 1 */}
                  {client.platforms.map((platform, index) => (
                     <Card key={index} maxWidth='500px' maxHeight='500px' style={cardStyle} analyticsCard>
                        <div className="horizontal-convertible vertical-center gap-10" style={{marginBottom:"5px"}}>
                           <div className="text-xxxs grey-5 full dfb align-center gap-5">
                              Posts on {titleCase(platform.platform)}
                              <CustomIcon url={`/platforms/${platform.platform}.png`} size={20} />
                           </div>
                           <Select 
                              options={["Last Hour", "Last 24 hours", "Last Week", "Last Month", "Last Year"]}
                              onSelect={(option) => {
                                 setPlatformDateRangeSelector((prev) => ([
                                    ...prev.filter((pdrS => pdrS.platform !== platform.platform)),
                                    { platform: platform.platform, range: timeRangesInMs[option] }
                                 ]))
                              }}
                              style={{whiteSpace: "nowrap", width: "100%"}}
                              optionStyle={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}
                              selectedOptionStyle={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}
                           />
                        </div>
                        <div className="text-mb bold-800 mb-15">{
                           numberFormatting(
                              client.posts
                              .filter(post => post.platform == platform.platform)
                              .filter(post => (
                                 post.date >= (Date.now() - (platformDateRangeSelector.find(pdrS => pdrS.platform == post.platform)?.range!))
                              ))
                              .length
                           )
                        }</div>
                     </Card>
                  ))}
               </div>
               <div className='text-s dfb wrap gap-15 w-full mt-15'>
                  {/* Row 2 */}
                  {client.platforms.map((platform, index) => (
                     <Card key={index} maxWidth='500px' maxHeight='500px' style={cardStyle} analyticsCard>
                        <div className="text-xxxs grey-5 full dfb align-center gap-5">
                           Posts on {titleCase(platform.platform)}
                           <CustomIcon url={`/platforms/${platform.platform}.png`} size={20} />
                        </div>
                        <div className="text-xxxs grey-5 full dfb align-center gap-5">(All Time Posts)</div>
                        <div className="text-mb bold-800 mb-15">{numberFormatting(client.posts.filter(post => post.platform == platform.platform).length)}</div>
                     </Card>
                  ))}
               </div>
            </>
         )}
      </AppWrapper>
   );
}
