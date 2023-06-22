// import axios from 'axios';

    // 날씨 api

    // 날씨 번역 매핑 객체
    const weatherTranslations = {
        '1000': '맑음',
        '1003': '구름 조금',
        '1006': '흐림',
        '1009': '매우 흐림',
        '1063': '가끔 비',
        '1066': '가끔 눈',
        '1069': '가끔 진눈깨비',
        '1072': '가끔 얼어붙는 이슬비',
        '1087': '뇌우 가능',
        '1114': '눈 바람',
        '1117': '눈보라',
        '1135': '안개',
        '1147': '얼어붙는 안개',
        '1150': '약한 이슬비',
        '1153': '이슬비',
        '1168': '얼어붙는 이슬비',
        '1171': '심한 얼어붙는 이슬비',
        '1180': '약한 비',
        '1183': '비',
        '1186': '가끔 비',
        '1189': '비',
        '1192': '가끔 많은 비',
        '1195': '많은 비',
        '1198': '약한 동결 비',
        '1201': '동결 비',
        '1204': '약한 진눈깨비',
        '1207': '진눈깨비',
        '1210': '가끔 약한 눈',
        '1213': '약한 눈',
        '1216': '가끔 눈',
        '1219': '눈',
        '1222': '가끔 많은 눈',
        '1225': '많은 눈',
        '1237': '진눈깨비',
        '1240': '약한 비',
        '1243': '비',
        '1246': '폭우',
        '1249': '약한 진눈깨비',
        '1252': '진눈깨비',
        '1255': '약한 눈',
        '1258': '눈',
        '1261': '진눈깨비',
        '1264': '진눈깨비',
        '1273': '번개를 동반한 약한 비',
        '1276': '번개를 동반한 비',
        '1279': '번개를 동반한 약한 눈',
        '1282': '번개를 동반한 눈'
    };


function displayWeatherData(koreaWeatherData, japanWeatherData) {
    // 한국(서울) 날씨 표시
    const koreaWeatherContent = document.querySelector('.korea-weather-content');
    const koreaTemperature = koreaWeatherData.current.temp_c;
    const koreaIconUrl = koreaWeatherData.current.condition.icon;
    const koreaWeatherCode = koreaWeatherData.current.condition.code;
    const koreaTranslatedWeather = weatherTranslations[koreaWeatherCode];
    const koreaPrecipitation = koreaWeatherData.current.precip_mm;
    const koreaWindSpeed = koreaWeatherData.current.wind_kph;

    const koreaWeatherHTML = `
        <h3 class="section-title">한국 날씨<span>서울</span></h3>
        <div class="content-area">
            <div class="thumb">
                <img src="${koreaIconUrl}" alt="날씨 아이콘">
            </div>
            <div class="text">
                <div class="main-content">
                    <p class="txt01">${koreaTemperature}°C</p>
                    <p class="txt02">${koreaTranslatedWeather}</p>
                </div>
                <div class="sub-content">
                    <p class="txt03">강수량: ${koreaPrecipitation}mm</p>
                    <p class="txt04">바람속도: ${koreaWindSpeed}km/h</p>
                </div>
            </div>
        </div>
    `;
    koreaWeatherContent.innerHTML = koreaWeatherHTML;

    // 일본(오이타) 날씨 표시
    const japanWeatherContent = document.querySelector('.japan-weather-content');
    const japanTemperature = japanWeatherData.current.temp_c;
    const japanIconUrl = japanWeatherData.current.condition.icon;
    const japanWeatherCode = japanWeatherData.current.condition.code;
    const japanTranslatedWeather = weatherTranslations[japanWeatherCode];
    const japanPrecipitation = japanWeatherData.current.precip_mm;
    const japanWindSpeed = japanWeatherData.current.wind_kph;

    const japanWeatherHTML = `
        <h3 class="section-title">일본 날씨<span>오이타</span></h3>
        <div class="content-area">
            <div class="thumb">
                <img src="${japanIconUrl}" alt="날씨 아이콘">
            </div>
            <div class="text">
                <div class="main-content">
                    <p class="txt01">${japanTemperature}°C</p>
                    <p class="txt02">${japanTranslatedWeather}</p>
                </div>
                <div class="sub-content">
                    <p class="txt03">강수량: ${japanPrecipitation}mm</p>
                    <p class="txt04">바람속도: ${japanWindSpeed}km/h</p>
                </div>
            </div>
        </div>
    `;
    japanWeatherContent.innerHTML = japanWeatherHTML;
}

function fetchWeatherData() {
    const apiKey = '80b62e0ba0594a2abdf181533232106';
    const koreaUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Seoul,Korea&lang=kr`;
    const japanUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Oita,Japan&lang=kr`;

    const koreaWeatherPromise = axios.get(koreaUrl)
        .then(response => response.data)
        .catch(error => {
            console.error('한국(서울) 날씨 API 오류:', error);
            throw error;
        });

    const japanWeatherPromise = axios.get(japanUrl)
        .then(response => response.data)
        .catch(error => {
            console.error('일본(오이타) 날씨 API 오류:', error);
            throw error;
        });

    return Promise.all([koreaWeatherPromise, japanWeatherPromise]);
}

export function loadWeatherData() {
    fetchWeatherData()
        .then(([koreaWeatherData, japanWeatherData]) => {
            displayWeatherData(koreaWeatherData, japanWeatherData);
        })
        .catch(error => {
            console.error('날씨 정보 오류:', error);
        });
}


