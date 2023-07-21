import "./Button.css";

export default function Button({ handleClick }) {
  return (
    <div>
      <div className="randomize-button">
        <button onClick={() => handleClick()}>Rodar</button>
      </div>
    </div>
  );
}
