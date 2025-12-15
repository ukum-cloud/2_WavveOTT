import { Link, useNavigate, useParams } from "react-router-dom"
import { noticeData } from "../data/notice";
import './scss/NoticeA.scss'

const NoticeAdetail = () => {
    const { noticeId } = useParams<{ noticeId: string }>();
    const navigate = useNavigate();
    const notice = noticeData.find((e) => e.id === Number(noticeId));

    const currentIndex = noticeData.findIndex(
        (item) => item.id === Number(noticeId)
    );

    const prevNotice = noticeData[currentIndex - 1] || null;
    const nextNotice = noticeData[currentIndex + 1] || null;

    if (!notice) {
        return (
            <section>
                <h2>오류</h2>
                <p>존재하지 않는 공지사항입니다.</p>
                <button onClick={() => navigate("/notice")}>
                    ← 목록으로 돌아가기
                </button>
            </section>
        );
    }

    // content를 줄바꿈 기준으로 분할하고 <br />로 연결하는 함수
    const formatContent = (text: string) => {
        // '/n' 문자열을 기준으로 텍스트를 분할.
        // map 함수를 사용하여 각 줄을 렌더링하고, 줄 사이에 <br />를 삽입.
        return text.split('/n').map((line, index) => (
            <span key={index}>
                {line}
                {/* 마지막 줄이 아닌 경우에만 <br />을 추가하여 줄바꿈을 적용. */}
                {index < text.split('/n').length - 1 && <br />}
            </span>
        ));
    };

    return (
        <>
            <table className="notice-detail">
                <colgroup>
                    <col width="200" />
                    <col width="*" />
                    <col width="200" />
                </colgroup>
                <thead>
                    <tr>
                        <th scope="col" className="font-wave">구분</th>
                        <th scope="col">제목</th>
                        <th scope="col">등록일</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="font-wave">{notice.division}</td>
                        <td>{notice.title}</td>
                        <td>{notice.date}</td>
                    </tr>
                </tbody>
            </table>
            <div className="list-content">
                {formatContent(notice.content)}
            </div>
            <table className="other-page">
                <colgroup>
                    <col width='105' />
                    <col width='*' />
                    <col width='105' />
                    <col width='105' />
                    <col width='*' />
                    <col width='105' />
                </colgroup>
                <tbody>
                    <tr>
                        <th scope="row"> 이전글</th>
                        <td>
                            <span>
                                {prevNotice ? (
                                    <Link to={`/service-center/notice/${prevNotice.id}`}>
                                        {prevNotice.title}
                                    </Link>
                                ) : (
                                    '이전 페이지가 없습니다'
                                )}
                            </span>
                        </td>
                        <td>2025-12-12</td>
                        <th scope="row">다음</th>
                        <td>
                            <span>
                                {nextNotice ? (
                                    <Link to={`/service-center/notice/${nextNotice.id}`}>
                                        {nextNotice.title}
                                    </Link>
                                ) : (
                                    '다음 페이지가 없습니다'
                                )}
                            </span>
                        </td>
                        <td>2025-12-12</td>
                    </tr>
                </tbody>
            </table>
            <div className="list-button">
                <Link style={{width:'240px'}} className="btn primary large" to="/service-center">목록 페이지</Link>
            </div>
        </>
    )
}

export default NoticeAdetail

