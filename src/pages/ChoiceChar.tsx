import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { getProfileNickname } from "../firebase/firebase";
import LoadingBar from "../components/LoadingBar";
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

const MIN_LOADING_TIME = 300;   // 깜빡임 방지
const MAX_LOADING_TIME = 1200;  // 체감 개선 핵심

const ChoiceChar = () => {
  const navigate = useNavigate();
  const { user, selectChar, selectedCharId } = useAuthStore();

  const [displayCharacters, setDisplayCharacters] =
    useState<Character[]>(defaultCharacters);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    let mounted = true;
    const startTime = Date.now();

    const fetchNicknames = async () => {
      try {
        const updated = await Promise.all(
          defaultCharacters.map(async (char) => {
            const nickname = await getProfileNickname(user.uid, char.id);
            return {
              ...char,
              nickname: nickname || char.nickname,
            };
          })
        );

        if (!mounted) return;

        setDisplayCharacters(updated);
      } catch (e) {
        console.error("닉네임 조회 에러:", e);
      } finally {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(
          MIN_LOADING_TIME - elapsed,
          0
        );

        // 최소 로딩 시간 보장
        setTimeout(() => {
          if (mounted) setIsLoading(false);
        }, remaining);
      }
    };

    fetchNicknames();

    // 최대 로딩 시간 제한 (핵심)
    const forceEnd = setTimeout(() => {
      if (mounted) setIsLoading(false);
    }, MAX_LOADING_TIME);

    return () => {
      mounted = false;
      clearTimeout(forceEnd);
    };
  }, [user]);

  const handleCharSelect = useCallback(
    (char: Character) => {
      if (isNavigating) return;

      setIsNavigating(true);
      selectChar(char.id, char.nickname);

      const targetPath = char.id === 4 ? "/kids" : "/home";
      navigate(targetPath);
    },
    [isNavigating, navigate, selectChar]
  );

  if (isLoading) return <LoadingBar />;

  return (
    <main className="choice-char-wrap">
      {isNavigating && <LoadingBar />}

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
