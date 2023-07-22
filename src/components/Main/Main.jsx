import "./Main.css";

export default function Main({ randomAgent }) {
  return (
    <div className={randomAgent ? "page-layout-agent" : "page-layout"}>
      <section className="page-section">
        <h2 className="title">
          {randomAgent ? null : "Bem vindo ao Valorant Roleta"}
        </h2>
        <p className="description">
          {randomAgent ? null : "Está com dúvida no que jogar? Clique no botão"}
        </p>
      </section>
    </div>
  );
}
