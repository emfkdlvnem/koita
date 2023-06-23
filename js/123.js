// import axios from 'axios';

// 유튜브 API 키
const youtubeApiKey = 'AIzaSyCokCMiB2t_sqo7NMZfSY-duv0WzFoIq88';
const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?key=${youtubeApiKey}&part=snippet&q=Oita&maxResults=4`;

function createVideoList(youtubeData) {
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
            title: '오이타를 경험하세요.',
            videoId: 'iBuaxfCkUG0',
            thumbnail: 'https://i.ytimg.com/vi/iBuaxfCkUG0/default.jpg',
        },
        {
            title: '오이타 먹거리',
            videoId: 'WsfV1Y5Xf1g',
            thumbnail: 'https://i.ytimg.com/vi/WsfV1Y5Xf1g/default.jpg',
        },
    ];

    const videos = customVideos.map(video => {
        const videoId = video.videoId;
        const videoTitle = video.title;
        const videoThumbnail = video.thumbnail;

        return `
            <div class="video-item">
                <a href="#" data-video-id="${videoId}" data-video-title="${videoTitle}">
                    <img src="${videoThumbnail}" alt="${videoTitle}">
                    <p>${videoTitle}</p>
                </a>
            </div>
        `;
    });

    const contentList = document.querySelector('.content-list');
    contentList.innerHTML = videos.join('');

    // 팝업 열기 이벤트 리스너 등록
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
        <button class="close-button">Close</button>
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
    
    const closeButton = document.querySelector('.close-button');
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
    // 팝업 내부를 클릭한 경우는 팝업을 닫지 않음
    if (e.target.closest('.popup-box')) return;

    closeVideoPopup();
});

function getYouTubeData() {
    return axios.get(youtubeUrl)
        .then(response => response.data)
        .catch(error => {
            console.error('유튜브 API 오류:', error);
            throw error;
        });
}

export function loadYouTubeData() {
    getYouTubeData()
        .then(youtubeData => {
            createVideoList(youtubeData);
        })
        .catch(error => {
            console.error('유튜브 데이터 로드 오류:', error);
        });
}
