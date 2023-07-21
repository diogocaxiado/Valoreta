import "./Main.css";

export default function Main({ getAgentData, randomAgent }) {
  return (
    <div className="page-layout">
      <section className="page-section">
        <h2 className="title">
          {randomAgent
            ? getAgentData("displayName")
            : "Bem vindo ao Valorant Roleta"}
        </h2>
        <p className="description">
          {randomAgent
            ? getAgentData("description")
            : "Está com dúvida no que jogar? Clique no botão"}
        </p>
      </section>
    </div>
  );
}
