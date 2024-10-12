"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CheckCircle, Eye, Settings, User, Menu, Barcode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import getCurrentUser from "@/actions/getCurrentUser";
import { signOut, useSession } from "next-auth/react";

// Define a User type to match the structure of the user data
type User = {
  name: string;
  id: string;
  email: string;
  password: string; // Consider removing this if not needed
  createdAt: Date | null;
  updatedAt: Date | null;
};

const SideNav = () => {
  // const [user, setUser] = useState<User | null>(null); // Update state type
  const session = useSession();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const iconClassName = "h-5 w-5 text-purple-500 group-hover:text-slate-100";
  const routes = [
    {
      label: "Overview",
      href: `/dashboard`,
      icon: <Home className={iconClassName} />,
    },
    {
      label: "Address Verification",
      href: `/dashboard/address-verifier`,
      icon: <CheckCircle className={iconClassName} />,
    },
    {
      label: "OCR Verification",
      href: `/dashboard/ocr-verifier`,
      icon: <Eye className={iconClassName} />,
    },
    {
      label: "Barcode Verification",
      href: `/dashboard/barcode-verifier`,
      icon: <Barcode className={iconClassName} />,
    },
    {
      label: "Settings",
      href: `/dashboard/settings`,
      icon: <Settings className={iconClassName} />,
    },
  ];

  const NavContent = () => (
    <>
      <div className="flex items-center mb-8">
        <svg
          className="h-8 w-8 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="#A855F7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="#A855F7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="#A855F7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {!isMobile && (
          <Link href="/" className="text-2xl font-bold text-purple-400">
            AddressAI
          </Link>
        )}
      </div>
      <div className="flex flex-col space-y-4 w-full mb-auto">
        {routes.map((route) => (
          <Link
            key={route.label}
            href={route.href}
            className={`font-medium text-white/90 w-full p-3 hover:bg-purple-500 hover:text-white duration-150 rounded-xl flex items-center group ${
              pathname === route.href ? "bg-slate-800" : ""
            }`}
            onClick={() => setIsOpen(false)}
          >
            {route.icon}
            {!isMobile && <span className="ml-2">{route.label}</span>}
          </Link>
        ))}
      </div>
      <div className="w-full mt-8">
        <Button onClick={()=>signOut({redirect:true,callbackUrl:'/'})} className="bg-purple-600 hover:bg-purple-600 hover:opacity-80 py-3 text-base w-full flex items-center justify-center">
          <User className="h-5 w-5 md:h-4 md:w-4" />
          {!isMobile && <span>{session.data?.user?.name || "User"}</span>}
        </Button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed top-4 left-4 z-50 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[80px] p-0" aria-label="Navigation menu">
          <SheetHeader>
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          </SheetHeader>
          <nav className="h-full flex flex-col bg-black text-white p-4">
            <NavContent />
          </nav>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="hidden lg:flex h-screen fixed inset-y-0 left-0 bg-black w-72 flex-col items-start text-white px-5 py-6 justify-between">
      <NavContent />
    </div>
  );
};

export default SideNav;