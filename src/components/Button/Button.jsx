import "./Button.scss";

export default function Button({ handleClickButton }) {
  return (
    <>
      <section className="randomize-container">
        <button
          className="randomize-button"
          onClick={() => handleClickButton()}
        >
          Rodar
        </button>
      </section>
    </>
  );
}
