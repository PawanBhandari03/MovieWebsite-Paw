const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'b7662c4f807bfab908abc99e0459e5ca';
const MOVIES_FILE = path.join(__dirname, 'src', 'data', 'movies.ts');

const fetchPoster = (imdbId) => {
    return new Promise((resolve, reject) => {
        const url = `https://api.themoviedb.org/3/find/${imdbId}?api_key=${API_KEY}&external_source=imdb_id`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.movie_results && json.movie_results.length > 0 && json.movie_results[0].poster_path) {
                        resolve(`https://image.tmdb.org/t/p/w500${json.movie_results[0].poster_path}`);
                    } else {
                        resolve(null);
                    }
                } catch (e) {
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
};

const processMovies = async () => {
    console.log('Reading movies.ts...');
    let content = fs.readFileSync(MOVIES_FILE, 'utf8');

    // Extract JSON part
    const startMarker = 'export const movies: Movie[] = ';
    const startIndex = content.indexOf(startMarker);
    if (startIndex === -1) {
        console.error('Could not find start of movies array');
        return;
    }

    const jsonStart = startIndex + startMarker.length;
    // Find the last closing bracket before the end
    const jsonEnd = content.lastIndexOf('];') + 1;

    const jsonContent = content.substring(jsonStart, jsonEnd);

    let movies;
    try {
        // We need to be careful as the file might have trailing commas or other JS-isms not valid in strict JSON
        // But the previous generation was pretty clean JSON-like structure.
        // Let's try `eval` for safety in this context since it's a local file we just generated
        movies = eval(jsonContent);
    } catch (e) {
        console.error('Error parsing movies data:', e.message);
        return;
    }

    console.log(`Found ${movies.length} movies. Updating images...`);

    // Process in batches to avoid rate limits
    const BATCH_SIZE = 5;
    let updatedCount = 0;

    for (let i = 0; i < movies.length; i += BATCH_SIZE) {
        const batch = movies.slice(i, i + BATCH_SIZE);
        const promises = batch.map(async (movie) => {
            if (movie.id.startsWith('tt')) { // Only fetch for IMDB IDs
                const poster = await fetchPoster(movie.id);
                if (poster) {
                    movie.image = poster;
                    updatedCount++;
                    process.stdout.write('.');
                } else {
                    process.stdout.write('x');
                }
            }
        });

        await Promise.all(promises);
        // Small delay to respect rate limits
        await new Promise(r => setTimeout(r, 200));
    }

    console.log(`\nUpdated ${updatedCount} images.`);

    // Reconstruct file content
    const newContent = `export interface Movie {
  id: string;
  title: string;
  image: string;
  rating: number;
  year: number;
  category: string;
  description: string;
}

export const movies: Movie[] = ${JSON.stringify(movies, null, 2)};
`;

    fs.writeFileSync(MOVIES_FILE, newContent);
    console.log('Done!');
};

processMovies();
