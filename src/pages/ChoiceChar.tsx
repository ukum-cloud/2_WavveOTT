import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { getProfileNickname } from "../firebase/firebase"; // 아까 추가한 함수 불러오기
import "./scss/ChoiceChar.scss";

interface Character {
  id: number;
  nickname: string;
  imageUrl: string;
}

const defaultCharacters: Character[] = [
  { id: 1, nickname: "배추", imageUrl: "/images/icons/icon-char-1.svg" },
  { id: 2, nickname: "딸기라떼", imageUrl: "/images/icons/icon-char-2.svg" },
  { id: 3, nickname: "에스프레소", imageUrl: "/images/icons/icon-char-3.svg" },
  { id: 4, nickname: "키즈", imageUrl: "/images/icons/icon-char-4.svg" },
];

const ChoiceChar = () => {
  const navigate = useNavigate();
  const { user, selectChar, selectedCharId } = useAuthStore();

  // DB에서 불러온 실제 캐릭터 리스트를 관리할 상태
  const [displayCharacters, setDisplayCharacters] =
    useState<Character[]>(defaultCharacters);

  // 1. 컴포넌트 로드 시 Firebase에서 각 프로필의 닉네임을 불러옴
  useEffect(() => {
    const fetchNicknames = async () => {
      if (!user) return;

      const updatedChars = await Promise.all(
        defaultCharacters.map(async (char) => {
          // Firebase에서 해당 캐릭터의 저장된 닉네임 조회
          const savedNickname = await getProfileNickname(user.uid, char.id);
          return {
            ...char,
            nickname: savedNickname || char.nickname, // 저장된 게 있으면 그것 사용, 없으면 기본값
          };
        })
      );
      setDisplayCharacters(updatedChars);
    };

    fetchNicknames();
  }, [user]);

  const handleCharSelect = (char: Character) => {
    // 선택한 캐릭터의 현재 닉네임(DB에서 가져온 값)을 스토어에 저장
    selectChar(char.id, char.nickname);

    if (char.id === 4) {
      navigate("/kids");
    } else {
      navigate("/home");
    }
  };

  return (
    <main className="choice-char-wrap">
      <div className="inner">
        <section className="choice-char">
          <div>
            <h2>프로필 선택</h2>
            <p>시청하실 프로필을 선택해주세요.</p>
          </div>

          <ul>
            {displayCharacters.map((c) => (
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
