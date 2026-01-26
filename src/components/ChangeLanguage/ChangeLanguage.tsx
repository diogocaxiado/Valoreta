import i18n from "../../i18n";

const ChangeLanguage = () => {
  return (
    <div className="
      flex flex-col justify-center 
      border border-cyan-400 bg-gradient-to-b from-cyan-800/30 to-transparent
      shadow-[0_0_15px_rgba(0,255,255,0.7)]
    ">
      <button className="text-white font-valorant p-4 shadow-[0_0_15px_rgba(0,255,255,0.7)]" onClick={() => i18n.changeLanguage("pt")}>🇧🇷 PT</button>
      <button className="text-white font-valorant p-4 shadow-[0_0_15px_rgba(0,255,255,0.7)]" onClick={() => i18n.changeLanguage("en")}>🇺🇸 EN</button>
    </div>
  )
}

export default ChangeLanguage;