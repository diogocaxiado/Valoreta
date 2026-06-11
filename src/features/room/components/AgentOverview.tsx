import { Dispatch, SetStateAction } from "react";
import { IAgentAbilities } from "../../../types";
import { Card } from "../../../common/components/ui/card";
import { CardAbilities } from "./CardAbilities";

interface AgentOverviewProps {
  getAgentData: (property: string) => string;
  getAgentClass: (property: string) => string;
  abilities: IAgentAbilities[];
  descriptionAbility: IAgentAbilities | string;
  setDescriptionAbility: Dispatch<SetStateAction<IAgentAbilities | string>>;
}

export function AgentOverview({
  getAgentData,
  getAgentClass,
  abilities,
  descriptionAbility,
  setDescriptionAbility,
}: AgentOverviewProps) {
  function handleClickDescriptionAbility(prop: string) {
    const result = abilities.find((abilitie) => abilitie.slot === prop);
    if (result) setDescriptionAbility(result);
  }

  function handleClickInfo() {
    setDescriptionAbility("");
  }

  return (
    <Card className="flex flex-col z-20 absolute top-4 right-2 w-1/4 p-6 border-2 border-white/50 bg-black/80 backdrop-blur-sm shadow-none">
      <strong className="font-montserrat font-bold text-h4 uppercase tracking-widest text-valorant-cyan">
        {getAgentClass("displayName")}
      </strong>
      <h2 className="text-8xl font-montserrat font-extrabold uppercase tracking-wide leading-none text-valorant-yellow">
        {getAgentData("displayName")}
      </h2>

      <div className="flex gap-0.5 my-5">
        <CardAbilities
          name="INFO"
          src={getAgentClass("displayIcon")}
          alt="agent info description"
          handle={handleClickInfo}
        />

        {abilities.map(
          (abilitie) =>
            abilitie.slot !== "Passive" && (
              <CardAbilities
                key={abilitie.slot}
                name={abilitie.slot}
                src={abilitie.displayIcon}
                alt={abilitie.displayName}
                handle={handleClickDescriptionAbility}
              />
            )
        )}
      </div>
      <p className="break-words w-full my-1 font-prompt text-base font-semibold text-valorant-light">
        {typeof descriptionAbility === "object"
          ? descriptionAbility.description
          : getAgentClass("description")}
      </p>

      <strong className="text-h3 font-montserrat font-bold uppercase tracking-wide text-white">
        {getAgentClass("displayName")}
      </strong>
      <p className="w-full font-prompt text-base text-left text-white">
        {getAgentClass("description")}
      </p>
    </Card>
  );
}
