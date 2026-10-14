// snippet prc
import { cookies } from 'next/headers'
import { metadata } from "@/app/layout";
import { TabBar } from "@/components";
import { Suspense } from 'react';

async function CookiesContent() {
  const cookieStore = await cookies();
  const selectedTab = Number(cookieStore.get("selectedTab")?.value ?? "1");
  const allCookies = cookieStore.getAll();
  return <div className='flex'>
    {JSON.stringify(allCookies)}
    <TabBar currentTab={selectedTab} />;
  </div>
}

metadata.title = 'Cookies'
metadata.description = 'working with cookies'
export default async function CookiesPage() {
  
  return (
    <div className="bg-blue-400">
      <div className="flex flex-col">
        <span className="text-3xl">Tabs</span>
        <Suspense fallback={<div role="status">Cargando pestañas...</div>}>
          <CookiesContent />
        </Suspense>
      </div>
    </div>
  );
}