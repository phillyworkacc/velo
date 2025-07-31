'use client'
import "./Card.css"

type OnboardingCardProps = {
   children: React.ReactNode;
}

export default function OnboardingCard ({ children }: OnboardingCardProps) {
   return (
      <div className='onboarding-card'>{children}</div>
   )
}
