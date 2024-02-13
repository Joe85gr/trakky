import { PopupDialog } from "@/components/ui/table/popup-dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import React from "react";
import { EditIcon } from "@/components/ui/icons/icons.tsx";

export function EditCell({
  id,
  children
}: {
  id: any;
  children: React.ReactNode;
}) {
  return (
    <PopupDialog
      trigger={
        <Button
          key={id}
          variant="outline"
          className="bg-transparent hover:bg-transparent p-0 mx-1 my-0 h-5 border-none hover:text-green-500"
        >
          <EditIcon
            width={16}
            height={16}
            className="hover:text-green-500 text-green-500/50"
          />
        </Button>
      }
    >
      {children}
    </PopupDialog>
  );
}
