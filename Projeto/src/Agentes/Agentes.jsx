import './Agentes.css';

function Agentes({imgAgente}) {
    return (
        <section className="card-agent">
            <img src={imgAgente} alt="icone do agente" />
        </section>
    )
}

export default Agentes;