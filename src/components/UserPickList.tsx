import { usePickStore } from "../stores/usePickStore";

import { Swiper } from "swiper/react";
import SwiperDefault from "./SwiperDefault";
import "./scss/SwiperDefault.scss";

const UserPickList = () => {
  const { pickList } = usePickStore();
  return (
    <>
      <SwiperDefault data={pickList} />
    </>
  );
};

export default UserPickList;
