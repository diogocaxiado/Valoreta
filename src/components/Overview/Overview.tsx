import CardAbilities from "../CardAbilities/CardAbilities";
import { Dispatch, SetStateAction } from "react";

interface OverviewProps {
  getAgentData: any
  getAgentClass: any
  abilities: any
  descriptionAbility: any
  setDescriptionAbility: Dispatch<SetStateAction<any>>
}

export default function Overview({
  getAgentData,
  getAgentClass,
  abilities,
  descriptionAbility,
  setDescriptionAbility,
}: OverviewProps) {
  function handleClickDescriptionAbilitie(prop) {
    const result = abilities.find((abilitie) => abilitie.slot === prop);
    setDescriptionAbility(result);
  }

  function handleClickInfo() {
    setDescriptionAbility("");
  }

  return (
    <section className="flex flex-col z-20 absolute top-4 right-2 w-1/4 p-8 border-2 border-white/50 bg-black bg-opacity-30">
      <strong className="font-tungsten text-2xl uppercase tracking-widest">
        {getAgentClass("displayName")}
      </strong>
      <h2 className="text-8xl uppercase tracking-wide leading-none text-valorant-yellow">{getAgentData("displayName")}</h2>

      <div className="flex gap-0.5 my-5">
        <CardAbilities
          name={"INFO"}
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
                handle={handleClickDescriptionAbilitie}
              />
            )
        )}
      </div>
      <p className="break-words w-full my-1 font-prompt text-base font-semibold text-valorant-light">
        {descriptionAbility !== ""
          ? descriptionAbility.description
          : getAgentClass("description")}
      </p>

      <strong className="text-3xl uppercase tracking-wide text-white">
        {getAgentClass("displayName")}
      </strong>
      <p className="w-full font-prompt text-base text-left text-white">{getAgentClass("description")}</p>
    </section>
  );
}
