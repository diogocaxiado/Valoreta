import "./Message.css";
import Image from "../../assets/image/Valorant-Icon.png";

export default function Message({ randomAgent }) {
  return (
    <section className={randomAgent ? "page-layout-agent" : "page-layout"}>
      <div className="page-section">
        {!randomAgent && <img className="page-image" src={Image} />}
        {!randomAgent && <h1 className="page-title">Valoreta</h1>}
        {!randomAgent && (
          <p className="page-description">
            Está com dúvida no que jogar? Clique no botão
          </p>
        )}
      </div>
    </section>
  );
}
