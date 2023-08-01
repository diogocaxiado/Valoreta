import "./CardAbilities.css";

export default function CardAbilities({ name, src, alt, handle }) {
  return (
    <section className="abilities-box" key={name}>
      <div className="abilities-name" onClick={() => handle(name)}>
        <strong>{name}</strong>
      </div>

      <img src={src} alt={alt} />
    </section>
  );
}
