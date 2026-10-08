// Admin Dashboard https://tailwindcomponents.com/component/dashboard-12

import { Sidebar } from "@/components/sidebar/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-row bg-gray-50 lg:flex-row">
      <Sidebar />
      <main className="min-w-0 flex-1 px-6 py-6 bg-amber-700">{children}</main>
    </div>
  );
}
