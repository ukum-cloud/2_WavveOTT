import './scss/UserQnaDetail.scss';

const UserQnaDetail = () => {
    const handlebtn = () => {
        alert('1:1 문의 내역은 준비중입니다.');
    };
    return (
        <div className="detail-menu-content qna-menu">
            <div className="qna-title-wrap">
                <div className="title-top">
                    <h2>
                        <p>Wavve 서비스 이용 시</p>
                        <p>불편사항이나 문의사항이 있으신가요?</p>
                    </h2>
                    <p>비회원일 경우 이름, 이메일, 질문유형이 정확한지 다시 한번 확인해주세요!</p>
                </div>

                <div className="title-bottom">* 항목은 필수 입력 항목입니다.</div>
            </div>
            <form>
                <div className="input-top">
                    <label className="input-text">
                        <p className="label-text">이름</p>
                        <input
                            type="text"
                            placeholder="이름을 입력해 주세요. (특수문자 입력 불가)"
                        />
                    </label>

                    <div className="input-text-group email">
                        <div className="input-text">
                            <p className="label-text">이메일</p>
                            <input type="email" placeholder="이메일을 입력하세요" />
                        </div>
                        <p className="text-info">
                            위 이메일로 답변을 드리기 때문에, 정확히 입력해 주시길 바랍니다.
                        </p>
                    </div>
                </div>

                <div className="input-bottom">
                    <label className="input-text">
                        <p className="label-text">연락처</p>
                        <input type="text" placeholder="연락처를 입력해주세요." />
                    </label>
                    <label className="input-text">
                        <p className="label-text">질문구분</p>
                        <input type="text" placeholder="선택해주세요." />
                    </label>
                </div>

                <div className="service-checkbox">
                    <p className="label-text">서비스구분</p>
                    <ul className="check-box">
                        <li>
                            <label className="checkbox">
                                <input type="checkbox" readOnly />
                                Live
                            </label>
                        </li>
                        <li>
                            <label className="checkbox">
                                <input type="checkbox" readOnly />
                                VOD
                            </label>
                        </li>
                        <li>
                            <label className="checkbox">
                                <input type="checkbox" readOnly />
                                영화
                            </label>
                        </li>
                        <li>
                            <label className="checkbox">
                                <input type="checkbox" readOnly />
                                타임머신
                            </label>
                        </li>
                        <li>
                            <label className="checkbox">
                                <input type="checkbox" readOnly />
                                다운로드
                            </label>
                        </li>
                        <li>
                            <label className="checkbox">
                                <input type="checkbox" readOnly />
                                기타
                            </label>
                        </li>
                    </ul>
                </div>
                <div className="program-info">
                    <p className="label-text">프로그램 정보</p>
                    <textarea
                        className="main-content middle"
                        placeholder="회차, 방송일, 시간 등 입력해주세요.&#10;예) 11월 1일 시상식 온 오전 10시경, 무한도전 12월 4일 416회 등"
                    />
                </div>

                <div className="device-section">
                    <p className="label-text">사용환경 (디바이스)</p>
                    <ul className="check-box">
                        <li>
                            <label className="checkbox">
                                <input type="checkbox" readOnly />
                                PC web
                            </label>
                        </li>
                        <li>
                            <label className="checkbox">
                                <input type="checkbox" readOnly />
                                안드로이드 폰
                            </label>
                        </li>
                        <li>
                            <label className="checkbox">
                                <input type="checkbox" readOnly />
                                아이폰
                            </label>
                        </li>
                        <li>
                            <label className="checkbox">
                                <input type="checkbox" readOnly />
                                안드로이드 태블릿
                            </label>
                        </li>
                        <li>
                            <label className="checkbox">
                                <input type="checkbox" readOnly />
                                아이패드
                            </label>
                        </li>
                        <li>
                            <label className="checkbox">
                                <input type="checkbox" readOnly />
                                스마트TV
                            </label>
                        </li>
                        <li>
                            <label className="checkbox">
                                <input type="checkbox" readOnly />
                                기타
                            </label>
                        </li>
                    </ul>
                </div>

                <div className="os-info">
                    <p className="label-text">사용환경 (OS, 브라우저)</p>
                    <input
                        type="text"
                        placeholder="예) 윈도우7 IE 8, 안드로이드 4.2.2, iOS 9.1등"
                    />
                </div>

                <div className="content-section">
                    <p className="label-text">문의하기</p>
                    <input type="text" placeholder="문의 제목을 입력해주세요." />
                    <textarea
                        className="main-content large"
                        placeholder="문의 내용을 입력해 주세요. 욕설·비속어가 포함된 게시글의 경우 담변을 제한할 수 있습니다."
                    />
                </div>

                <div className="privacy-section">
                    <p className="privacy-title">개인정보 수집 이용에 대한 동의</p>
                    <div className="privacy-content">
                        <p>
                            수집 항목 : 이름(실명), 이메일주소, 연락처(휴대폰호 등), [문의 처리 시]
                            계정정보(ID명, 계정명, 가입유형)
                        </p>
                        <p>수집 목적 : 서비스 이용에 관한 문의 및 제안 처리 및 결과 회신</p>
                        <p>
                            보유 및 이용 기간 : 문의자의 문의 접수일 보관, 답 변일 사전 시 3년
                            보관(상사서기안보존 기준 제외)
                        </p>
                        <p>
                            ※ 개인정보 수집 및 이용에 동의를 거부할 권리가 있으나, 문의 응답을
                            거부하는 경우에는 서비스 제공이 불가합니다. 그 외의 서비스는 개인정보
                            처리방침에 준수합니다.
                        </p>
                    </div>
                    <label className="privacy-agree">
                        <input type="checkbox" readOnly />
                        개인정보 수집 및 이용에 대해 동의합니다.
                    </label>
                </div>

                <div className="button-group">
                    <button type="button" className="btn-cancel" onClick={handlebtn}>
                        취소
                    </button>
                    <button type="submit" className="btn-submit" onClick={handlebtn}>
                        문의 등록
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserQnaDetail;
