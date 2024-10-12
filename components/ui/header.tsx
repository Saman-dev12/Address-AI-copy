'use client'

import Link from "next/link"
import { useState } from "react"
import { useMedia } from "react-use"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const navItems = ["Home", "Features", "Pricing", "Documentation"]

export default function Header() {
  const isMobile = useMedia("(max-width: 1024px)", false)
  const [isOpen, setIsOpen] = useState(false)

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => (
        <Button
          key={item}
          variant="ghost"
          asChild
          className={`${
            mobile
              ? "justify-start py-6 text-base bg-black hover:bg-gray-900 w-full"
              : "opacity-60 hover:bg-white/5 hover:opacity-100"
          } transition-colors duration-300`}
        >
          <Link href={`/${item.toLowerCase()}`}>{item}</Link>
        </Button>
      ))}
    </>
  )

  const MobileNav = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="lg:w-auto justify-between bg-white/10 text-white font-normal hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none focus:bg-white/30 transition"

        >
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-black text-white">
        <SheetHeader>
          <SheetTitle className="text-white">Navigation</SheetTitle>
          <SheetDescription className="text-gray-400">
            Access different sections of AddressAI
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col mt-4 space-y-2">
          <NavItems mobile />
        </nav>
        <Button
          variant="outline"
          asChild
          className="bg-gradient-to-br mt-8 w-full from-purple-500 to-purple-700 text-gray-200 hover:opacity-80 hover:text-gray-200 transition-colors duration-300 border-none rounded-xl py-5"
        >
          <Link href="/sign-in">Login</Link>
        </Button>
      </SheetContent>
    </Sheet>
  )

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-gray-950/20">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center">
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
          <Link href="/" className="text-2xl font-bold text-purple-400">
            AddressAI
          </Link>
        </div>
        {isMobile ? (
          <MobileNav />
        ) : (
          <>
            <nav>
              <ul className="flex space-x-6">
                <NavItems />
              </ul>
            </nav>
            <Button
              variant="outline"
              asChild
              className="bg-gradient-to-br from-purple-500 to-purple-700 text-gray-200 hover:opacity-80 hover:text-gray-200 transition-colors duration-300 border-none"
            >
              <Link href="/sign-in">Login</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  )
}