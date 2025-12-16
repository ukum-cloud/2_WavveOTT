import type { Video } from '../types/movie';

interface RelativeProps {
    videos: Video[];
}

const MovieRelative = ({ videos }: RelativeProps) => {
    return (
        <div className="relative-wrap">
            <ul className="relative-list">
                {videos.map((v, index) => (
                    <li key={index}>
                        <div className="relative-card">
                            <iframe
                                className="epside-video"
                                src={`https://www.youtube.com/embed/${v.key}?mute=1`}
                                allowFullScreen
                                title={v.type}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MovieRelative;
