import React, { useState, useRef, useEffect } from 'react';
import type { CustomSelectProps, SelectOption } from '../types/etc'; 
import './scss/CustomSelect.scss';

const CustomSelect: React.FC<CustomSelectProps> = ({
  options, 
  selectedValue,
  onSelect,
  label = '', 
  width = 'max-content', 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  
  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  // onSelect(path, label) 호출
  const handleSelect = (option: SelectOption) => {
    onSelect(option.path, option.label);
    setIsOpen(false);
  };

  // 외부 클릭 감지 로직
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // width 값을 CSS 형식으로 변환하는 함수
  const getWidthStyle = () => {
    if (typeof width === 'string' && /^\d+$/.test(width)) {
      return `${width}px`;
    }
    return width;
  };

  return (
    <div 
        className="ui-select" 
        ref={selectRef}
        style={{ width: getWidthStyle() }}
    >
      
      <p 
        className="ui-select-header" 
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        role="button"
        tabIndex={0}
      >
        {selectedValue || label}
      </p>

      {isOpen && (
        <ul className='ui-select-options' role="listbox">
          {options.map((option) => (
            <li
              key={option.label}
              className={`ui-select-option ${option.label === selectedValue ? 'selected' : ''}`}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={option.label === selectedValue}
              tabIndex={0}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;

