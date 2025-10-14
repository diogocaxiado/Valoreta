
interface BackgroundAgent {
  getAgentData: any
  getAgentClass: any
}

export default function BackgroundAgent({ getAgentData, getAgentClass }: BackgroundAgent) {
  return (
    <section className="flex justify-center">
      <div className="flex justify-center items-center absolute z-10 top-4 left-4 w-1/5 opacity-60">
        <img
          className="w-full"
          alt="agent class"
          src={getAgentData("background")}
        />
      </div>
      <img
        className="absolute z-10 bottom-0 w-3/5"
        src={getAgentData("fullPortrait")}
        alt="agent photo"
      />
    </section>
  );
}
