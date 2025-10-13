import { userHasProjects } from "@/app/actions/project";
import { redirect } from "next/navigation";
import OnboardingPage from "@/components/onboarding-client-component";

export default async function Onboarding(){
  
  try{
    // Check if user has projects (returning user)
    const hasProjects = await userHasProjects();
    
    if(hasProjects){
      // Returning user - redirect to home page
      redirect('/dashboard/home');
    }
    
    // New user - show onboarding page
    return <OnboardingPage></OnboardingPage>
  }
  catch{
    redirect('/signin')
  }
}