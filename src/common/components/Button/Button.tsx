import { Button as ShadcnButton } from "../ui/button"

interface ButtonProps {
  title: string
  variant?: "primary" | "secondary"
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  className?: string
}

export function Button({
  title,
  variant = "secondary",
  onClick,
  disabled,
  loading,
  className,
}: ButtonProps) {
  const shadcnVariant = variant === "primary" ? "default" : "secondary"

  return (
    <section className="flex justify-center items-center relative z-10">
      <div className="relative group">
        <ShadcnButton
          variant={shadcnVariant}
          size="default"
          disabled={disabled}
          loading={loading}
          onClick={onClick}
          className={className}
        >
          {title}
        </ShadcnButton>

        {disabled && !loading && (
          <span
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2
            bg-black text-white text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100
            transition-opacity duration-300 whitespace-nowrap pointer-events-none"
          >
            Escolha um agente antes de rodar!
          </span>
        )}
      </div>
    </section>
  )
}
