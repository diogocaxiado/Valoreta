import "./Background.css";
import ValorantScreen from "../../assets/video/Valorant.mp4";

export default function Background() {
  return (
    <section className="Background">
      <video autoPlay loop muted>
        <source src={ValorantScreen} type="video/mp4" />
      </video>
    </section>
  );
}
