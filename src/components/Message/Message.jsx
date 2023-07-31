import "./Message.css";
import Image from "../../assets/image/Valorant-Icon.png";

export default function Message({ randomAgent, getAgentAbilities }) {
  if (randomAgent) {
    getAgentAbilities();
  }

  return (
    <section className={randomAgent ? "page-layout-agent" : "page-layout"}>
      <div className="page-section">
        <img className="page-image" src={!randomAgent ? Image : undefined} />
        <h1 className="page-title">{!randomAgent ? "Valoreta" : undefined}</h1>
        <p className="page-description">
          {!randomAgent
            ? "Está com dúvida no que jogar? Clique no botão"
            : undefined}
        </p>
      </div>
    </section>
  );
}
