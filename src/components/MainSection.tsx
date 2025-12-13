import mSection from "../data/mainSection.json";

const MainSlider = () => {
  const main = mSection[0];
  return (
    <div style={{ position: "relative" }}>
      <div>
        <img src={main.main_img} alt="" />
      </div>
      <div style={{ width: "45rem", position: "absolute", bottom: "50%", left: "10%" }}>
        <p
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            gap: "30px",
          }}>
          <span>
            <img
              src="/images/badge/badge-wavve-original.svg"
              alt=""
              style={{ height: "30px", alignItems: "start", objectFit: "cover" }}
            />
          </span>
          <span>
            <img src={main.main_Title} alt="" />
          </span>
        </p>
        <p>
          <span>
            <img src="images/badge/badge-19.svg" alt="" style={{ height: "30px" }} />
          </span>
          <span>{main.genres[0].name} </span>
          <span>{main.next_episode_to_air.runtime || "2시간 3분"}</span>
        </p>
        <p>{main.main_desc}</p>
      </div>
    </div>
  );
};

export default MainSlider;
