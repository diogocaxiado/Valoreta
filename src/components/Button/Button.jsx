import "./Button.css";

export default function Button({ handleClickButton }) {
  return (
    <>
      <section className="randomize-button">
        <button onClick={() => handleClickButton()}>Rodar</button>
      </section>
    </>
  );
}
