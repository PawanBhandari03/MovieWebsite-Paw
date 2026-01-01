const https = require('https');

const API_KEY = 'b7662c4f807bfab908abc99e0459e5ca';
const TEST_IMDB_ID = 'tt23743204';

const verify = () => {
    const url = `https://api.themoviedb.org/3/find/${TEST_IMDB_ID}?api_key=${API_KEY}&external_source=imdb_id`;
    console.log(`Fetching ${url}...`);

    https.get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                console.log('Response:', JSON.stringify(json, null, 2));
                if (json.movie_results && json.movie_results.length > 0) {
                    const posterPath = json.movie_results[0].poster_path;
                    console.log('Poster URL:', `https://image.tmdb.org/t/p/w500${posterPath}`);
                } else {
                    console.log('No movie found for this ID.');
                }
            } catch (e) {
                console.error('Error parsing JSON:', e.message);
            }
        });

    }).on('error', (err) => {
        console.error('Error:', err.message);
    });
};

verify();