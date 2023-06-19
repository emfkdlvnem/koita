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
    const dtElements = document.querySelectorAll('.tour-category dt');
    const ddElements = document.querySelectorAll('.tour-category dd');
    
    // 초기에 첫 번째 카테고리만 보이도록 설정
    ddElements.forEach((dd, index) => {
        if (index !== 0) {
            dd.style.display = 'none';
        }
    });
    
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
    
    
    
    
    
    

});

