import "./Button.css";

export default function Button({ handleClickButton }) {
  return (
    <div>
      <div className="randomize-button">
        <button onClick={() => handleClickButton()}>Rodar</button>
      </div>
    </div>
  );
}
