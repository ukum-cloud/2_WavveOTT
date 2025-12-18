import { usePickStore } from "../stores/usePickStore";

import { Swiper } from "swiper/react";
import SwiperDefault from "./SwiperDefault";
import "./scss/SwiperDefault.scss";

const UserPickList = () => {
  const { pickList } = usePickStore();
  console.log("찜리스트", pickList);
  return (
    <>
      <SwiperDefault data={pickList} />
    </>
  );
};

export default UserPickList;
