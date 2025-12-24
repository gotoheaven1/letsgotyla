// 1. 커스텀 커서 설정 (기존과 동일)
const cursorDot = document.querySelector('.cursor-dot');
const cursorCircle = document.querySelector('.cursor-circle');

window.addEventListener('mousemove', (e) => {
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
    
    cursorCircle.animate({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`
    }, { duration: 500, fill: "forwards" });
});

document.querySelectorAll('.hover-effect').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});


// 2. 인트로 비눗방울 애니메이션 및 랜덤 가사 (index.html에서만 실행)
const canvas = document.getElementById('bubbleCanvas');
const introQuoteText = document.getElementById('intro-quote-text');

if (canvas && introQuoteText) { // 캔버스와 가사 요소가 모두 있을 때만 실행
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let bubblesArray = [];
    const colors = ['rgba(207, 170, 101, 0.4)', 'rgba(235, 220, 178, 0.3)', 'rgba(255, 255, 255, 0.2)'];

    class Bubble {
        constructor() {
            this.radius = Math.random() * 20 + 5;
            this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
            this.y = canvas.height + this.radius;
            this.directionX = (Math.random() * .4) - .2;
            this.directionY = (Math.random() * 2) + 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.originalColor = this.color; // 초기 색상 저장
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.strokeStyle = 'rgba(207, 170, 101, 0.8)';
            ctx.stroke();
            ctx.closePath();
        }
        update() {
            this.y -= this.directionY;
            this.x += this.directionX;
            if (this.y < 0 - this.radius) {
                this.y = canvas.height + this.radius;
                this.x = Math.random() * canvas.width;
            }
            this.draw();
        }
    }

    function initBubbles() {
        bubblesArray = [];
        for (let i = 0; i < 60; i++) {
            bubblesArray.push(new Bubble());
        }
    }

    function animateBubbles() {
        requestAnimationFrame(animateBubbles);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        bubblesArray.forEach(bubble => bubble.update());
    }

    initBubbles();
    animateBubbles();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initBubbles();
    });

    canvas.addEventListener('click', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        bubblesArray.forEach((bubble, index) => {
            const dist = Math.hypot(mouseX - bubble.x, mouseY - bubble.y);
            if (dist - bubble.radius < 1) {
                // 터지는 애니메이션 (예시: 사라지기)
                bubblesArray.splice(index, 1);
                // 새로운 비눗방울 추가
                bubblesArray.push(new Bubble()); 
            }
        });
    });

    // 인트로 가사 리스트
    const introQuotes = [
        "Make me lose my breath, make me water.",
        "Deeper than the ocean, so you can't see the bottom.",
        "Can we play truth or dare?",
        "Giving me butterflies, got me flying high.",
        "Dancing on the moon, I'm floating.",
        "I'm a piece of art.",
        "Face card never declines, my God.",
        "You can look, but don't touch.",
        "Always original, never a copy.",
        "Don't you treat me like a regular.",
        "You missed the chance to be my favorite.",
        "Dare you to forget we were ever almost there.",
        "You were my priority, now I'm a memory.",
        "I run away from love 'cause I'm scared.",
        "I need something safer.",
        "You never gave us a chance to last.",
        "Open up your heart, come take a seat.",
        "I just wanna feel you on my body.",
        "Got me wishing for more.",
        "In the middle of the night, you're the light.",
        "Put her in chanel"
    ];

    let currentIntroQuoteIndex = 0;

    function displayNextIntroQuote() {
        introQuoteText.style.opacity = '0'; // 페이드 아웃 시작
        setTimeout(() => {
            currentIntroQuoteIndex = (currentIntroQuoteIndex + 1) % introQuotes.length;
            introQuoteText.innerText = introQuotes[currentIntroQuoteIndex];
            introQuoteText.style.opacity = '1'; // 페이드 인 시작
        }, 1000); // 1초 후에 텍스트 변경 및 페이드 인
    }

    // 초기 가사 표시
    introQuoteText.innerText = introQuotes[currentIntroQuoteIndex];
    introQuoteText.style.opacity = '1'; // 처음엔 바로 보이도록

    // 10초마다 가사 변경 (CSS 애니메이션과 동기화)
    setInterval(displayNextIntroQuote, 10000); // 10초 = CSS @keyframes의 총 시간

    // 스페이스 바 이벤트 (메인 화면 진입)
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            const intro = document.getElementById('intro-canvas-layer');
            const main = document.getElementById('main-content');
            
            if (intro && main && !intro.classList.contains('fade-out')) {
                intro.classList.add('fade-out');
                main.classList.remove('hidden');
                setTimeout(() => main.classList.add('visible'), 100);
            }
        }
    });
}


// 3. 유튜브 IFrame API (LP 플레이어) (기존과 동일)
if (document.getElementById('youtube-player')) {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    let player;
    const videoIds = ['mGyN2NMuS4A', 'xiZUf98A1Ts', 'uLK2r3sG4lE', 'n3s6lDf8Nq0', 'XoiOOiuH8iI'];
    let currentVideoId = videoIds[Math.floor(Math.random() * videoIds.length)];

    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('youtube-player', {
            height: '100%',
            width: '100%',
            videoId: currentVideoId,
            playerVars: {
                'autoplay': 0,
                'controls': 1,
                'rel': 0,
                'playsinline': 1,
                'origin': window.location.origin
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    };

    function onPlayerReady(event) {
        updateTitle();
    }

    const playerSection = document.querySelector('.player-section');
    const titleText = document.getElementById('track-title');
    const playBtn = document.getElementById('play-pause-btn');

    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) {
            playerSection.classList.add('playing');
            playBtn.innerText = "일시정지";
            updateTitle();
        } else if (event.data === YT.PlayerState.PAUSED) {
            playerSection.classList.remove('playing');
            playBtn.innerText = "재생";
        } else if (event.data === YT.PlayerState.ENDED) {
            playNextTrack();
        }
    }

    function updateTitle() {
        if (player && player.getVideoData) {
            titleText.innerText = player.getVideoData().title;
        }
    }

    function playNextTrack() {
        let newId = videoIds[Math.floor(Math.random() * videoIds.length)];
        while(newId === currentVideoId) newId = videoIds[Math.floor(Math.random() * videoIds.length)];
        currentVideoId = newId;
        player.loadVideoById(currentVideoId);
    }

    playBtn.addEventListener('click', () => {
        const state = player.getPlayerState();
        if (state === 1) player.pauseVideo();
        else player.playVideo();
    });

    document.getElementById('next-track-btn').addEventListener('click', playNextTrack);
}


// 4. 메인 페이지 QUOTE GENERATOR SCRIPT (기존과 동일)
const quotes = [
    { text: "Make me sweat, make me hotter", source: "Water" },
    { text: "I'm the girl next door, but I'm not innocent", source: "Girl Next Door" },
    { text: "Johannesburg to the World", source: "Tyla" },
    { text: "Always been the one, been the muse", source: "Truth or Dare" },
    { text: "African music is going to take over", source: "Interview" },
    { text: "I just want to be a global star", source: "Tyla" },
    { text: "Can't get enough, I need more", source: "Safer" }
];

const quoteText = document.getElementById('quote-text');
const quoteSource = document.getElementById('quote-source');
const shuffleBtn = document.getElementById('shuffle-btn');

if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
        quoteText.classList.add('fade-out');
        quoteSource.classList.add('fade-out');

        setTimeout(() => {
            const random = Math.floor(Math.random() * quotes.length);
            quoteText.innerText = quotes[random].text;
            quoteSource.innerText = "- " + quotes[random].source + " -";
            quoteText.classList.remove('fade-out');
            quoteSource.classList.remove('fade-out');
        }, 500);
    });
}
