import { useNavigate, useParams } from "react-router-dom";
import Background from "../../components/Background/Background";
import BgScreen from "../../assets/video/Valorant-2.mp4";
import Topbar from "./components/Topbar";

import Button from "./components/Button";
import Dice from "../../assets/image/dice.png"
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

import { nanoid } from "nanoid";
import { db } from "../../services/firebase";
import { ref, set, serverTimestamp } from "firebase/database";
import ChangeLanguage from "../../components/ChangeLanguage/ChangeLanguage";

const Lobby = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  function handleSoloDraw() {
    navigate('/room');
  }

   async function handleWithFriends() {
    const roomId = nanoid(8);
    const roomRef = ref(db, `rooms/${roomId}`);

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
          <h1 className="text-6xl z-10 text-neon-blue font-valorant">vAloreta</h1>
        </div>

        <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
          <Topbar title="Lobby" />
        </div>

        <div className="py-4 px-8">
          <ChangeLanguage />
        </div>
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
            title={t("soloDraw.title")}
            description={t("soloDraw.description")}
          />
          
          <Button 
            onClick={handleWithFriends}
            srcImage={Dice}
            altImage="Dado"
            title={t("createRoom.title")}
            description={t("createRoom.description")}
          />
        </div>
      </div>
    </main>
  );
};

export default Lobby;
