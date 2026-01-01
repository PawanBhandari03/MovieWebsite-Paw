const BASE_URL = 'https://vidsrc-embed.ru';

const checkPage = async (page) => {
    try {
        const response = await fetch(`${BASE_URL}/movies/latest/page-${page}.json`);
        if (response.status === 200) {
            const data = await response.json();
            if (data.result && data.result.length > 0) {
                return true;
            }
        }
        return false;
    } catch (e) {
        return false;
    }
};

const findLimit = async () => {
    console.log('Checking page limits...');
    // Check exponentially
    let page = 1;
    while (await checkPage(page)) {
        console.log(`Page ${page} exists.`);
        if (page > 1000) break; // Safety break
        page *= 2;
    }

    // Binary search could be better, but let's just see if page 100 exists (5000 movies)
    // or page 1000 (50,000 movies)

    console.log('Checking specific high pages...');
    const p100 = await checkPage(100);
    console.log(`Page 100 (5,000 movies): ${p100 ? 'Exists' : 'Does not exist'}`);

    const p500 = await checkPage(500);
    console.log(`Page 500 (25,000 movies): ${p500 ? 'Exists' : 'Does not exist'}`);

    const p1000 = await checkPage(1000);
    console.log(`Page 1000 (50,000 movies): ${p1000 ? 'Exists' : 'Does not exist'}`);
};

findLimit();
