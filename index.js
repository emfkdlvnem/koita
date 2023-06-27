import { getWeatherData, getYouTubeData } from './js/api.js';
import { loadWeatherData } from './js/weather.js';
import { loadYouTubeData } from './js/youtube.js';
import { initializeContactItems, setupInitialContact } from './js/contact.js';

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

    // // 날씨 api 호출
    getWeatherData();
    loadWeatherData();

    // youtube api 호출
    getYouTubeData();
    loadYouTubeData();

});