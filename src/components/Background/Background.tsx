import BgScreen from "../../assets/image/background.jpg";

export default function Background() {
  return (
    <section className="absolute top-0 w-full ">
      <img src={BgScreen} className="w-full h-screen object-cover" />
    </section>
  );
}
