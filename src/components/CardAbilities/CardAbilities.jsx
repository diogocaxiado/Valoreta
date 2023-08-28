import "./CardAbilities.scss";

export default function CardAbilities({ name, src, alt, handle }) {
  return (
    <section className="abilities-box" key={name}>
      <div className="abilities-name" onClick={() => handle(name)}>
        <strong className="abilities-strong">{name}</strong>
      </div>

      <img className="abilities-img" src={src} alt={alt} />
    </section>
  );
}
