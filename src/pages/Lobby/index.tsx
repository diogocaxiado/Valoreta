import { useNavigate, useParams } from "react-router-dom";
import Background from "../../components/Background/Background";
import BgScreen from "../../assets/video/Valorant.mp4";
import Topbar from "./components/Topbar";

import Button from "./components/Button";
import Dice from "../../assets/image/dice.png"

const Lobby = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();

  function handleClickButton() {

  }

  function handleSoloDraw() {
    navigate('/sorteio')
  }

  return (
    <main>
      <Background type="video" src={BgScreen} />

      <div className="py-4 px-8">
        <h1 className="text-6xl z-10 text-neon-blue">vAloreta</h1>
      </div>

      <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
        <Topbar title="Lobby" />
      </div>

      <div className="flex flex-col justify-center items-end p-8 min-h-[80vh]">
        <div className="
          flex flex-col gap-8
          border border-cyan-400 rounded-br-2xl p-8
          bg-gradient-to-b from-cyan-800/30 to-transparent
          shadow-[0_0_15px_rgba(0,255,255,0.7)]
          backdrop-blur-sm
          "
        >
          <Button 
            onClick={handleSoloDraw}
            srcImage={Dice}
            altImage="Dado"
            title="Sorteio solo"
            description="Rápido e local"
          />
          <Button 
            onClick={() => console.log("TESTE")}
            srcImage={Dice}
            altImage="Dado"
            title="Criar sala"
            description="Para compartilhar com amigos"
          />
        </div>
      </div>
    </main>
  );
};

export default Lobby;
