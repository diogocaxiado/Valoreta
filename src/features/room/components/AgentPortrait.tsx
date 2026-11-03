interface AgentPortraitProps {
  getAgentData: (property: string) => string;
  getAgentClass: (property: string) => string;
}

export function AgentPortrait({
  getAgentData,
  getAgentClass,
}: AgentPortraitProps) {
  return (
    <section className="flex justify-center pointer-events-none select-none">
      <div className="flex justify-center items-center absolute z-10 top-2 left-6 sm:left-12 md:left-24 w-1/4 md:w-1/5 opacity-80 pointer-events-none">
        <img
          className="w-full object-contain"
          alt="agent class"
          src={getAgentData("background")}
        />
      </div>
      <img
        className="
          absolute z-10
          bottom-6 sm:bottom-8 md:bottom-10 lg:bottom-22
          w-auto object-contain pointer-events-none select-none
          max-h-[75vh] md:max-h-[80vh] lg:max-h-[90vh] xl:max-h-[92vh]
          max-w-[85%] md:max-w-[75%] lg:max-w-none
          lg:h-[85vh] xl:h-[90vh]
          p-2 md:p-6 lg:p-10 xl:p-4
        "
        src={getAgentData("fullPortrait")}
        alt="agent photo"
      />
    </section>
  );
}
