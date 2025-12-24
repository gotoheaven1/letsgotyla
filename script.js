/* =========================================
   1. 커스텀 커서 설정
   ========================================= */
const cursorDot = document.querySelector('.cursor-dot');
const cursorCircle = document.querySelector('.cursor-circle');

// 커서 요소가 있을 때만 실행하여 오류 방지
if (cursorDot && cursorCircle) {
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
}

/* =========================================
   2. 인트로 비눗방울 애니메이션
   ========================================= */
const canvas = document.getElementById('bubbleCanvas');
if (canvas) {
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
                bubblesArray.splice(index, 1);
                bubblesArray.push(new Bubble());
            }
        });
    });

    // 스페이스 바 진입 이벤트
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

/* =========================================
   3. 유튜브 IFrame API (오류 해결 강화판)
   ========================================= */
if (document.getElementById('youtube-player')) {
    // API 스크립트 로드
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    let player;
    // 요청하신 기존 영상 ID들
    const videoIds = ['mGyN2NMuS4A', 'xiZUf98A1Ts', 'uLK2r3sG4lE', 'n3s6lDf8Nq0', 'XoiOOiuH8iI'];
    let currentVideoId = videoIds[Math.floor(Math.random() * videoIds.length)];

    // API 준비 완료 시 호출
    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('youtube-player', {
            height: '100%',
            width: '100%',
            videoId: currentVideoId,
            host: 'https://www.youtube.com', // 보안 설정 강화
            playerVars: {
                'autoplay': 0, 
                'controls': 1,
                'rel': 0,
                'playsinline': 1,
                'enablejsapi': 1,
                // 중요: 로컬에서 실행 시 origin이 없어서 오류가 날 수 있음.
                // 웹서버(Live Server) 사용 필수
                'origin': window.location.origin 
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError // [핵심] 오류 발생 시 처리 함수 추가
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
            if(playerSection) playerSection.classList.add('playing');
            if(playBtn) playBtn.innerText = "일시정지";
            updateTitle();
        } else if (event.data === YT.PlayerState.PAUSED) {
            if(playerSection) playerSection.classList.remove('playing');
            if(playBtn) playBtn.innerText = "재생";
        } else if (event.data === YT.PlayerState.ENDED) {
            playNextTrack();
        }
    }

    // [핵심 해결책] 오류 발생 시(153번 등) 자동으로 다음 곡 재생
    function onPlayerError(event) {
        console.warn(`영상 재생 오류 발생 (Code: ${event.data}). 다음 곡으로 넘어갑니다.`);
        // 오류가 뜬 영상은 건너뛰고 바로 다음 곡 실행
        setTimeout(() => {
            playNextTrack();
        }, 1000); // 1초 뒤 다음 곡 (너무 빠르면 무한 루프 위험 방지)
    }

    function updateTitle() {
        if (player && player.getVideoData) {
            const data = player.getVideoData();
            if(titleText && data.title) {
                titleText.innerText = data.title;
            }
        }
    }

    function playNextTrack() {
        let newId = videoIds[Math.floor(Math.random() * videoIds.length)];
        // 같은 곡 반복 방지 (곡이 1개면 제외)
        if (videoIds.length > 1) {
            while(newId === currentVideoId) {
                newId = videoIds[Math.floor(Math.random() * videoIds.length)];
            }
        }
        currentVideoId = newId;
        player.loadVideoById(currentVideoId);
    }

    // 버튼 이벤트 연결
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (!player) return;
            const state = player.getPlayerState();
            if (state === 1) player.pauseVideo();
            else player.playVideo();
        });
    }

    const nextBtn = document.getElementById('next-track-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', playNextTrack);
    }
}