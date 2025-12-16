import { useState } from 'react';
import type { Episodes, Season } from '../types/movie';

import './scss/ContentsEpisode.scss';

interface EpisodeProps {
    episodes: Episodes[];
    seasons?: Season[];
}

const ContentsEpisode = ({ episodes, seasons = [] }: EpisodeProps) => {
    const [isSeasonOpen, setIsSeasonOpen] = useState(false);
    const [isLatestOpen, setIsLatestOpen] = useState(false);

    const [selectedSeason, setSelectedSeason] = useState('전체 시즌');
    const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<number | null>(null);
    const [selectedSort, setSelectedSort] = useState('오래된 순');

    // 필터(오래된순/최신순)
    const filteredEpisodes = episodes
        .filter((e) => !selectedSeasonNumber || e.season_number === selectedSeasonNumber)
        .sort((a, b) => {
            if (selectedSort === '오래된 순') {
                return a.episode_number - b.episode_number;
            } else {
                return b.episode_number - a.episode_number;
            }
        });

    return (
        <div className="episode-wrap">
            <div className="episode-menu">
                {/* 시즌 select */}
                <div className="episode-select season">
                    {selectedSeason}
                    <button onClick={() => setIsSeasonOpen(!isSeasonOpen)}>
                        <img src="/images/icons/icon-arrow-down.svg" alt="arrowDownIcon" />
                    </button>

                    {isSeasonOpen && (
                        <ul className="select-season-btn">
                            <li
                                onClick={() => {
                                    setSelectedSeason('전체 시즌');
                                    setSelectedSeasonNumber(null);
                                    setIsSeasonOpen(false);
                                }}
                            >
                                전체 시즌
                            </li>
                            {seasons.map((season) => (
                                <li
                                    key={season.id}
                                    onClick={() => {
                                        setSelectedSeason(season.name);
                                        setSelectedSeasonNumber(season.season_number);
                                        setIsSeasonOpen(false);
                                    }}
                                >
                                    {season.name} ({season.episode_count}화)
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {/* 정렬 select */}
                <div className="episode-select latest">
                    {selectedSort}
                    <button onClick={() => setIsLatestOpen(!isLatestOpen)}>
                        <img src="/images/icons/icon-arrow-down.svg" alt="arrowDownIcon" />
                    </button>

                    {isLatestOpen && (
                        <ul className="select-season-btn">
                            <li
                                onClick={() => {
                                    setSelectedSort('오래된 순');
                                    setIsLatestOpen(false);
                                }}
                            >
                                오래된 순
                            </li>
                            <li
                                onClick={() => {
                                    setSelectedSort('최신 순');
                                    setIsLatestOpen(false);
                                }}
                            >
                                최신 순
                            </li>
                        </ul>
                    )}
                </div>
            </div>
            <ul className="episode-list">
                {filteredEpisodes.map((e) => (
                    <li key={e.id} className="episode-card">
                        <div className="episodes-img">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${e.still_path}`}
                                alt={e.name}
                            />
                        </div>
                        <div className="episodes-text">
                            <h3>
                                시즌 {e.season_number}-{e.episode_number}화
                            </h3>
                            <p>{e.runtime}분</p>
                            <p className="episode-overview">{e.overview}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContentsEpisode;
