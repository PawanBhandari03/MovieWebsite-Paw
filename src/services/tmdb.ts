import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export interface TMDBMovie {
    id: number;
    title?: string; // Movies have title
    name?: string;  // TV shows have name
    poster_path: string | null;
    backdrop_path: string | null;
    overview: string;
    release_date?: string;
    first_air_date?: string;
    vote_average: number;
    genre_ids: number[];
    media_type?: 'movie' | 'tv' | 'person';
    origin_country?: string[];
}

export interface TMDBResponse {
    page: number;
    results: TMDBMovie[];
    total_pages: number;
    total_results: number;
}

const tmdb = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
    },
});

export const getTrendingMoviesToday = async (): Promise<TMDBMovie[]> => {
    const response = await tmdb.get<TMDBResponse>('/trending/movie/day');
    return response.data.results.filter(movie => movie.poster_path);
};

export const getTrendingMovies = async (): Promise<TMDBMovie[]> => {
    const response = await tmdb.get<TMDBResponse>('/trending/movie/week');
    return response.data.results.filter(movie => movie.poster_path);
};

export const getPopularMovies = async (page = 1): Promise<TMDBResponse> => {
    const response = await tmdb.get<TMDBResponse>('/movie/popular', { params: { page } });
    return {
        ...response.data,
        results: response.data.results.filter(movie => movie.poster_path)
    };
};

export const getTopRatedMovies = async (page = 1): Promise<TMDBResponse> => {
    const response = await tmdb.get<TMDBResponse>('/movie/top_rated', { params: { page } });
    return {
        ...response.data,
        results: response.data.results.filter(movie => movie.poster_path)
    };
};

export const getUpcomingMovies = async (page = 1): Promise<TMDBResponse> => {
    const response = await tmdb.get<TMDBResponse>('/movie/upcoming', { params: { page } });
    return {
        ...response.data,
        results: response.data.results.filter(movie => movie.poster_path)
    };
};

export const searchMovies = async (query: string, page = 1): Promise<TMDBResponse> => {
    const response = await tmdb.get<TMDBResponse>('/search/movie', { params: { query, page } });
    return {
        ...response.data,
        results: response.data.results.filter(movie => movie.poster_path)
    };
};

export const searchMulti = async (query: string, page = 1): Promise<TMDBResponse> => {
    const response = await tmdb.get<TMDBResponse>('/search/multi', { params: { query, page } });
    return {
        ...response.data,
        results: response.data.results.filter(item =>
            item.poster_path && (item.media_type === 'movie' || item.media_type === 'tv')
        )
    };
};

// Web Series (TV Shows)
export const getWebSeries = async (page = 1): Promise<TMDBResponse> => {
    const response = await tmdb.get<TMDBResponse>('/tv/popular', { params: { page } });
    return {
        ...response.data,
        results: response.data.results.filter(show => show.poster_path)
    };
};

// Dramas (Asian Dramas - Filtering for Korean primarily as "Kdrama" is standard)
export const getDramas = async (page = 1): Promise<TMDBResponse> => {
    const response = await tmdb.get<TMDBResponse>('/discover/tv', {
        params: {
            page,
            with_original_language: 'ko', // Korean
            sort_by: 'popularity.desc'
        }
    });
    return {
        ...response.data,
        results: response.data.results.filter(show => show.poster_path)
    };
};

export const getAnime = async (page = 1): Promise<TMDBResponse> => {
    const response = await tmdb.get<TMDBResponse>('/discover/tv', {
        params: {
            page,
            with_genres: 16, // Animation
            with_original_language: 'ja', // Japanese
            sort_by: 'popularity.desc'
        }
    });
    return {
        ...response.data,
        results: response.data.results.filter(show => show.poster_path)
    };
};

export const getMovieDetails = async (id: string | number) => {
    const response = await tmdb.get(`/movie/${id}`, {
        params: {
            append_to_response: 'credits,similar,videos',
        },
    });
    return response.data;
};

export const getTVDetails = async (id: number) => {
    const response = await tmdb.get(`/tv/${id}`);
    return response.data;
};

export const getTVSeasonDetails = async (id: number, seasonNumber: number) => {
    const response = await tmdb.get(`/tv/${id}/season/${seasonNumber}`);
    return response.data;
};

export const getImageUrl = (path: string | null, size: string = 'w500') => {
    if (!path) return 'https://placehold.co/500x750/1e293b/ffffff?text=No+Image';
    return `https://image.tmdb.org/t/p/${size}${path}`;
};
