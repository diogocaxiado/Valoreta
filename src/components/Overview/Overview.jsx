import "./Overview.css";
import CardAbilities from "../CardAbilities/CardAbilities";

export default function Overview({
  getAgentData,
  getAgentClass,
  abilities,
  descriptionAbility,
  setDescriptionAbility,
}) {
  function handleClickDescription(prop) {
    const result = abilities.find((abilitie) => abilitie.slot === prop);
    setDescriptionAbility(result);
  }

  function handleClickInfo() {
    setDescriptionAbility("");
  }

  return (
    <section className="overview-agent">
      <strong className="agent-class">{getAgentClass("displayName")}</strong>
      <h2 className="agent-name">{getAgentData("displayName")}</h2>

      <div className="card-abilities">
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
                handle={handleClickDescription}
              />
            )
        )}
      </div>
      <p className="agent-info">
        {descriptionAbility !== ""
          ? descriptionAbility.description
          : getAgentClass("description")}
      </p>

      <strong className="name-class">{getAgentClass("displayName")}</strong>
      <p className="class-info">{getAgentClass("description")}</p>
    </section>
  );
}
