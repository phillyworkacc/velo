'use client'
import "@/styles/app.css"
import { useUser } from "@/hooks/useUser";
import { CSSProperties } from "react";
import { moneyFormatting, numberFormatting } from "@/utils/utils";
import { getLast7DaysEditorEarnings } from "@/utils/chartFuncs";
import { useRouter } from "next/navigation";
import Card from "@/components/Card/Card";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Chart from "@/components/Chart/Chart";

type EditorAppContentProps = {
   analytics: {
      totalAmountMade: number;
      noOfTasksApproved: number;
      noOfTaskCompleted: number;
      payments: EditorPayments[];
   }
}

export default function EditorAppContent ({ analytics }: EditorAppContentProps) {
   const { user, isLoadingUser } = useUser();
   const router = useRouter();
   const cardStyle: CSSProperties = {
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '20px'
   }
   
   if (isLoadingUser) return <LoadingPage />;
   if (user == null) return <LoadingPage />;
   if (user.role == "admin") router.push("/admin");
   if (user.role == "editor") router.push("/editor");

   return (
      <AppWrapper>
         <div className="text-xxl bold-700 mb-2">Welcome {user.name}</div>

         <div className="text-l bold-700 mb-1">Analytics</div>
         <div className='text-s dfb wrap gap-15 w-full'>
            {/* Row 1 */}
            <Card maxWidth='500px' maxHeight='500px' style={cardStyle} analyticsCard>
               <div className="text-xxxs grey-5">Money Made (Total)</div>
               <div className="text-mb bold-800 mb-15">£{moneyFormatting(analytics.totalAmountMade)}</div>
            </Card>
            <Card maxWidth='500px' maxHeight='500px' style={cardStyle} analyticsCard>
               <div className="text-xxxs grey-5">Tasks Approved</div>
               <div className="text-mb bold-800 mb-15">{numberFormatting(analytics.noOfTasksApproved)}</div>
            </Card>
            <Card maxWidth='500px' maxHeight='500px' style={cardStyle} analyticsCard>
               <div className="text-xxxs grey-5">Tasks Completed</div>
               <div className="text-mb bold-800 mb-15">{numberFormatting(analytics.noOfTaskCompleted)}</div>
            </Card>
         </div>

         <div className='text-s dfb wrap gap-15 w-full mt-15'>
            {/* Row 2 */}
            <Card maxWidth='500px' maxHeight='500px' style={cardStyle} analyticsCard>
               <div className="text-xxxs grey-5 mb-1">Money Insights (Last 7 Days)</div>
               <Chart
                  data={getLast7DaysEditorEarnings(analytics.payments)}
                  xDataKey='date'
                  yDataKey='amount'
                  width={450}
                  height={250}
               />
            </Card>
         </div>
      </AppWrapper>
   );
}
