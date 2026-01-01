const endpoints = [
    'https://vidsrc.xyz/movies/latest/page-1.json',
    'https://vidsrc.to/vapi/movie/new'
];

const inspect = async () => {
    for (const url of endpoints) {
        try {
            console.log(`Fetching from ${url}...`);
            const response = await fetch(url);
            const data = await response.json();

            console.log(`Success from ${url}`);
            if (Array.isArray(data.result)) {
                console.log('Keys:', Object.keys(data.result[0]));
                console.log('Sample:', JSON.stringify(data.result[0], null, 2));
            } else if (data.result && data.result.items) {
                console.log('Keys:', Object.keys(data.result.items[0]));
            } else {
                console.log('Structure unknown:', Object.keys(data));
            }
            return; // Stop after first success
        } catch (error) {
            console.log(`Failed to fetch from ${url}:`, error.message);
        }
    }
    console.log('All endpoints failed.');
};

inspect();
