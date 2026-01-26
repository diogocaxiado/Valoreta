
interface ButtonProps {
  title: string
  variant?: "primary" | "secondary"
  handleClickButton: () => void
  disabled?: boolean
}

export default function Button({ title, variant = "secondary", handleClickButton, disabled }: ButtonProps) {
  return (
    <section className="flex justify-center items-center relative z-10">
      <div className={`${disabled && "hover:border-valorant-purple"} p-0.5 border border-valorant-purple rounded-sm hover:border-valorant-red hover:transition-all hover:duration-300 hover:ease-in`}>
        <button
          className={`${variant === "primary" ? "text-white bg-valorant-red text-3xl px-20 py-2.5" : "text-black bg-valorant-yellow text-2xl px-20 py-3 min-w-72"} ${disabled && "cursor-auto opacity-70 hover:brightness-100"} cursor-pointer border-none font-tungsten uppercase hover:brightness-125 hover:transition-all hover:duration-300 hover:ease-in`}
          disabled={disabled}
          onClick={() => handleClickButton()}
          >
          {title}
        </button>
      </div>
    </section>
  );
}
