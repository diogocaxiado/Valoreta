import "./Overview.css";

export default function Overview({ getAgentData, getAgentClass }) {
  return (
    <div className="overview-agent">
      <strong className="agent-class">{getAgentClass("displayName")}</strong>
      <h2 className="agent-name">{getAgentData("displayName")}</h2>
      <p className="agent-info">{getAgentData("description")}</p>

      <strong className="name-class">{getAgentClass("displayName")}</strong>
      <p className="class-info">{getAgentClass("description")}</p>
    </div>
  );
}
