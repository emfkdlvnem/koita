import { getWeatherData } from './js/api.js';

// main page index
document.addEventListener('DOMContentLoaded', () => {
    // carousel
    let slideIndex = 0; 
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.btn.prev');
    const nextBtn = document.querySelector('.btn.next');

    // 슬라이드 자동 넘김
    let autoSlideTimer;

    function goToSlide(index) {
        // 슬라이드 숨김
        slides.forEach(slide => {
            slide.style.display = 'none';
        });

        // 해당 슬라이드만 보이게
        slides[index].style.display = 'block'; 

        // 인디케이터 active 비활성화
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });

        // active될 인디케이터 표시
        indicators[index].classList.add('active');

        slideIndex = index;

        // 페이지 넘겼을 때 타이머 재설정
        resetAutoSlideTimer();
    }

    // 이전 버튼 클릭 시
    prevBtn.addEventListener('click', () => {
        const prevIndex = (slideIndex - 1 + slides.length) % slides.length;
        goToSlide(prevIndex);
    });

    // 다음 버튼 클릭 시
    nextBtn.addEventListener('click', () => {
        const nextIndex = (slideIndex + 1 + slides.length) % slides.length;
        goToSlide(nextIndex);
    });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
        });
    });

    function autoSlide() {
        const nextIndex = (slideIndex + 1) % slides.length;
        goToSlide(nextIndex);
    }

    function resetAutoSlideTimer() {
        clearInterval(autoSlideTimer); // 타이머 취소하고 정지 후 다시 
        autoSlideTimer = setInterval(autoSlide, 5000);
    }
    goToSlide(0);
    resetAutoSlideTimer();


    // 오이타 소식 category
    function initializeTourCategory(dtElements, ddElements) {
        // 초기에 첫 번째 카테고리만 보이도록
        ddElements.forEach((dd, index) => {
            if (index !== 0) {
                dd.style.display = 'none';
            }
        });
        // 첫 번째 카테고리에 'active' 클래스 넣기
        dtElements[0].classList.add('active');

        dtElements.forEach((dt, currentIndex) => {
            dt.addEventListener('click', () => {
                dtElements.forEach((otherDt, otherIndex) => {
                const otherDd = ddElements[otherIndex];
                const isActive = otherIndex === currentIndex;
        
                otherDt.classList.toggle('active', isActive);
                otherDd.style.display = isActive ? 'block' : 'none';
                });
            });
        });
    }

    const dtElements1 = document.querySelectorAll('.tour-category dt');
    const ddElements1 = document.querySelectorAll('.tour-category dd');
    initializeTourCategory(dtElements1, ddElements1);

    const dtElements2 = document.querySelectorAll('.festival-category dt');
    const ddElements2 = document.querySelectorAll('.festival-category dd');
    initializeTourCategory(dtElements2, ddElements2);

    // scroll-to-top-btn
    function scrollToTop() {
        window.scrollTo({
        top: 0,
        behavior: 'smooth'
        });
    }
    
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    
    window.addEventListener('scroll', () => {

        const scrollY = window.scrollY;
    
        if (scrollY > 500) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.visibility = 'visible';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.visibility = 'hidden';
        }
    });
    
    scrollTopBtn.addEventListener('click', scrollToTop);

    // 날씨 api
    const koreaWeatherContent = document.querySelector('.korea-weather-content');
    const japanWeatherContent = document.querySelector('.japan-weather-content');

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
    
    
    getWeatherData()
    .then(([koreaWeatherData, japanWeatherData]) => {
        // 한국(서울) 날씨 표시
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
    })
    
    .catch(error => {
        console.error('날씨 정보 오류:', error);
    });

});

