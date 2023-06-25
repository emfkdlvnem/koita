export function initializeContactItems() {
    // .btn-show 클래스를 가진 모든 버튼 선택
    const buttons = document.querySelectorAll('.btn-show');
    
    buttons.forEach((button, index) => {
        // 버튼 클릭 이벤트 처리
        button.addEventListener('click', () => {
            // 버튼의 최상위 부모 요소(.contact-item) 찾기
            const parent = button.closest('.contact-item');
            const txt = parent.querySelector('.txt');
    
            // 다른 contact-item의 txt 닫기
            const activeItems = document.querySelectorAll('.contact-item.active');
            activeItems.forEach((item) => {
                if (item !== parent) {
                    item.classList.remove('active');
                    const activeTxt = item.querySelector('.txt');
                    activeTxt.classList.remove('active');
                    activeTxt.style.maxHeight = '0';
                }
            });
    
            // 토글 기능
            parent.classList.toggle('active');
            txt.classList.toggle('active');
    
            if (parent.classList.contains('active')) {
                txt.style.maxHeight = txt.scrollHeight + 'px';
            } else {
                txt.style.maxHeight = '0';
            }
        });

        // 첫 번째 contact-item 초기 상태 설정
        if (index === 0) {
            const parent = button.closest('.contact-item');
            const txt = parent.querySelector('.txt');
            parent.classList.add('active');
            txt.classList.add('active');
            txt.style.maxHeight = txt.scrollHeight + 'px';
        }
    });
}

  // 첫 번째 contact-item 초기 상태 설정
export function setupInitialContact() {
    const buttons = document.querySelectorAll('.btn-show');
    const parent = buttons[0].closest('.contact-item');
    const txt = parent.querySelector('.txt');
    parent.classList.add('active');
    txt.classList.add('active');
    txt.style.maxHeight = txt.scrollHeight + 'px';
}

document.addEventListener("DOMContentLoaded", () => {
    initializeContactItems();
    setupInitialContact();
});