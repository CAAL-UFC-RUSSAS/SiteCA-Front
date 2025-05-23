'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { navItems } from '@/config/navigation';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { NavItem } from '@/types/navigation';

function DesktopNav() {
  return (
    <div className="relative flex items-center">
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          {navItems.map((item, index) => (
            <NavigationMenuItem key={index}>
              {item.submenu ? (
                <>
                  <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[300px] md:grid-cols-2 lg:w-[400px]">
                      {item.submenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          {subItem.submenu ? (
                            <div className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">{subItem.label}</div>
                              <ul className="mt-2 space-y-2">
                                {subItem.submenu.map((subSubItem, subSubIndex) => (
                                  <li key={subSubIndex}>
                                    <NavigationMenuLink asChild>
                                      <Link
                                        href={subSubItem.href!}
                                        className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                      >
                                        {subSubItem.label}
                                      </Link>
                                    </NavigationMenuLink>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <NavigationMenuLink asChild>
                              <Link
                                href={subItem.href!}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">{subItem.label}</div>
                              </Link>
                            </NavigationMenuLink>
                          )}
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink asChild>
                  <Link
                    href={item.href!}
                    className={cn(navigationMenuTriggerStyle())}
                  >
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

function MobileNav({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-40 flex flex-col p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-indigo-700">Menu</h2>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>
      </div>
      <ul className="space-y-4">
        {navItems.map((item, index) => (
          <MobileNavItem key={index} item={item} />
        ))}
      </ul>
    </div>
  );
}

function MobileNavItem({ item }: { item: NavItem }) {
  return (
    <li>
      {item.submenu ? (
        <details className="group">
          <summary className="flex items-center justify-between px-2 py-2 text-blue-600 hover:bg-blue-50 rounded cursor-pointer">
            {item.label}
            <svg
              className="h-4 w-4 transition-transform duration-200 group-open:rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </summary>
          <ul className="pl-4 mt-1 space-y-1">
            {item.submenu.map((sub, idx) => (
              <MobileNavItem key={idx} item={sub} />
            ))}
          </ul>
        </details>
      ) : (
        <Link href={item.href!} className="block px-2 py-2 hover:bg-blue-50 rounded">
          {item.label}
        </Link>
      )}
    </li>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar bg-white shadow-md px-6 py-4 relative z-50">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-indigo-700">
          <Image
            src="/logoCAAL.svg"
            alt="Logo"
            width={60}      
            height={70}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="flex-col items-center hidden lg:flex">
          <Link href="/">
            <Image
              src="/titulo.svg"
              alt="Logo"
              width={650} 
              height={50}
              priority 
            />
          </Link>
          <DesktopNav />
        </div>

        {/* UFC Logo */}
        <div className="text-sm text-gray-600 hidden lg:block">
          <Image
            src="/imgs/ufclogo.png"
            alt="Logo"
            width={50} 
            height={60}
            priority 
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="btn btn-ghost lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </nav>
  );
}
