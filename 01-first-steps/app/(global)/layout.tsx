import { Navbar } from '@/components';

export default function GlobalLayout({
 children
}: {
 children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center p-24">
      <span className="text-lg"> HELLO HELLO</span>
      {children}
      </main>
    </>
  );
}