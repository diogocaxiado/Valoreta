
interface ButtonProps {
  handleClickButton: () => void
}

export default function Button({ handleClickButton }: ButtonProps) {
  return (
    <section className="flex justify-center items-center relative z-10">
      <div className="p-0.5 border border-valorant-purple rounded-sm hover:border-valorant-red hover:transition-all hover:duration-300 hover:ease-in">
        <button
          className="px-20 py-2.5 cursor-pointer border-none font-tungsten text-3xl uppercase text-white bg-valorant-red  hover:brightness-125 hover:transition-all hover:duration-300 hover:ease-in"
          onClick={() => handleClickButton()}
          >
          Rodar
        </button>
      </div>
    </section>
  );
}
