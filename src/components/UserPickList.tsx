import React from "react";
import { usePickStore } from "../stores/usePickStore";

const UserPickList = () => {
  const { pickList } = usePickStore();
  return (
    <div>
      {pickList.map((p, id) => (
        <p key={id} style={{ width: "200px", height: "300px" }}>
          <img src={`${p.main_img}`} alt="" />
        </p>
      ))}
    </div>
  );
};

export default UserPickList;
