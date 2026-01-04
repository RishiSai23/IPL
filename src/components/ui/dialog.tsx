"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className = "", ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 bg-black/60 z-50" />
    <DialogPrimitive.Content
      ref={ref}
      className={`
        fixed z-50
        left-1/2 top-1/2
        -translate-x-1/2 -translate-y-1/2
        w-full max-w-lg
        bg-gray-900
        rounded-lg
        shadow-lg
        flex flex-col
        max-h-[80vh]
        overflow-hidden
        ${className}
      `}
      {...props}
    />
  </DialogPrimitive.Portal>
))
DialogContent.displayName = "DialogContent"

export const DialogTitle = DialogPrimitive.Title
export const DialogHeader = DialogPrimitive.Title
