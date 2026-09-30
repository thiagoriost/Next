import { Suspense } from "react";
import { Sidebar } from "../../components/sidebar/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode; }) {
    return (
      <div className="bg-slate-100 overflow-y-scroll w-screen h-screen antialiased text-slate-300 selection:bg-blue-600 selection:text-white">
        <p>Persistent content dashboard layout</p>
        <div className="flex">
          
            <Sidebar />
  
            <div className="  text-slate-900 w-full">
                <Suspense fallback={<p className="text-3xl text-slate-900">Loading...</p>}>
                  {children}
                </Suspense>
            </div>
  
        </div>
      </div>
    );
  }