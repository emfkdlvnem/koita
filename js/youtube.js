// import axios from 'axios';

// 유튜브 API 
// const youtubeApiKey = 'AIzaSyCokCMiB2t_sqo7NMZfSY';

function createVideoList(videos) {
    const contentList = document.querySelector('.content-list');
    contentList.innerHTML = videos.map(video => `
        <div class="video-item">
            <a href="#" data-video-id="${video.videoId}" data-video-title="${video.title}">
                <p>${video.title}</p>
                <div class="thumb">
                    <img src="${video.thumbnail}" alt="${video.title}">
                </div>
            </a>
        </div>
    `).join('');

    const videoLinks = document.querySelectorAll('.video-item a');
    videoLinks.forEach(link => {
        link.addEventListener('click', e => {
        e.preventDefault();
        const videoId = link.dataset.videoId;
        const videoTitle = link.dataset.videoTitle;
        openVideoPopup(videoId, videoTitle);
        });
    });
}

function openVideoPopup(videoId, videoTitle) {
    const popupBox = document.querySelector('.popup-box');
    popupBox.innerHTML = `
        <button class="btn close-btn">
        <span class="blind">닫기</span>
        <i class="fa-solid fa-xmark"></i>
        </button>
        <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/${videoId}"
        title="${videoTitle}"
        frameborder="0"
        allow="accelerometer;
        autoplay;
        clipboard-write;
        encrypted-media;
        gyroscope;
        picture-in-picture"
        allowfullscreen
        ></iframe>
    `;

    const popup = document.querySelector('.popup');
    popup.style.display = 'block';

    const closeButton = document.querySelector('.close-btn');
    closeButton.addEventListener('click', closeVideoPopup);
}

function closeVideoPopup() {
    const popup = document.querySelector('.popup');
    popup.style.display = 'none';
    const popupBox = document.querySelector('.popup-box');
    popupBox.innerHTML = '';
}

const popup = document.querySelector('.popup');
popup.addEventListener('click', e => {
    if (e.target.closest('.popup-box')) return;

    closeVideoPopup();
});

function getCustomVideos() {
    const customVideos = [
        {
            title: '온천 여행은 오이타에서',
            videoId: 'EBjmq0aeHJ4',
            thumbnail: 'https://i.ytimg.com/vi/EBjmq0aeHJ4/default.jpg',
        },
        {
            title: '미드나잇 오이타',
            videoId: 'ofdWC5arnjE',
            thumbnail: 'https://i.ytimg.com/vi/ofdWC5arnjE/default.jpg',
        },
        {
            title: '오이타를 경험하세요',
            videoId: 'iBuaxfCkUG0',
            thumbnail: 'https://i.ytimg.com/vi/iBuaxfCkUG0/default.jpg',
        },
        {
            title: '오이타 먹거리',
            videoId: 'WsfV1Y5Xf1g',
            thumbnail: 'https://i.ytimg.com/vi/WsfV1Y5Xf1g/default.jpg',
        },
    ];

    return Promise.resolve(customVideos);
}

export function loadYouTubeData() {
    getCustomVideos()
    .then(videos => {
        createVideoList(videos);
    })
    .catch(error => {
        console.error('유튜브 데이터 로드 오류:', error);
    });
}
