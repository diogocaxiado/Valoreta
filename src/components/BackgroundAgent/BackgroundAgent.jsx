import "./BackgroundAgent.css";

export default function BackgroundAgent({ getAgentData }) {
  return (
    <div className="agent">
      <img className="background-agent" src={getAgentData("background")} />
      <img
        className="agent-body"
        src={getAgentData("fullPortrait")}
        alt="agent photo"
      />
    </div>
  );
}
