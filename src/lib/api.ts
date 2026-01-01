export interface ApiMovie {
    imdb_id: string;
    tmdb_id: string;
    title: string;
    embed_url: string;
    quality: string;
}

export interface Movie {
    id: string;
    title: string;
    image: string;
    rating: number;
    year: number;
    category: string;
    embed_url: string;
    description?: string;
}

const BASE_URL = 'https://vidsrc-embed.ru';

export const fetchLatestMovies = async (page: number = 1): Promise<Movie[]> => {
    try {
        // Using allorigins.win as CORS proxy
        const targetUrl = `${BASE_URL}/movies/latest/page-${page}.json`;
        console.log('Fetching movies from:', targetUrl);

        const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (data.result && Array.isArray(data.result)) {
            return data.result.map((item: ApiMovie) => {
                // Extract year from title if present (e.g., "Movie Title 2024")
                const yearMatch = item.title.match(/\s(\d{4})$/);
                const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();
                const cleanTitle = item.title.replace(/\s\d{4}$/, '');

                return {
                    id: item.imdb_id || item.tmdb_id,
                    title: cleanTitle,
                    // Use a gradient placeholder since we don't have images
                    image: `https://placehold.co/600x900/1e293b/38bdf8?text=${encodeURIComponent(cleanTitle)}`,
                    rating: 0, // No rating data
                    year: year,
                    category: "Movie", // No category data
                    embed_url: item.embed_url,
                    description: "No description available."
                };
            });
        }
        return [];
    } catch (error) {
        console.error("Error fetching movies:", error);
        return [];
    }
};
