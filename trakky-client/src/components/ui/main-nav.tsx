"use client";

import React, { useContext } from "react";
import { Github, LogOut } from "lucide-react";
import { AuthContext, IAuthContext } from "react-oauth2-code-pkce";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { demoMode } from "@/constants.ts";

interface Links {
  href: string;
  label: string;
}

export function MainNav({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const {logOut, loginInProgress, token, tokenData} = useContext<IAuthContext>(AuthContext)

  const links: Links[] = [
    { href: "/", label: "Home" },
  ];

  if(token || demoMode) {
    links.push({ href: "/dashboards", label: "Dashboards" });
    links.push({ href: "/overview", label: "Overview" });
    links.push({ href: "/settings", label: "Settings" });
  }

  return (
    <>
      <div className="sticky top-0 bg-gray-950 z-50">
        <div className="flex-col md:flex">
          <div className="border-b">
            <div className="flex justify-between items-center w-full">
              <div className="w-full flex h-16 items-center px-4 mx-6 lg:mx-12">
                <nav {...props} className="w-full">
                  <div className="flex flex-row justify-between gap-3">
                    <div className="flex flex-row align-center py-2 gap-2">
                      {links.map((link, index) => {
                        return (
                          <a
                            key={index}
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
                    </div>
                    <div className="flex flex-row justify-around gap-6">
                      {
                        !loginInProgress &&
                          token && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger
                                  className="rounded w-4 flex justify-center items-center hover:text-gray-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring "
                                >
                                  <LogOut onClick={() => logOut()} className="w-4"/>
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-800 text-white">
                                  Logout {tokenData?.preferred_username}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                        )
                      }
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger
                            className="rounded w-4 flex justify-center items-center hover:text-gray-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring "
                          >
                            <a
                              href="https://github.com/Joe85gr/trakky"
                              className="cursor-pointer inline-flex items-center justify-center text-slate-600 hover:text-slate-500 h-8 py-2"
                              target="_blank"
                            >
                              <Github className="h-4 w-4" />
                            </a>
                          </TooltipTrigger>
                          <TooltipContent className="bg-slate-800 text-white">
                            GitHub
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </nav>

              </div>
            </div>

          </div>
        </div>
      </div>
        {children}
    </>
  );
}
