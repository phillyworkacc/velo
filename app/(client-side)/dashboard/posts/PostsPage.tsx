'use client'
import "@/styles/app.css"
import Card from "@/components/Card/Card";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { redirect } from "next/navigation";
import { useVeloClient } from "@/hooks/useVeloClient";
import { suffixS, titleCase } from "@/lib/str";
import { formatMilliseconds } from "@/utils/date";
import { CustomIcon } from "@/components/Icons/Icon";

export default function PostsPage () {
   const { user, isLoadingUser } = useUser();
   const { client, isLoadingClient } = useVeloClient();

   function getClientPostsObjectSortedByWeek () {
      if (!client) return;
      return client.posts.reduce((acc: any, clientPost) => {
         const dateObj = new Date(clientPost.date);

         const year = dateObj.getFullYear();
         const monthIndex = dateObj.getMonth(); // 0-based
         const day = dateObj.getDate();

         const monthName = dateObj.toLocaleString('default', { month: 'long' });

         // Get first day of the month
         const firstDayOfMonth = new Date(year, monthIndex, 1);
         const firstDayWeekday = firstDayOfMonth.getDay() || 7; // Treat Sunday as 7

         // Calculate week number (1-based)
         const week = Math.ceil((day + firstDayWeekday - 1) / 7);

         // Calculate start and end date of that week
         const weekStart = new Date(firstDayOfMonth);
         weekStart.setDate(1 + (week - 1) * 7 - (firstDayWeekday - 1));

         const weekEnd = new Date(weekStart);
         weekEnd.setDate(weekStart.getDate() + 6);

         const formatDate = (d: Date) =>
            `${d.getDate()} ${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()}`;

         const dateRange = `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
         const weekKey = `${monthName} - Week ${week}`;

         if (!acc[weekKey]) {
            acc[weekKey] = { dateRange, clientPosts: [] }
         }

         // Avoid duplicates based on exact timestamp
         if (!acc[weekKey].clientPosts.some((task: any) => task.date === clientPost.date)) {
            acc[weekKey].clientPosts.push(clientPost);
         }

         return acc;
      }, {});
   }

   if (isLoadingUser) return <LoadingPage />;
   if (user == null) return <LoadingPage />;
   if (isLoadingClient) return <LoadingPage />;
   if (client == null) return <LoadingPage />;
   if (user.role == "admin") redirect('/admin');
   if (user.role == "editor") redirect('/editor');
   
   return (
      <AppWrapper>
         <div className="text-xxl bold-700 mb-1">Posts</div>
         <div className="text-xxs grey-4 mb-2">
            These are all the posts that have been posted on your social media accounts since you joined Velo, {client.posts.length} {suffixS('post', client.posts.length)}
         </div>
         <div className="text-s dfb wrap gap-15 w-full">
            {(client.posts.length > 0) ? (<>
               <ClientPostLister clientPosts={getClientPostsObjectSortedByWeek()} />
            </>) : (<>
               <div className="text-xxs grey-4">No posts yet</div>
            </>)}
         </div>
      </AppWrapper>
   );
}

type ClientPostsDateObject = {
   [date: string]: {
      dateRange: string;
      clientPosts: ClientPost[];
   }
}

function ClientPostLister ({ clientPosts }: { clientPosts: ClientPostsDateObject }) {
   const dateKeys = Object.keys(clientPosts);
   const { client } = useVeloClient();

   if (client == null) return null;

   return (<div className="text-s dfb column gap-10 w-full">
      {dateKeys.map((dateKey, index) => (<div key={index}>
         <div className="text-m bold-700 mb-05">Posts on {dateKey}</div>
         <div className="text-xxs grey-4 mb-1">{clientPosts[dateKey].dateRange}</div>

         <div className="text-s w-full wrap dfb gap-10">
            {clientPosts[dateKey].clientPosts.map((clientPost, index) => (
               <Link key={index} href={clientPost.link} target="_blank" className="text-s full" style={{maxWidth:"500px"}}>
                  <Card className="pd-2 pdx-2" maxWidth="500px" cursor hoverAnimate analyticsCard>
                     <CustomIcon url={`/platforms/${clientPost.platform.toLowerCase()}.png`} size={40} />
                     <div className="text-s bold-600 pd-1">
                        @{client.platforms.find(pltFm => pltFm.platform == clientPost.platform)?.username!}
                     </div>
                     <div className="text-xxs grey-5">Click to view {clientPost.platform} post</div>
                     <div className="text-xxxs grey-4 full mt-1">Posted on {formatMilliseconds(Date.now()).split(',')[0]}</div>
                  </Card>
               </Link>
            ))}
         </div>

      </div>))}
   </div>);
}