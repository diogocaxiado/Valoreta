import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group [&_[data-close-button]]:!left-auto [&_[data-close-button]]:!right-2 [&_[data-close-button]]:!top-2 [&_[data-close-button]]:![transform:none]"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border group-[.toaster]:border-border/50 group-[.toaster]:shadow-lg group-[.toast]:max-w-[380px] group-[.toast]:w-full",
          title: "group-[.toast]:font-montserrat group-[.toast]:font-bold group-[.toast]:text-sm group-[.toast]:leading-snug",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:font-prompt group-[.toast]:text-sm group-[.toast]:leading-relaxed group-[.toast]:mt-1",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}
