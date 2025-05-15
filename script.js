let slideIndex = 0; // 当前显示图片的索引，从0开始
let slides; // 将在 window.onload 中初始化
let musicPlayed = false; // 标记音乐是否已成功播放
let audioTrack; // 将在 window.onload 中获取音频元素

// 为事件监听器预定义处理函数，确保 addEventListener 和 removeEventListener 使用相同的函数引用
const handleClickForMusic = () => playMusicAfterInteraction('click'); // 点击事件的处理函数
const handleTouchForMusic = () => playMusicAfterInteraction('touchstart'); // 触摸开始事件的处理函数
const handleScrollForMusic = () => playMusicAfterInteraction('scroll'); // 滚动事件的处理函数

// 页面加载完成后执行的函数
window.onload = function() {
    slides = document.getElementsByClassName("slide"); // 获取所有幻灯片元素
    audioTrack = document.getElementById("backgroundMusic"); // 获取音频元素

    showSlides(); // 初始化并显示第一张幻灯片
    launchSubtleConfetti(); // 页面加载时触发纸屑效果

    if (audioTrack) { // 检查音频元素是否存在
        // 尝试自动播放音乐
        audioTrack.play().then(() => {
            musicPlayed = true; // 自动播放成功，标记音乐已播放
            console.log("背景音乐已自动开始播放。");
        }).catch(error => {
            // 自动播放失败（通常因为浏览器策略）
            console.log("背景音乐自动播放失败。将尝试通过用户交互播放。", error.name, error.message);
            // 为用户交互设置一次性事件监听器
            document.body.addEventListener('click', handleClickForMusic, { once: true });
            document.body.addEventListener('touchstart', handleTouchForMusic, { once: true, passive: true });
            window.addEventListener('scroll', handleScrollForMusic, { once: true, passive: true });
        });
    } else {
        console.error("未能找到ID为 'backgroundMusic' 的音频元素。");
    }

    // 原有的 tryPlayMusicAfterUserInteraction 和相关的直接 addEventListener 调用已被移除
    // createSparkles(30); // 已注释掉：创建指定数量的闪烁星星
};

// 用户交互后尝试播放音乐并清理监听器的函数
function playMusicAfterInteraction(eventType) {
    console.log(`用户交互事件触发: ${eventType}`); // 记录触发交互的事件类型
    if (!musicPlayed && audioTrack) { // 如果音乐尚未播放且音频元素存在
        audioTrack.play().then(() => {
            musicPlayed = true; // 音乐播放成功，更新标记
            console.log(`背景音乐在 ${eventType} 事件后成功开始播放。`);
            // 音乐已播放，移除所有相关的交互监听器，防止重复触发
            // 注意：触发此函数的监听器因 {once: true} 已自动移除，这里确保其他也移除
            document.body.removeEventListener('click', handleClickForMusic);
            document.body.removeEventListener('touchstart', handleTouchForMusic);
            window.removeEventListener('scroll', handleScrollForMusic);
        }).catch(error => {
            console.log(`在 ${eventType} 事件后尝试播放音乐失败:`, error.name, error.message);
            // 即使播放失败，对应的 {once: true} 监听器也已被移除
            // musicPlayed 保持 false，其他尚未触发的交互类型仍有机会
        });
    } else if (musicPlayed) {
        // 如果音乐已经播放了，理论上不应该再进入此函数（因为监听器会被移除）
        // 但作为保险措施，如果意外进入，也确保移除所有监听器
        console.log(`音乐已播放，忽略后续的 ${eventType} 事件。`);
        document.body.removeEventListener('click', handleClickForMusic);
        document.body.removeEventListener('touchstart', handleTouchForMusic);
        window.removeEventListener('scroll', handleScrollForMusic);
    }
}

// 自动轮播图片函数
function showSlides() {
    if (!slides || slides.length === 0) return; // 如果没有幻灯片，则不执行

    // 隐藏所有幻灯片
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slideIndex++; // 索引加1，切换到下一张
    // 如果索引超出图片总数，则回到第一张，实现循环
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }

    // 显示当前索引的幻灯片
    slides[slideIndex - 1].style.display = "flex"; // 新的方式，确保slide作为flex容器居中图片
    slides[slideIndex - 1].classList.add("fade"); // 添加淡入效果，如果CSS中定义了

    // 设置定时器，每隔一段时间切换图片（例如：3秒）
    setTimeout(showSlides, 3000); // 3000毫秒 = 3秒
}

// 恢复：触发微妙的纸屑效果函数
function launchSubtleConfetti() {
    if (typeof confetti !== 'function') { 
        console.warn('Confetti library is not loaded yet.');
        return;
    }

    const defaults = {
        startVelocity: 8,  
        spread: 270,       
        ticks: 250,        
        zIndex: 100,
        disableForReducedMotion: true,
        gravity: 0.7       
    };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const currentParticleCount = Math.floor(randomInRange(2, 5)); 

        confetti(Object.assign({}, defaults, {
            particleCount: currentParticleCount,
            origin: { 
                x: Math.random(), 
                y: Math.random() * 0.2 - 0.25 
            },
            colors: ['#FFC0CB', '#FFD700', '#FF69B4', '#ADD8E6', '#E6E6FA'],
            drift: randomInRange(-0.5, 0.5) 
        }));
    }, 250); 
}

/*
// 已注释掉：创建闪烁星星效果
function createSparkles(numberOfSparkles) {
    const sparkleContainer = document.body; // 星星将添加到body中，覆盖整个页面
    // 或者，如果您希望星星只在贺卡内部，可以考虑 document.querySelector('.card-container');
    // 但那样需要确保 .card-container 有 position: relative; 且星星的 position: absolute;

    for (let i = 0; i < numberOfSparkles; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');

        // 随机位置
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';

        // 随机大小 (可以非常小)
        const randomSize = Math.random() * 3 + 1; // 1px to 4px
        sparkle.style.width = randomSize + 'px';
        sparkle.style.height = randomSize + 'px';

        // 随机动画延迟，使闪烁不同步
        sparkle.style.animationDelay = Math.random() * 5 + 's'; // 0 to 5s delay
        // 随机动画时长，让一些星星闪烁快一些，一些慢一些
        sparkle.style.animationDuration = Math.random() * 1.5 + 0.5 + 's'; // 0.5s to 2s duration

        sparkleContainer.appendChild(sparkle);
    }
}
*/

// 注意：
// 1. 请确保您的图片路径在 index.html 中是正确的，并且图片文件存在于 'images' 文件夹中。
//    例如：<img src="images/image1.jpg" alt="温馨照片1">
// 2. 请确保您的音乐文件路径在 index.html 中是正确的，并且音乐文件存在于 'audio' 文件夹中。
//    例如：<source src="audio/background_music.mp3" type="audio/mpeg">
// 3. 由于现代浏览器的自动播放政策，音频/视频的自动播放可能会被阻止，直到用户与页面进行交互（如点击）。
//    上面的代码尝试了自动播放，并增加了一个点击后播放的备用方案。 