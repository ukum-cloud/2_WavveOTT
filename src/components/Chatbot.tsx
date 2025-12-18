import React, { useRef, useState } from 'react';
import { chatbotData } from '../data/chatbotData';
import './scss/Chatbot.scss';

interface ChatbotProps {
    onClose: () => void; // 부모로부터 받을 함수 타입 정의
}
const getNowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
    // const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: chatbotData['main'].botMessage, time: getNowTime() },
    ]);
    const [currentButtons, setCurrentButtons] = useState<string[]>(chatbotData['main'].buttons);

    // 1. 히스토리를 관리할 상태 추가 (기본값은 'main')
    const [history, setHistory] = useState<string[]>(['main']);

    const scrollRef = useRef<HTMLDivElement>(null);
    // 스크롤 자동 하단 이동 로직 (추가하면 좋습니다)
    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleButtonClick = (selection: string) => {
        const currentTime = getNowTime();
        // 1. 사용자 질문 추가
        const userMsg = { id: Date.now(), type: 'user', text: selection, time: currentTime };

        // 2. 데이터 매칭 및 봇 응답 생성
        let nextStepKey = selection;
        if (selection === '처음으로') {
            nextStepKey = 'main';
            setHistory(['main']); // 히스토리 초기화
        } else if (selection === '전 단계로 가기') {
            if (history.length > 1) {
                const newHistory = [...history];
                newHistory.pop(); // 현재 단계를 제거
                const previousKey = newHistory[newHistory.length - 1]; // 이전 단계 키 추출

                nextStepKey = previousKey;
                setHistory(newHistory); // 히스토리 업데이트
            } else {
                nextStepKey = 'main';
            }
        } else {
            // 일반적인 단계 이동 시 히스토리에 현재 단계 추가
            // (이미 데이터가 존재하는 경우에만 기록)
            if (chatbotData[selection]) {
                setHistory((prev) => [...prev, selection]);
            }
        }

        const nextData = chatbotData[nextStepKey];

        if (nextData) {
            const botMsg = {
                id: Date.now() + 1,
                type: 'bot',
                text: nextData.botMessage,
                time: currentTime,
            };
            setMessages((prev) => [...prev, userMsg, botMsg]);
            setCurrentButtons(nextData.buttons);
        } else {
            // 상세 데이터가 없는 경우 기본 응답
            const botMsg = {
                id: Date.now() + 1,
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
                        <button onClick={() => window.location.reload()}>
                            <img src="/images/icons/icon-reset.svg" alt="새로고침" />
                        </button>
                        {/* 여기서 부모가 넘겨준 onClose 함수를 실행합니다 */}
                        <button onClick={onClose}>
                            <img src="/images/icons/icon-close.svg" alt="닫기버튼" />
                        </button>
                    </div>
                </div>
                <div className="chat-content" ref={scrollRef}>
                    <div className="bot-message">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`${msg.type}-message-row`}>
                                {/* 챗봇일 때만 프로필 노출 */}
                                {msg.type === 'bot' && (
                                    <div className="profile">
                                        <img src="/images/icons/icon-chatbot.png" alt="프로필" />
                                    </div>
                                )}
                                <div className="message-item">
                                    {msg.type === 'bot' && <div className="wav-center">Wavve</div>}
                                    <div className="bubble-group">
                                        <div className="bubble">
                                            {/* \n을 <br />로 바꾸어 출력 */}
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
                                {/* <div className="message">
                                    <div className="wav-center">Wavve</div>
                                    <div className="bubble">
                                        <div className="bubble-content">
                                            안녕하세요 😊 웨이브 고객센터입니다.
                                            <br />
                                            원활한 상담을 위해 고객님의 개인정보는 문의 처리 및
                                            서비스 제공에 활용됩니다. 자세한 내용은 개인정보
                                            처리방침을 참고해 주세요.
                                            <br /> 채팅 상담 가능 시간은 매일 오전 9:30부터 오후
                                            6:30까지 입니다.
                                        </div>
                                        <div className="bubble-time">{currentTime}</div>
                                    </div>
                                </div> */}
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
                    {/* <div className="button-group">
                        {menuItems.map((item) => (
                            <button
                                key={item}
                                className={`menu-btn ${selectedMenu === item ? 'active' : ''}`}
                                onClick={() => setSelectedMenu(item)}
                            >
                                {item}
                            </button>
                        ))}
                    </div> */}
                </div>
                <div className="chatFooter">
                    <div className="input-wrapper">
                        <input type="text" placeholder="메시지를 입력해주세요" />
                        <button className="send-btn">
                            {/* 텍스트(↑)를 쓰시거나 이미지를 넣으시면 됩니다 */}
                            <span>↑</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
