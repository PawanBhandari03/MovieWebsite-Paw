import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOTAL_PAGES = 50;
const BASE_URL = 'https://vidsrc-embed.ru';

const fetchMovies = async () => {
    let allMovies = [];
    console.log(`Fetching ${TOTAL_PAGES} pages of movies...`);

    for (let i = 1; i <= TOTAL_PAGES; i++) {
        try {
            console.log(`Fetching page ${i}...`);
            const response = await fetch(`${BASE_URL}/movies/latest/page-${i}.json`);
            const data = await response.json();

            if (data.result && Array.isArray(data.result)) {
                const formatted = data.result.map(m => ({
                    id: m.imdb_id || m.tmdb_id || Math.random().toString(36).substr(2, 9),
                    title: m.title,
                    image: `https://placehold.co/600x900/1e293b/38bdf8?text=${encodeURIComponent(m.title)}`,
                    rating: 0,
                    year: parseInt(m.title.match(/\d{4}/)?.[0] || '2024'),
                    category: 'Movie',
                    description: 'No description available.'
                }));
                allMovies = [...allMovies, ...formatted];
            }
        } catch (error) {
            console.error(`Error fetching page ${i}:`, error.message);
        }
    }

    const fileContent = `export interface Movie {
  id: string;
  title: string;
  image: string;
  rating: number;
  year: number;
  category: string;
  description: string;
}

export const movies: Movie[] = ${JSON.stringify(allMovies, null, 2)};
`;

    const outputPath = path.join(process.cwd(), 'src', 'data', 'movies.ts');
    fs.writeFileSync(outputPath, fileContent);
    console.log(`Successfully saved ${allMovies.length} movies to ${outputPath}`);
};

fetchMovies();
