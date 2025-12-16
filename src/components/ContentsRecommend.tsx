import type { OnlyWavve } from '../types/movie';
import { getGenres } from '../utils/mapping';

import './scss/ContentsRecommend.scss';

interface RecommendProps {
    wavves: OnlyWavve[];
}

const ContentsRecommend = ({ wavves }: RecommendProps) => {
    return (
        <div className="recommend-wrap">
            <ul className="recommend-list">
                {wavves.map((w) => (
                    <li className="recommend-card" key={w.id}>
                        <div className="recommend-img">
                            <img
                                src={`https://image.tmdb.org/t/p/original${w.episodes[0]?.still_path}}`}
                                alt="thum"
                            />
                        </div>
                        <div className="recommend-text">
                            <h3 className="recommend-title">{w.name}</h3>

                            <div className="recommend-middle">
                                <p className="recommend-vote seperate">
                                    <img src="/images/icons/icon-star.svg" alt="starIcon" />
                                    <span>{(w.vote_average ?? 0).toFixed(1)}</span>
                                </p>
                                <p className="recommend-date seperate">
                                    {w.first_air_date?.slice(0, 4)}년
                                </p>
                                <p className="recommend-genre">
                                    {getGenres(w.genre_ids).slice(0, 2).join(' · ') || '기타'}
                                </p>
                            </div>
                            <div className="recommend-overview">{w.overview}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContentsRecommend;
