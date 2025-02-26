const searchITunes = async (query, type = 'song') => {
    try {
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=${type}&limit=50`;
        const response = await fetch(url);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching data from iTunes API:', error);
        return [];
    }
};

export default searchITunes;