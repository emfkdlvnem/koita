// 날씨 api
function getWeatherData() {
    // const apiKey = '80b62e0ba0594a2abdf181533232106';
    const koreaUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Seoul,Korea&lang=kr`;
    const japanUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Oita,Japan&lang=kr`;

    // 한국(서울) 날씨 API 호출
    const koreaWeatherPromise = axios.get(koreaUrl)
        .then(response => response.data)
        .catch(error => {
            console.error('한국(서울) 날씨 API 오류:', error);
            throw error;
        });

    // 일본(규슈 지방) 날씨 API 호출
    const japanWeatherPromise = axios.get(japanUrl)
        .then(response => response.data)
        .catch(error => {
            console.error('일본(오이타) 날씨 API 오류:', error);
            throw error;
        });

    return Promise.all([koreaWeatherPromise, japanWeatherPromise]);
}


// youtube api
function getYouTubeData() {
    // const youtubeApiKey = 'AIzaSyDoSnXhlTJyL0bXj3p52a1q7HsOkGS2Y4s';
    // const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?key=${youtubeApiKey}&part=snippet&q=Oita&maxResults=10`;

    // 유튜브 API 호출
    const youtubeDataPromise = axios.get(youtubeUrl)
        .then(response => response.data)
        .catch(error => {
            console.error('유튜브 API 오류:', error);
            throw error;
        });

    return Promise.all([youtubeDataPromise]);
}


export { getWeatherData, getYouTubeData };

