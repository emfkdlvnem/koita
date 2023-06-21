// 날씨 api
// import axios from 'axios';
// OpenWeatherMap API 호출 함수
function getWeatherData() {
    const apiKey = '80b62e0ba0594a2abdf181533232106';
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

export { getWeatherData };
// youtube api
