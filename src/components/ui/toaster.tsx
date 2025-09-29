// file: src/components/ui/toaster.tsx
import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      theme="system"
      toastOptions={{
        classNames: {
          toast: "border bg-card text-card-foreground",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted",
        },
      }}
    />
  )
}