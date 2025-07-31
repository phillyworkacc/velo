'use client'
import { VeloLogo } from "@/components/Icons/Icon";
import OnboardingCard from "@/components/OnboardingCard/Card";
import Spinner from "@/components/Spinner/Spinner";

export default function LoadingOnboardingPage ({ textDisplay }: { textDisplay?: string }) {
   return (<OnboardingCard>
      <div className="text-xs full h-full dfb column align-center justify-center gap-5">
         <div className="text-xl bold-600 dfb gap-5 align-center justify-center pd-2" style={{ height: '3vh' }}>
            <VeloLogo size={50} /> Onboarding
         </div>
         <div className="text-s text-center pd-1 full dfb gap-5 align-center justify-center">
            {(textDisplay == undefined) ? <><Spinner black /> Loading</> : textDisplay}
         </div>
      </div>
   </OnboardingCard>)
}