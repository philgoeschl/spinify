import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-0 md:pt-16 pb-20 md:pb-0 min-h-screen">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
