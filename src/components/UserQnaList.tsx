import React from 'react';

const UserQnaList = () => {
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
                        <th scope="col" className="font-wave">
                            구분
                        </th>
                        <th scope="col">제목</th>
                        <th scope="col">등록일</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="font-wave"></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <div className="list-content">{/* {formatContent(notice.content)} */}</div>
            <table className="other-page">
                <colgroup>
                    <col width="105" />
                    <col width="*" />
                    <col width="105" />
                    <col width="105" />
                    <col width="*" />
                    <col width="105" />
                </colgroup>
                <tbody>
                    <tr>
                        <th scope="row"> 이전글</th>
                        <td>
                            <span>
                                {/* {prevNotice ? (
                                    <Link to={`/service-center/notice/${prevNotice.id}`}>
                                        {prevNotice.title}
                                    </Link>
                                ) : (
                                    '이전 페이지가 없습니다'
                                )} */}
                            </span>
                        </td>
                        <td>2025-12-12</td>
                        <th scope="row">다음</th>
                        <td>
                            <span>
                                {/* {nextNotice ? (
                                    <Link to={`/service-center/notice/${nextNotice.id}`}>
                                        {nextNotice.title}
                                    </Link>
                                ) : (
                                    '다음 페이지가 없습니다'
                                )} */}
                            </span>
                        </td>
                        <td>2025-12-12</td>
                    </tr>
                </tbody>
            </table>
            <div className="list-button">
                {/* <Link style={{ width: '240px' }} className="btn primary large" to="/service-center">
                    목록 페이지
                </Link> */}
            </div>
        </>
    );
};

export default UserQnaList;
