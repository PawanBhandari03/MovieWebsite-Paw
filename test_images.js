const TMDB_ID = '1295179'; // From previous sample
const urls = [
    `https://vidsrc.me/images/${TMDB_ID}.jpg`,
    `https://img.vidsrc.me/image/${TMDB_ID}`,
    `https://vidsrc.xyz/images/${TMDB_ID}.jpg`,
    `https://image.tmdb.org/t/p/w500/${TMDB_ID}.jpg` // Unlikely
];

const test = async () => {
    for (const url of urls) {
        try {
            console.log(`Testing ${url}...`);
            const response = await fetch(url, { method: 'HEAD' });
            console.log(`Status: ${response.status}`);
            if (response.status === 200) {
                console.log(`FOUND! ${url}`);
                return;
            }
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    }
    console.log('No working image URL found.');
};

test();
