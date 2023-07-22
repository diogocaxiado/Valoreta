import "./BackgroundAgent.css";

export default function BackgroundAgent({ getAgentData, getAgentClass }) {
  return (
    <div className="agent">
      <div className="border-background-agent">
        <img className="background-agent" src={getAgentClass()} />
      </div>
      <img
        className="agent-body"
        src={getAgentData("fullPortrait")}
        alt="agent photo"
      />
    </div>
  );
}
