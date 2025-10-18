  
import "@/app/globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/sidebar";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SessionProvider } from "@/components/providers/session-provider";
import type { User } from "better-auth";
import { redirect } from "next/navigation";
import { Suspense, unstable_ViewTransition as ViewTransition } from "react";
import Loader from "@/components/ui/loader";
export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session  = await auth.api.getSession({
    headers: await headers()
  })
const user = session?.user

if(!session){
  redirect('/signin')
}



  return (
    <Suspense fallback={<Loader centered={true} />}>
      <ViewTransition>
        <SessionProvider session={session}>
          <SidebarProvider>
            <AppSidebar user={user as User} />
            <SidebarInset>{children}</SidebarInset>
          </SidebarProvider>
        </SessionProvider>
      </ViewTransition>
    </Suspense>
  )
}