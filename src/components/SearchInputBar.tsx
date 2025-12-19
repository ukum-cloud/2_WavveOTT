import React from "react";
import "./scss/SearchInputBar.scss";

interface Props {
  value: string;
  onChange: (next: string) => void;
  onSubmit: (e: React.FormEvent) => void;

  inputRef: React.RefObject<HTMLInputElement | null>;
  onMoveToList: (index: number) => void;
  hasList: boolean;

  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  activeDescendantId?: string;
  activeIndex: number;
}

const SearchInputBar = ({
  value,
  onChange,
  onSubmit,
  inputRef,
  onMoveToList,
  hasList,
  onKeyDown,
  activeDescendantId,
  activeIndex,
}: Props) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (hasList) {
      const notInListYet = activeIndex < 0;
      // input에서 리스트로 "넘어가기"

      // 리스트에 "아직 진입 전"일 때만 0번/마지막으로 보내기
      if (notInListYet) {
        if (e.key === "Tab" || e.key === "ArrowDown") {
          e.preventDefault();
          onMoveToList(0);
          return;
        }

        if (e.key === "ArrowUp") {
          e.preventDefault();
          onMoveToList(9999); // 부모에서 clamp 해서 마지막으로
          return;
        }
      }
    }

    // 그 외 키(Enter 포함)는 부모가 처리하도록 전달
    onKeyDown(e);
  };

  return (
    <form className="keyboard-top" name="search" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="장르, 제목, 배우로 검색해보세요."
        className="font-wave keyboard-input"
        id="search"
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={hasList}
        aria-controls="search-left-listbox"
        aria-activedescendant={activeDescendantId}
        aria-autocomplete="list"
      />
      <button type="submit" className="img-box" aria-label="검색">
        <img src="/images/icons/icon-search.svg" alt="검색" />
      </button>
    </form>
  );
};

export default SearchInputBar;
