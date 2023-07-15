import './Agentes.css';

export default function Agentes({imgAgent}) {
    return (
        <section className="card-agent">
            <img src={imgAgent} alt="icone do agente" />
        </section>
    )
}