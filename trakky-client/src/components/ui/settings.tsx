import {
  AlignJustifyIcon, ClipboardType,
  Github, SettingsIcon,
  User2Icon, WalletIcon
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export function SettingsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AlignJustifyIcon className="cursor-pointer text-sm font-medium hover:text-slate-600 transition-colors text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36">
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem className="cursor-pointer">
                  <User2Icon className="mr-2 h-4 w-4" />
                  <span>Users</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <ClipboardType className="mr-2 h-4 w-4" />
                  <span>Types</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <WalletIcon className="mr-2 h-4 w-4" />
                  <span>Budgets</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <a
          href="https://github.com/Joe85gr/trakky"
          className=""
          target="_blank"
        >
          <DropdownMenuItem className="cursor-pointer text-right">
            <Github className="mr-2 h-4 w-4" />
            <span className="mr-auto">Source Code</span>
          </DropdownMenuItem>
        </a>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
