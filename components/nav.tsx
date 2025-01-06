'use client';

import { ConnectKitButton } from "connectkit";
import { login } from "@/app/actions";
import { thirdwebClient } from "../lib/client/thirdwebClient";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { useState } from 'react';
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, User, Menu } from 'lucide-react';
import ProfileSelectDialog from "./ProfileSelectDialog";
import { useTheme } from "@/app/contexts/ThemeContext";

export function Nav() {
  const account = useActiveAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleLogin = () => {
    login(account);
  };

  return (
    <nav className="bg-white sticky top-0 z-50 border-b-4 border-pink-400 p-4 [&_*]:shadow-cartoon">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <Link href="/" className="flex items-center">
        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center mr-2">
          <span className="text-purple-600 font-bold text-xl">T</span>
        </div>
        <span className="text-purple-600 font-bold text-xl">ToonNFT</span>
      </Link>

      <div className="hidden md:flex space-x-6">
        <Link href="/drops" className="text-purple-600 hover:text-purple-800 font-semibold">
          Drops
        </Link>
        <Link href="/create" className="text-purple-600 hover:text-purple-800 font-semibold">
          Create
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <Input
            type="text"
            placeholder="Search NFTs..."
            className="pl-10 pr-4 py-2 rounded-full border-2 border-purple-300 focus:border-purple-500 focus:outline-none"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
        </div>
        <ConnectButton client={thirdwebClient} />

        <Button onClick={handleLogin} variant="outline" className="hidden md:inline-flex bg-purple-100 text-purple-600 hover:bg-purple-200 rounded-full">
          Login
        </Button>
        {account ? (
              <>
          <ProfileSelectDialog account={account} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
              </>
            ) : <p>Logged</p>}

        <Button className="bg-yellow-400 text-purple-600 hover:bg-yellow-500 rounded-full">
          <User className="mr-2 h-4 w-4" /> Profile
        </Button>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-purple-100">
            <div className="flex flex-col space-y-4 mt-8">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search NFTs..."
                  className="pl-10 pr-4 py-2 rounded-full border-2 border-purple-300 focus:border-purple-500 focus:outline-none"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
              </div>
              <Link href="/drops" className="text-purple-600 hover:text-purple-800 font-semibold text-lg">
                Drops
              </Link>
              <Link href="/create" className="text-purple-600 hover:text-purple-800 font-semibold text-lg">
                Create
              </Link>
              <Button variant="outline" className="bg-purple-200 text-purple-600 hover:bg-purple-300 rounded-full">
                Login
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </nav>

  );
}
