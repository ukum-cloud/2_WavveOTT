import { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Player = () => {
    const { videoKey } = useParams();

    const navigate = useNavigate();

    const iframeRef = useRef<HTMLIFrameElement>(null);

    return (
        <div className="player-page">
            <button className="btn default primary" onClick={() => navigate(-1)}>
                뒤로가기
            </button>
            <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&controls=1&rel=0&playsinline=1`}
                allowFullScreen={false}
                title="youtube-player"
                style={{
                    width: '100vw',
                    height: '100vh',
                    border: 'none',
                }}
            />
        </div>
    );
};

export default Player;
