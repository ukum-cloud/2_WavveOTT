import './scss/Modal.scss';
import React, { useEffect, useCallback } from 'react';
import type { ModalProps} from '../types/etc';

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, size = 'default', children }) => {
    // 오버레이 클릭 핸들러
    const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        // 클릭된 요소가 오버레이 자체인지 확인하여 모달 닫기
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    // ESC 키 핸들러
    const handleKeydown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    // side effect (마운트 시 이벤트 리스너 등록 및 클린업)
    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeydown);
            // 모달이 열리면 본문 스크롤 방지
            document.body.style.overflow = 'hidden';
        } else {
            // 모달이 닫히면 본문 스크롤 허용
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleKeydown);
            // 컴포넌트 언마운트 시 또는 isOpen 변경 시 클린업
            if (!isOpen) {
                document.body.style.overflow = 'unset';
            }
        };
    }, [isOpen, handleKeydown]);

    if (!isOpen) {
        return null;
    }

    // 크기에 따른 CSS 클래스 결정
    const sizeClass = `modal-container--${size}`;

    return (
        // 오버레이
        <div className="modal-overlay" onClick={handleOverlayClick}>
            {/* 모달 컨테이너 (크기 클래스 적용) */}
            <div className={`modal-container ${sizeClass}`} role="dialog" aria-modal="true">
                {children}
            </div>
        </div>
    );
};

export default Modal;