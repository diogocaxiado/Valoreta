import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { ref, set, serverTimestamp } from "firebase/database";
import { db } from "../../infra/firebase/config";
import { Background } from "../../common/components/Background/Background";
import { Topbar } from "../../common/components/Topbar/Topbar";
import { LobbyButton } from "./components/LobbyButton";
import BgScreen from "../../assets/video/Valorant.mp4";

export function LobbyPage() {
  const navigate = useNavigate();

  function handleSoloDraw() {
    navigate("/solo");
  }

  async function handleWithFriends() {
    const roomId = nanoid(8);
    const roomRef = ref(db, `room/${roomId}`);

    await set(roomRef, {
      createdAt: serverTimestamp(),
      players: [],
    });

    navigate(`/room/${roomId}`);
  }

  return (
    <main>
      <Background type="video" src={BgScreen} />

      <div className="flex justify-between">
        <div className="py-4 px-8">
          <h1 className="text-6xl z-10 text-neon-blue font-valorant">
            vAloreta
          </h1>
        </div>

        <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
          <Topbar title="Lobby" />
        </div>
      </div>

      <div className="flex flex-col justify-center items-end p-8 min-h-[80vh]">
        <div
          className="
            flex flex-col gap-8
            border border-cyan-400 rounded-br-2xl p-8
            bg-gradient-to-b from-cyan-800/30 to-transparent
            shadow-[0_0_15px_rgba(0,255,255,0.7)]
            backdrop-blur-sm
          "
        >
          <LobbyButton
            onClick={handleSoloDraw}
            icon="solo"
            title="Sorteio solo"
            description="Rápido e local"
          />

          <LobbyButton
            onClick={handleWithFriends}
            icon="group"
            title="Criar sala"
            description="Para compartilhar com amigos"
          />
        </div>
      </div>
    </main>
  );
}
