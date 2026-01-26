
interface BackgroundAgent {
  getAgentData: any
  getAgentClass: any
}

export default function BackgroundAgent({ getAgentData, getAgentClass }: BackgroundAgent) {
  return (
    <section className="flex justify-center">
      <div className="flex justify-center items-center absolute z-10 top-2 left-24 w-1/5 opacity-80">
        <img
          className="w-full"
          alt="agent class"
          src={getAgentData("background")}
        />
      </div>
      <img
        className="absolute z-10 bottom-0 lg:w-3/5 lg:p-24"
        src={getAgentData("fullPortrait")}
        alt="agent photo"
      />
    </section>
  );
}
