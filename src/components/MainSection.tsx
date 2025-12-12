import mSection from "../data/mainSection.json";

const MainSlider = () => {
  const main = mSection[0];
  return (
    <div>
      <img src={main.main_img} alt="" />
    </div>
  );
};

export default MainSlider;
