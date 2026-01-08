import { useParams } from "react-router-dom";
import Background from "../../components/Background/Background";
import BgScreen from "../../assets/video/Valorant.mp4";

const Lobby = () => {
  const { roomId } = useParams<{ roomId: string }>();

  function handleClickButton() {

  }

  return (
    <main>
      <Background type="video" src={BgScreen} />

      <div className="py-4 px-8">
        <h1 className="text-6xl z-10 text-neon-blue">vAloreta</h1>
      </div>

      <div className="w-48 h-fit border border-slate-100">
        <div>
          <h3 className="text-slate-50">Sorteio solo</h3>
        </div>
      </div>
    </main>
  );
};

export default Lobby;
