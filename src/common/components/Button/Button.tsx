import { Button as ShadcnButton } from "../ui/button"
import { LockClosedIcon } from "@heroicons/react/24/solid"

interface ButtonProps {
  title: string
  variant?: "primary" | "secondary"
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  className?: string
  tooltip?: string
  restricted?: boolean
}

export function Button({
  title,
  variant = "secondary",
  onClick,
  disabled,
  loading,
  className,
  tooltip,
  restricted,
}: ButtonProps) {
  const shadcnVariant = variant === "primary" ? "default" : "secondary"

  const defaultTooltip = "Escolha um agente antes de rodar!"
  const showDefault = disabled && !loading && !tooltip

  return (
    <section className="flex justify-center items-center relative z-10">
      <div className="relative group">
        <ShadcnButton
          variant={shadcnVariant}
          size="default"
          disabled={disabled}
          loading={loading}
          onClick={onClick}
          className={`${restricted ? "opacity-40 cursor-not-allowed" : ""} ${className ?? ""}`}
        >
          {restricted && <LockClosedIcon className="w-4 h-4 mr-1.5" />}
          {title}
        </ShadcnButton>

        {(showDefault || tooltip) && (
          <span
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2
            bg-black text-white text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100
            transition-opacity duration-300 whitespace-nowrap pointer-events-none z-50"
          >
            {tooltip || defaultTooltip}
          </span>
        )}
      </div>
    </section>
  )
}
