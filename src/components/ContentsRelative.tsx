import type { Video } from '../types/movie';

import './scss/ContentsRelative.scss';

interface RelativeProps {
    videos: Video[];
    backdrop: string | null;
}

const ContentsRelative = ({ videos }: RelativeProps) => {
    //어떤거가 호버됐는지 체크

    return (
        <div className="relative-wrap">
            <ul className="relative-list">
                {videos.map((v) => (
                    <li>
                        <iframe
                            className="epside-video"
                            src={`https://www.youtube.com/embed/${v.key}?mute=1`}
                            allowFullScreen
                            title={v.type}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContentsRelative;
