import "./Message.css";
import Image from "../../assets/image/Valorant-Icon.png";

export default function Message({ randomAgent, getAgentAbilities }) {
  if (randomAgent) {
    getAgentAbilities();
  }

  return (
    <div className={randomAgent ? "page-layout-agent" : "page-layout"}>
      <section className="page-section">
        <img className="page-image" src={!randomAgent && Image} />
        <h1 className="page-title">{!randomAgent && "Valoreta"}</h1>
        <p className="page-description">
          {!randomAgent && "Está com dúvida no que jogar? Clique no botão"}
        </p>
      </section>
    </div>
  );
}
