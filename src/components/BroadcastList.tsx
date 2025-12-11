import React from 'react'

interface LogoBtn{
  id: number;
  name: string;
  image: string;
  src: string;
}

const broadcastBtns: LogoBtn[] = [
  {id: 1, name: "mbc", image: "/images/badge/badge-mbc-logo.svg", src: ""},
  {id: 2, name: "kbs", image: "/images/badge/badge-kbs-logo.svg", src: ""},
  {id: 3, name: "jtbc", image: "/images/badge/badge-jtbc-logo.svg", src: ""},
  {id: 4, name: "웹예능", image: "/images/badge/badge-웹예능-logo.svg", src: ""},
  {id: 5, name: "cjenm", image: "/images/badge/badge-cjenm-logo.svg", src: ""},
  {id: 6, name: "키즈", image: "/images/badge/badge-키즈-logo.svg", src: ""}
]

const BroadcastList = () => {
  return (
    <div className='broadcast-list'>
      {broadcastBtns.map((broadcast) => (
        <button className='broadcast-box' key={broadcast.id}>
          <img src={broadcast.image} alt={broadcast.name} />
        </button>
      ))}
    </div>
  )
}

export default BroadcastList