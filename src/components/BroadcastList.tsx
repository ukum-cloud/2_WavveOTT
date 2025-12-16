import React from 'react'
import { Link } from 'react-router-dom';
import "./scss/BroadcastList.scss";

interface LogoBtn{
  id: number;
  name: string;
  image: string;
  url: string;
}

const broadcastBtns: LogoBtn[] = [
  {id: 1, name: "mbc", image: "/images/badge/badge-mbc-logo.svg", url: "/"},
  {id: 2, name: "kbs", image: "/images/badge/badge-kbs-logo.svg", url: "/"},
  {id: 3, name: "jtbc", image: "/images/badge/badge-jtbc-logo.svg", url: "/"},
  {id: 4, name: "웹예능", image: "/images/badge/badge-웹예능-logo.svg", url: "/"},
  {id: 5, name: "cjenm", image: "/images/badge/badge-cjenm-logo.svg", url: "/"},
  {id: 6, name: "키즈", image: "/images/badge/badge-키즈-logo.svg", url: "/kids"}
]

const BroadcastList = () => {
  return (
    <div className='broadcast-list'>
      {broadcastBtns.map((b) => (
        <div className='broadcast-box' key={b.id}>
          <Link to={b.url}>
            <img src={b.image} alt={b.name} />
          </Link>
        </div>
      ))}
    </div>
  )
}

export default BroadcastList