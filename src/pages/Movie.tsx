import React, { useEffect, useMemo, useState } from 'react';
import MovieVisual from '../components/MovieVisual';
import EditorRecommendCardList from '../components/EditorRecommendCardList';
import { useMovieStore } from '../stores/useMovieStore';
import RankingCardList from '../components/RankingCardList';
import PrimaryList from '../components/PrimaryList';
import NewMovieList from '../components/NewMovieList';
import WavveList from '../components/WavveList';
import LoadingBar from '../components/LoadingBar'; 
import type { MovieWithLogo, OnlyWavve, PrimaryItem } from '../types/movie';
import './scss/Movie.scss';

const Movie: React.FC = () => {
    const {
        popularMovies,
        newMovies,
        topRatedMovies = [],
        onFetchPopular,
        onFetchNewMovie,
        onFetchTopRated,
    } = useMovieStore();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                await Promise.all([
                    popularMovies.length === 0 ? onFetchPopular() : Promise.resolve(),
                    newMovies.length === 0 ? onFetchNewMovie() : Promise.resolve(),
                    topRatedMovies.length === 0 ? onFetchTopRated() : Promise.resolve(),
                ]);
            } catch (error) {
                console.error('데이터 로딩 실패:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const currentMonth = new Date().getMonth() + 1;

    const recentOneMonthMovies = useMemo(() => {
        if (!newMovies?.length) return [];
        const now = Date.now();
        const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);
        return newMovies.filter((movie: MovieWithLogo) => {
            if (!movie.release_date) return false;
            const releaseTime = new Date(movie.release_date).getTime();
            return releaseTime >= oneMonthAgo && releaseTime <= now;
        });
    }, [newMovies]);

    const formattedTopRated = useMemo((): OnlyWavve[] => {
        if (!topRatedMovies.length) return [];
        return topRatedMovies.slice(0, 10).map((m: MovieWithLogo) => ({
            ...m,
            name: m.title || '',
            wavveVideo: m.videos?.[0] || null,
            media_type: 'tv' as const,
        })) as unknown as OnlyWavve[];
    }, [topRatedMovies]);

    const safeRandomList = useMemo((): PrimaryItem[] => {
        if (!topRatedMovies.length) return [];
        const targetGenres = [28, 18, 10749, 35];
        const filtered = topRatedMovies.slice(10).filter((m: MovieWithLogo) =>
            m.genre_ids?.some((id: number) => targetGenres.includes(id))
        );
        const baseList = filtered.length > 0 ? filtered : topRatedMovies.slice(10, 25);
        return baseList.map((m: MovieWithLogo) => ({
            ...m,
            id: m.id,
            title: m.title || '',
            name: m.title || '',
            mediaType: 'movie' as const,
            certification: m.certification || '',
        })) as unknown as PrimaryItem[];
    }, [topRatedMovies]);

    // 로딩 컴포넌트
    if (isLoading || popularMovies.length === 0) {
        return <LoadingBar />;
    }

    return (
        <main className="sub-movie-main">
            <MovieVisual />
            <div className="inner">
                <section className="card-list">
                    <RankingCardList
                        RankingData={popularMovies}
                        title="영화 실시간 TOP 10"
                        limit={10}
                    />
                </section>

                {formattedTopRated.length > 0 && (
                    <section className="card-list">
                        <WavveList 
                            title="시간이 흘러도 사랑받는 명작" 
                            wavves={formattedTopRated} 
                        />
                    </section>
                )}

                {safeRandomList.length > 0 && (
                    <section className="card-list">
                        <PrimaryList 
                            title="이건 꼭 봐야해!" 
                            randomList={safeRandomList} 
                        />
                    </section>
                )}

                <section className="card-list">
                    <NewMovieList
                        title={`${currentMonth}월 신작 영화`}
                        newMovies={
                            recentOneMonthMovies.length > 0
                                ? recentOneMonthMovies
                                : newMovies.slice(0, 15)
                        }
                    />
                </section>
            </div>

            <EditorRecommendCardList 
                title="웨이브 영화 추천작" 
                list={popularMovies} 
            />
        </main>
    );
};

export default Movie;