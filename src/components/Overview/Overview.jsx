import "./Overview.scss";
import CardAbilities from "../CardAbilities/CardAbilities";

export default function Overview({
  getAgentData,
  getAgentClass,
  abilities,
  descriptionAbility,
  setDescriptionAbility,
}) {
  function handleClickDescriptionAbilitie(prop) {
    const result = abilities.find((abilitie) => abilitie.slot === prop);
    setDescriptionAbility(result);
  }

  function handleClickInfo() {
    setDescriptionAbility("");
  }

  return (
    <section className="overview-container">
      <strong className="overview-agent-class">
        {getAgentClass("displayName")}
      </strong>
      <h2 className="overview-agent-name">{getAgentData("displayName")}</h2>

      <div className="overview-agent-abilities">
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
      <p className="overview-agent-info">
        {descriptionAbility !== ""
          ? descriptionAbility.description
          : getAgentClass("description")}
      </p>

      <strong className="overview-class-name">
        {getAgentClass("displayName")}
      </strong>
      <p className="overview-class-info">{getAgentClass("description")}</p>
    </section>
  );
}
