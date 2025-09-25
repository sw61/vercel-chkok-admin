import { AppSidebar } from '@/components/sideBar/appSidebar';
import { SiteHeader } from '@/components/sideBar/siteHeader';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Outlet } from 'react-router-dom';
export const iframeHeight = '800px';

export default function SideBar() {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col pt-[var(--header-height)]">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex-1 px-6 py-4">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
