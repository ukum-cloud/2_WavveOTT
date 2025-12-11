// ChoiceChar.tsx
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import "./scss/ChoiceChar.scss";

interface Character {
  id: number;
  nickname: string;
  imageUrl: string;
}

const characters: Character[] = [
  { id: 1, nickname: "배추", imageUrl: "/images/icons/icon-char-1.svg" },
  { id: 2, nickname: "딸기라떼", imageUrl: "/images/icons/icon-char-2.svg" },
  { id: 3, nickname: "에스프레소", imageUrl: "/images/icons/icon-char-3.svg" },
  { id: 4, nickname: "키즈", imageUrl: "/images/icons/icon-char-4.svg" },
];

const ChoiceChar = () => {
  const navigate = useNavigate();
  // 스토어에서 캐릭터 선택 액션 및 현재 선택된 캐릭터 ID 가져오기
  const { selectChar, selectedCharId } = useAuthStore();

  // 캐릭터 선택 및 상태 저장 핸들러
  const handleCharSelect = (char: Character) => {
    // 선택된 캐릭터 정보를 전역 상태에 저장
    selectChar(char.id, char.nickname);

    // 키즈 캐릭터(ID: 4)를 선택한 경우 /kids 페이지로 이동
    if (char.id === 4) {
      navigate("/kids");
    } else {
      navigate("/");
    }
  };

  return (
    <main>
      <div className="inner">
        <section className="choice-char">
          <div>
            <h2>프로필 선택</h2>
            <p>시청하실 프로필을 선택해주세요.</p>
          </div>

          <ul>
            {characters.map((c) => (
              <li
                key={c.id}
                className={selectedCharId === c.id ? "active" : ""}
                onClick={() => handleCharSelect(c)}
              >
                <p className="img">
                  <img src={c.imageUrl} alt={c.nickname} />
                </p>
                <p className="text">{c.nickname}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
};

export default ChoiceChar;
