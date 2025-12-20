import React, { useEffect, useRef, useState } from 'react';
import { chatbotData } from '../data/chatbotData';
import './scss/Chatbot.scss';
import Modal from './Modal';

interface ChatbotProps {
    onClose: () => void;
}

interface Message {
    id: number;
    type: 'bot' | 'user';
    text: string;
    time: string;
}

const getNowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
    // const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [modalSize, setModalSize] = useState<'xsmall' | 'small' | 'default' | 'large'>('default');
    const nextId = useRef(2);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            type: 'bot',
            text: chatbotData['main'].botMessage,
            time: getNowTime(),
        },
    ]);

    // 닫기 버튼 클릭하면 모달팝업뜨기
    const handleExitClick = () => {
        setIsModalOpen(true); // 바로 닫지 않고 모달을 먼저 엶
    };

    // 모달에서 '확인(종료)'을 눌렀을 때 닫기
    const handleConfirmExit = () => {
        setIsModalOpen(false);
        onClose(); // 종료 실행
    };

    // 모달실행시 스크롤바 유지
    useEffect(() => {
        if (isModalOpen) {
            // 모달이 켜지면서 Modal.tsx가 body를 hidden으로 바꾼 직후,
            // 다시 강제로 unset으로 되돌려 스크롤바를 유지시킵니다.
            document.body.style.overflow = 'unset';
        }
    }, [isModalOpen]);

    const [currentButtons, setCurrentButtons] = useState<string[]>(chatbotData['main'].buttons);

    // 1. 버튼기록저장 (기본값은 'main')
    const [history, setHistory] = useState<string[]>(['main']);

    // 인풋
    const [inputValue, setInputValue] = useState('');

    const scrollRef = useRef<HTMLDivElement>(null);

    // 스크롤 아래로 자동 이동
    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // 챗봇검색하기
    const findAnswerKey = (input: string) => {
        return Object.keys(chatbotData).find((key) => key.includes(input.trim()));
    };

    // --- 2. 질문 전송 함수 ---
    const handleSendMessage = () => {
        if (inputValue.trim() === '') return; // 빈 메시지 방지
        const currentTime = getNowTime();

        // 사용자 메시지 객체
        const userMsg: Message = {
            id: nextId.current++,
            type: 'user',
            text: inputValue,
            time: currentTime,
        };

        const matchedKey = findAnswerKey(inputValue);

        // 상담사 연결 봇 응답 객체
        const botMsg: Message = {
            id: nextId.current++,
            type: 'bot',
            text: matchedKey
                ? chatbotData[matchedKey].botMessage
                : '해당 내용을 찾지 못했어요. 아래 메뉴를 선택해 주세요.',
            time: currentTime,
        };

        // 메시지 리스트 업데이트 및 입력창 초기화
        setMessages((prev) => [...prev, userMsg, botMsg]);
        if (matchedKey) {
            setCurrentButtons(chatbotData[matchedKey].buttons);
        }

        setInputValue('');

        // (옵션) 직접 입력 시 버튼을 초기화하거나 특정 상태로 변경하고 싶다면 추가
        // setCurrentButtons(chatbotData['main'].buttons);
    };

    // 리셋함수
    const handleResetChat = () => {
        nextId.current = 2;

        setMessages([
            {
                id: 1,
                type: 'bot',
                text: chatbotData['main'].botMessage,
                time: getNowTime(),
            },
        ]);

        setCurrentButtons(chatbotData['main'].buttons);
        setHistory(['main']);
        setInputValue('');
    };

    const handleButtonClick = (selection: string) => {
        const currentTime = getNowTime();
        // 1. 사용자 질문 추가
        const userMsg: Message = {
            id: nextId.current++,
            type: 'user',
            text: selection,
            time: currentTime,
        };

        // 2. 데이터 매칭 및 봇 응답 생성
        let nextStepKey = selection;
        if (selection === '처음으로') {
            nextStepKey = 'main';
            setHistory(['main']); // 기록 초기화
        } else if (selection === '전 단계로 가기') {
            if (history.length > 1) {
                const newHistory = [...history];
                newHistory.pop(); // 현재 단계를 제거
                const previousKey = newHistory[newHistory.length - 1]; // 이전 단계 키 추출

                nextStepKey = previousKey;
                setHistory(newHistory); // 기록 업데이트
            } else {
                nextStepKey = 'main';
            }
        } else {
            // 일반적인 단계 이동 시 기록에 현재 단계 추가
            // (이미 데이터가 존재하는 경우에만 기록)
            if (chatbotData[selection]) {
                setHistory((prev) => [...prev, selection]);
            }
        }

        const nextData = chatbotData[nextStepKey];

        if (nextData) {
            const botMsg: Message = {
                id: nextId.current++,
                type: 'bot',
                text: nextData.botMessage,
                time: currentTime,
            };
            setMessages((prev) => [...prev, userMsg, botMsg]);
            setCurrentButtons(nextData.buttons);
        } else {
            // 상세 데이터가 없는 경우 기본 응답
            const botMsg: Message = {
                id: nextId.current++,
                type: 'bot',
                text: '준비 중인 서비스입니다. 고객센터(1599-3709)로 문의해 주세요.',
                time: currentTime,
            };
            setMessages((prev) => [...prev, userMsg, botMsg]);
            setCurrentButtons(chatbotData['main'].buttons);
        }
    };

    return (
        <div className="chatbot-wrapper">
            <div className="chat-container">
                <div className="chat-header">
                    <div className="logochat">
                        <span className="logo">
                            <img src="/images/icons/icon-wavve-logo.svg" alt="웨이브로고" />
                        </span>
                        <span className="chat-icon">
                            <img src="/images/icons/icon-chat.svg" alt="채팅아이콘" />
                        </span>
                    </div>
                    <div className="actions">
                        <button onClick={handleResetChat}>
                            <img src="/images/icons/icon-reset.svg" alt="새로고침" />
                        </button>
                        <button onClick={handleExitClick}>
                            <img src="/images/icons/icon-close.svg" alt="닫기버튼" />
                        </button>
                    </div>
                </div>
                <div className="chat-content" ref={scrollRef}>
                    <div className="bot-message">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`${msg.type}-message-row`}>
                                {/* 챗봇일 때만 프로필 뜨기 */}
                                {msg.type === 'bot' && (
                                    <div className="profile">
                                        <img src="/images/icons/icon-chatbot.png" alt="프로필" />
                                    </div>
                                )}
                                <div className="message-item">
                                    {msg.type === 'bot' && <div className="wav-center">Wavve</div>}
                                    <div className="bubble-group">
                                        <div className="bubble">
                                            {/* \n을 <br />로 바꾸기 */}
                                            {msg.text.split('\n').map((line, i) => (
                                                <span key={i}>
                                                    {line}
                                                    <br />
                                                </span>
                                            ))}
                                        </div>
                                        <div className="bubble-time">{msg.time}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* 버튼 그룹 */}
                    <div className="button-group">
                        {currentButtons.map((btn) => (
                            <button
                                key={btn}
                                className="menu-btn"
                                onClick={() => handleButtonClick(btn)}
                            >
                                {btn}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="chatFooter">
                    <div className="input-wrapper">
                        <input
                            type="text"
                            placeholder="메시지를 입력해주세요"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSendMessage();
                            }}
                        />
                        <button className="send-btn" onClick={handleSendMessage}>
                            <span>↑</span>
                        </button>
                    </div>
                </div>
                {/* 모달팝업 */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="small">
                    {/* 모달 내부 콘텐츠: Header, Body, Footer를 직접 구성 */}
                    <div className="modal-header">
                        <h3 className="modal-title"></h3>
                    </div>
                    <div className="modal-content">
                        <p>채팅을 종료하시겠습니까?</p>
                    </div>
                    <div className="modal-footer">
                        <button
                            className="btn small secondary-line"
                            onClick={() => setIsModalOpen(false)}
                        >
                            취소
                        </button>
                        <button className="btn small primary" onClick={handleConfirmExit}>
                            닫기
                        </button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Chatbot;
