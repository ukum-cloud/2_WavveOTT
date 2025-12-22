import { useState } from "react";
import CustomSelect from "../components/CustomSelect";
import type { SelectOption } from "../types/etc";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import type { ModalSize } from "../types/etc";
import "./scss/Common.scss";

// 셀렉트 컴포넌트 레이블과 링크값
const linkOptions: SelectOption[] = [
  { label: "패스 데이터 없을 때", path: "" },
  { label: "공지사항", path: "/service-center" },
  { label: "1:1 문의하기", path: "/service-center/userQna" },
  { label: "이용약관", path: "/service-center/agreement" },
  { label: "스크롤 경우 까지 포함", path: "" },
  { label: "리스트 너비와 같은", path: "" },
  { label: "값으로 콤포넌트에", path: "" },
  { label: "입력해 주세요", path: "" },
];

const Common = () => {
  // --------셀렉트 컴포넌트를 위한 내용--------------------
  const navigate = useNavigate();
  // CustomSelect가 '선택'이라는 기본 레이블을 표시하도록 초기 상태를 빈 문자열로 설정합니다.
  const [currentLabel, setCurrentLabel] = useState("");

  // path와 selectedLabel을 인수로 받기
  const handleSelectionAndNavigation = (path: string, selectedLabel: string) => {
    // 전달받은 label을 바로 설정하여
    setCurrentLabel(selectedLabel);

    // 페이지 이동 처리
    if (path && path !== "??") {
      navigate(path);
    } else {
      console.log(`[라우팅] 경로 이동 생략: 유효하지 않은 path (${path})`);
    }
  };
  // ------// 셀렉트 컴포넌트를 위한 내용-------------------

  // ------------------- 모달을 위한 상태 -------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState<ModalSize>("default");

  // 모달 열기 핸들러
  const handleOpenModal = (size: ModalSize) => {
    setModalSize(size);
    setIsModalOpen(true);
  };

  // 모달 닫기 핸들러 (Modal 컴포넌트의 props로 전달됨)
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  // ------------------- // 모달을 위한 상태 -------------------

  return (
    <main style={{ paddingTop: "90px" }}>
      <div className="">100%</div>
      <div className="inner" style={{ gap: "40px" }}>
        <h2>badge</h2>
        <div style={{ padding: "20px", backgroundColor: "grey" }}>
          <span className="badge-text-type">추천</span>
        </div>
        <h2>button</h2>
        <ul className="common-btn-list">
          <li>
            <button className="btn xsmall primary">btn xsmall primary</button>
            <button className="btn xsmall secondary">btn xsmall secondary</button>
            <button className="btn xsmall secondary-line">btn xsmall secondary-line</button>
            <button className="btn xsmall secondary" disabled>
              btn xsmall disabled
            </button>
          </li>
          <li>
            <button className="btn small primary">btn small primary</button>
            <button className="btn small secondary">btn small secondary</button>
            <button className="btn small secondary-line">btn small secondary-line</button>
            <button className="btn small secondary" disabled>
              btn small disabled
            </button>
          </li>
          <li>
            <button className="btn default primary">btn default primary</button>
            <button className="btn default secondary">btn default secondary</button>
            <button className="btn default secondary-line">btn default secondary-line</button>
            <button className="btn default secondary" disabled>
              btn default disabled
            </button>
          </li>
          <li>
            <button className="btn large primary">btn large primary</button>
            <button className="btn large secondary">btn large secondary</button>
            <button className="btn large secondary-line">btn large secondary-line</button>
            <button className="btn large disabled" disabled>
              btn large disabled
            </button>
          </li>
        </ul>
        <h2>input</h2>
        <ul className="common-btn-list">
          <li>
            <input type="text" value="" placeholder="SAMPLE" readOnly />
            <input type="text" disabled value="SAMPLE" readOnly />
          </li>
          <li>
            <input type="checkbox" readOnly />
            <input type="checkbox" checked readOnly />
          </li>
          <li>
            <input type="radio" name="a" readOnly />
            <input type="radio" name="a" checked readOnly />
          </li>
          <li>
            {/* 셀렉트를 위한 컴포넌트 */}
            <CustomSelect
              options={linkOptions}
              selectedValue={currentLabel}
              onSelect={handleSelectionAndNavigation}
              label="선택하세요"
              width="205" // 리스트의 너비를 넣어주세요
            />
          </li>
        </ul>
        <h2>modal popup</h2>
        <ul>
          <li style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            {/* -------- 모달 테스트 버튼 --------- */}
            <button className="btn small secondary" onClick={() => handleOpenModal("xsmall")}>
              XSmall 모달 열기
            </button>
            <button className="btn small secondary" onClick={() => handleOpenModal("small")}>
              Small 모달 열기
            </button>
            <button className="btn default secondary" onClick={() => handleOpenModal("default")}>
              Default 모달 열기
            </button>
            <button className="btn default secondary" onClick={() => handleOpenModal("large")}>
              Large 모달 열기
            </button>
            {/* ----- // 모달 테스트 버튼------ */}
          </li>
        </ul>
        <section>
          <h2>제목입니다</h2>
          <div>내용</div>
        </section>
      </div>
      {/* ------------- 모달 컴포넌트 통합 --------- */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size={modalSize}>
        {/* 모달 내부 콘텐츠: Header, Body, Footer를 직접 구성 */}
        <div className="modal-header">
          <h3 className="modal-title">모달 제목</h3>
          {/* 닫기 버튼은 onCLose 핸들러를 호출 */}
          <button className="close-button" onClick={handleCloseModal}>
            <span>닫기</span>
          </button>
        </div>
        <div className="modal-content">
          <p>현재 모달 크기는 **{modalSize}** 입니다.</p>
          <p>이 모달은 부모 컴포넌트의 상태로 크기가 동적으로 변경됩니다.</p>
        </div>
        <div className="modal-footer">
          <button className="btn small primary">확인 </button>
          <button className="btn small secondary-line" onClick={handleCloseModal}>
            닫기
          </button>
        </div>
      </Modal>
      {/* ----------- // 모달 컴포넌트 통합 ----- */}
    </main>
  );
};

export default Common;
