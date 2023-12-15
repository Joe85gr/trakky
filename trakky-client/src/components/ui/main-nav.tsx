"use client";

import React from "react";
import { demoMode } from "@/constants.ts";
import { Github } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface Links {
  href: string;
  label: string;
}

export function MainNav({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const links: Links[] = [
    { href: "/", label: "Home" },
    { href: "/expenses", label: "Expenses" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  const editLinks: Links[] = [
    { href: "/users", label: "Users" },
    { href: "/budgets", label: "Budgets" },
    { href: "/types", label: "Types" },
  ];

  return (
    <>
      <div className="sticky top-0 bg-gray-950 z-50">
        <div className="flex-col md:flex">
          <div className="border-b">
            <div className="flex justify-between items-center">
              <div className="flex h-16 items-center px-4 mx-6">
                <nav {...props}>
                  {links.map((link, index) => {
                    return (
                      <a
                        key={`link-${index}`}
                        tabIndex={index}
                        href={link.href}
                        className={
                          window.location.pathname === link.href
                            ? "text-sm font-medium text-slate-200 transition-colors focus:outline-none"
                            : "text-sm font-medium text-muted-foreground transition-colors hover:text-slate-600 focus:outline-none"
                        }
                      >
                        {link.label}
                      </a>
                    );
                  })}
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="text-sm font-medium text-muted-foreground transition-colors hover:bg-transparent hover:text-slate-600 focus:outline-none">
                          Edit
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="flex flex-col text-left p-2 w-[100px] z-50">
                            {editLinks.map((link, index) => {
                              return (
                                <a key={`edit-${index}`} href={link.href} className="flex flex-col p-2 cursor-pointer text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/50 h-full w-full rounded hover:text-slate-600 focus:outline-none">
                                  {link.label}
                                </a>
                              )
                            }) }
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                  {demoMode && (
                    <div className="text-sm font-medium text-destructive">
                      Demo mode
                    </div>
                  )}
                </nav>
              </div>
              <a
                href="https://github.com/Joe85gr/trakky"
                className="cursor-pointer text-slate-600 hover:text-slate-500"
                target="_blank"
              >
                <Github className="mr-6 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
