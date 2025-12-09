'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { ToastProvider } from "@/contexts/ToastContext";
import { AlertProvider } from "@/contexts/AlertContext";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    // Don’t render dash until auth check passes
    return null;
  }
  
  return (
    <ToastProvider>
      <AlertProvider>
        <div className="h-screen flex">
          {/* LEFT */}
          <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
            <Link href="/" className="flex items-center justify-center lg:justify-start gap-2" >
              <Image src="/logo.png" alt="logo" width={32} height={32} />
              <span className="hidden lg:block font-bold">Logbook</span>
            </Link>
            <Menu />
          </div>
          {/* RIGHT */}
          <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
            <Navbar />
            {children}
          </div>
        </div>
      </AlertProvider>
    </ToastProvider>
  );
}