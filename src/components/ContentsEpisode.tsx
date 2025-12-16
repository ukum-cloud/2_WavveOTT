import { useState } from 'react';
import type { Episodes, Season } from '../types/movie';

import CustomSelect from './CustomSelect';

import './scss/ContentsEpisode.scss';

interface EpisodeProps {
    episodes: Episodes[];
    seasons?: Season[];
    episodeImages?: string[];
}
export interface SelectOption {
    label: string;
    path: string;
}

const ContentsEpisode = ({ episodes, seasons = [], episodeImages }: EpisodeProps) => {
    const [selectedSeason, setSelectedSeason] = useState('전체 시즌');
    const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<number | null>(null);
    const [selectedSort, setSelectedSort] = useState('오래된 순');

    // 시즌 옵션
    const seasonOptions: SelectOption[] = [
        { label: '전체 시즌', path: '' },
        ...seasons.map((season) => ({
            label: `${season.name}`,
            path: season.season_number.toString(),
        })),
    ];

    const handleSeasonSelect = (path: string, label: string) => {
        setSelectedSeason(label);
        setSelectedSeasonNumber(path ? Number(path) : null);
    };

    // 정렬 옵션
    const sortOptions: SelectOption[] = [
        { label: '오래된 순', path: '오래된 순' },
        { label: '최신 순', path: '최신 순' },
    ];

    const handleSortSelect = (label: string) => {
        setSelectedSort(label);
    };

    // episodes와 episodeImages를 같이 묶어서 처리
    const episodesWithImages = episodes.map((e, index) => ({
        ...e,
        image: episodeImages?.[index] ?? '', //
    }));

    // 필터 & 정렬된 에피소드
    const filteredEpisodes = episodesWithImages
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
                    <CustomSelect
                        options={seasonOptions}
                        selectedValue={selectedSeason}
                        onSelect={handleSeasonSelect}
                        label="전체 시즌"
                        width="256"
                    />
                </div>

                {/* 정렬 select */}
                <div className="episode-select latest">
                    <CustomSelect
                        options={sortOptions}
                        selectedValue={selectedSort}
                        onSelect={handleSortSelect}
                        label="정렬"
                        width="256"
                    />
                </div>
            </div>
            <ul className="episode-list">
                {filteredEpisodes.map((e) => (
                    <li key={e.id} className="episode-card">
                        <div className="episodes-img">
                            <img src={e.image} alt={e.name} />
                        </div>
                        <div className="episodes-text">
                            <h3>
                                시즌 {e.season_number} {e.episode_number}화
                            </h3>
                            {e.runtime ? <p>{e.runtime}분</p> : ''}
                            <p className="episode-overview">{e.overview}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContentsEpisode;
