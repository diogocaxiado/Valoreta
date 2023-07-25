import "./Overview.css";
import CardAbilities from "../CardAbilities/CardAbilities";

export default function Overview({ getAgentData, getAgentClass, abilities }) {
  return (
    <div className="overview-agent">
      <strong className="agent-class">{getAgentClass("displayName")}</strong>
      <h2 className="agent-name">{getAgentData("displayName")}</h2>

      <div className="card-abilities">
        <CardAbilities name={"INFO"} src={getAgentClass("displayIcon")} />

        {abilities.map(
          (abilitie) =>
            abilitie.slot !== "Passive" && (
              <CardAbilities
                name={abilitie.slot}
                src={abilitie.displayIcon}
                alt={abilitie.displayName}
              />
            )
        )}
      </div>
      <p className="agent-info">{getAgentData("description")}</p>

      <strong className="name-class">{getAgentClass("displayName")}</strong>
      <p className="class-info">{getAgentClass("description")}</p>
    </div>
  );
}
