import { useNavigate } from "react-router-dom"
import { noticeData } from "../data/notice";
import type { NoticeType } from "../types/etc";
import './scss/Notice.scss'

const NoticeA = () => {
  const navigate = useNavigate();
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
            <th scope="col">구분</th>
            <th scope="col">제목</th>
            <th scope="col">등록일</th>
          </tr>
        </thead>
        <tbody>
          {noticeData.map((e: NoticeType) => (
            <tr key={e.id} onClick={() => navigate(`notice/${e.id}`)}>
              <td>{e.division}</td>
              <td>{e.title}</td>
              <td>{e.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default NoticeA