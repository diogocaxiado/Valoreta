import "./CardAbilities.css";

export default function CardAbilities({ name, src, alt }) {
  return (
    <div className="abilities">
      <div className="abilities-name">
        <strong>{name}</strong>
      </div>

      <img src={src} alt={alt} />
    </div>
  );
}
