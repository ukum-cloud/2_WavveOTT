// import { useNavigate } from 'react-router-dom';
// import './scss/UserQna.scss';

const qnaData = [
    {
        id: 1,
        status: '답변대기',
        title: '결제 내역 관련 문의드립니다',
        date: '2025-12-02',
    },
    {
        id: 2,
        status: '답변완료',
        title: '이용권 해지 방법 문의',
        date: '2025-12-02',
    },
    {
        id: 3,
        status: '답변완료',
        title: '로그인 오류로 인한 접속 불가',
        date: '2025-12-02',
    },
    {
        id: 4,
        status: '답변완료',
        title: '콘텐츠 재생 오류 문의',
        date: '2025-12-02',
    },
    {
        id: 5,
        status: '답변완료',
        title: '결 목록이 사라졌습니다',
        date: '2025-12-02',
    },
    {
        id: 6,
        status: '답변완료',
        title: '자막 및 음성 설정 오류 문의',
        date: '2025-12-02',
    },
    {
        id: 7,
        status: '답변완료',
        title: '환불 처리 진행 상황 문의',
        date: '2025-12-02',
    },
    {
        id: 8,
        status: '답변완료',
        title: '서비스 이용 중 오류 발생',
        date: '2025-12-02',
    },
    {
        id: 9,
        status: '답변완료',
        title: '자동 결제 해지 요청',
        date: '2025-12-02',
    },
];

type QnaType = {
    id: number;
    status: string;
    title: string;
    date: string;
};

const UserQnaList = () => {
    // const navigate = useNavigate();

    return (
        <>
            <table className="notice-list">
                <colgroup>
                    <col width="200" />
                    <col width="*" />
                    <col width="200" />
                </colgroup>
                <thead>
                    <tr>
                        <th scope="col" className="font-wave">
                            구분
                        </th>
                        <th scope="col">제목</th>
                        <th scope="col">등록일</th>
                    </tr>
                </thead>
                <tbody>
                    {qnaData.map((e: QnaType) => (
                        // <tr key={e.id} onClick={() => navigate(`qna/${e.id}`)}>
                        <tr key={e.id}>
                            <td className="font-wave">{e.status}</td>
                            <td>{e.title}</td>
                            <td>{e.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default UserQnaList;
