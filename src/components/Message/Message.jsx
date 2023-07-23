import "./Message.css";
import Image from "../../assets/image/Valorant-Icon.png";

export default function Main({ randomAgent }) {
  return (
    <div className={randomAgent ? "page-layout-agent" : "page-layout"}>
      <section className="page-section">
        <img className="page-image" src={randomAgent ? null : Image} alt="" />
        <h1 className="page-title">{randomAgent ? null : "Valoreta"}</h1>
        <p className="page-description">
          {randomAgent ? null : "Está com dúvida no que jogar? Clique no botão"}
        </p>
      </section>
    </div>
  );
}
