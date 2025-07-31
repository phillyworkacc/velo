import OnboardingForm from "./OnboardingForm";
import { VeloClientProvider } from "@/hooks/useVeloClient";

type ClientAdminPageProps = {
   params: Promise<{
      clientUserId: string;
   }>
}

export default async function OnboardingPage ({ params }: ClientAdminPageProps) {
   const { clientUserId } = await params;
   return <VeloClientProvider userid={clientUserId}>
      <OnboardingForm />
   </VeloClientProvider>
}

