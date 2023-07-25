import "./PortraitAgent.css";

export default function BackgroundAgent({ getAgentData, getAgentClass }) {
  return (
    <div className="agent">
      <div className="class-border">
        <img
          className="class-icon"
          alt="agent class"
          src={getAgentClass("displayIcon")}
        />
      </div>
      <img
        className={"agent-body"}
        src={getAgentData("fullPortrait")}
        alt="agent photo"
      />
    </div>
  );
}
