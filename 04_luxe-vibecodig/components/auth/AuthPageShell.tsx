export default function AuthPageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#EEF6F6] p-4 antialiased text-[#19322F]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#D9ECC8]/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#006655]/10 blur-3xl" />
      </div>
      {children}
    </div>
  );
}
