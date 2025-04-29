document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const gameArea = document.getElementById('game-area');
    const scoreElement = document.getElementById('score');
    const finalScoreElement = document.getElementById('final-score');
    const gameOverScreen = document.getElementById('game-over');
    const startScreen = document.getElementById('start-screen');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');

    // Game variables
    let score = 0;
    let gameRunning = false;
    let bubbleInterval;
    let difficultyInterval;
    let bubbleSpeed = 8; // Initial animation duration in seconds
    let bubbleRate = 1500; // Initial bubble generation rate in milliseconds
    let minBubbleSize = 30;
    let maxBubbleSize = 80;

    // Colors for bubbles - more vibrant and varied
    const bubbleColors = [
        'rgba(255, 99, 132, 0.8)',   // Pink
        'rgba(54, 162, 235, 0.8)',    // Blue
        'rgba(255, 206, 86, 0.8)',    // Yellow
        'rgba(75, 192, 192, 0.8)',    // Teal
        'rgba(153, 102, 255, 0.8)',   // Purple
        'rgba(255, 159, 64, 0.8)',    // Orange
        'rgba(46, 204, 113, 0.8)',    // Green
        'rgba(52, 152, 219, 0.8)',    // Light Blue
        'rgba(155, 89, 182, 0.8)',    // Violet
        'rgba(241, 196, 15, 0.8)',    // Amber
        'rgba(231, 76, 60, 0.8)',     // Red
        'rgba(26, 188, 156, 0.8)'     // Turquoise
    ];

    // Start game
    function startGame() {
        score = 0;
        scoreElement.textContent = score;
        gameRunning = true;
        startScreen.classList.add('hidden');
        gameOverScreen.classList.add('hidden');

        // Clear any existing bubbles
        gameArea.innerHTML = '';

        // Start generating bubbles
        bubbleInterval = setInterval(createBubble, bubbleRate);

        // Increase difficulty over time
        difficultyInterval = setInterval(increaseDifficulty, 10000); // Every 10 seconds
    }

    // Create a bubble
    function createBubble() {
        if (!gameRunning) return;

        const bubble = document.createElement('div');
        bubble.classList.add('bubble');

        // Random size
        const size = Math.floor(Math.random() * (maxBubbleSize - minBubbleSize + 1)) + minBubbleSize;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;

        // Random position (x-axis)
        const maxX = gameArea.clientWidth - size;
        const randomX = Math.floor(Math.random() * maxX);
        bubble.style.left = `${randomX}px`;
        bubble.style.bottom = '-100px'; // Start below the visible area

        // Random color with custom gradient
        const colorIndex = Math.floor(Math.random() * bubbleColors.length);
        const bubbleColor = bubbleColors[colorIndex];

        // Create a more realistic bubble appearance with custom gradient
        bubble.style.background = `radial-gradient(circle at 30% 30%,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(255, 255, 255, 0.6) 10%,
            ${bubbleColor} 50%,
            ${bubbleColor.replace('0.8', '0.9')} 100%)`;

        // Add a slight random rotation for more natural movement
        const randomRotation = Math.floor(Math.random() * 20) - 10;
        bubble.style.transform = `rotate(${randomRotation}deg)`;

        // Set animation duration based on current speed
        bubble.style.animationDuration = `${bubbleSpeed}s`;

        // Add click event to pop the bubble
        bubble.addEventListener('click', () => {
            if (!gameRunning) return;

            // Calculate points based on bubble size (smaller bubbles = more points)
            const points = Math.max(1, Math.floor((maxBubbleSize - size) / 5) + 1);
            score += points;
            scoreElement.textContent = score;

            // Add score popup
            const rect = bubble.getBoundingClientRect();
            const gameAreaRect = gameArea.getBoundingClientRect();

            const scorePopup = document.createElement('div');
            scorePopup.classList.add('score-popup');
            scorePopup.textContent = `+${points}`;
            scorePopup.style.left = `${rect.left - gameAreaRect.left + (size / 2)}px`;
            scorePopup.style.top = `${rect.top - gameAreaRect.top + (size / 2)}px`;

            // Add pulse animation to score container
            scoreElement.parentElement.classList.add('pulse');
            setTimeout(() => {
                scoreElement.parentElement.classList.remove('pulse');
            }, 300);

            gameArea.appendChild(scorePopup);
            setTimeout(() => {
                if (scorePopup.parentNode) {
                    scorePopup.parentNode.removeChild(scorePopup);
                }
    }, 1000);

    // Play pop sound effect
    const popSound = new Audio('assets/pop.mp3');
    popSound.play();

    // Pop animation
    bubble.classList.add('pop');
    setTimeout(() => {
                if (bubble.parentNode) {
                    bubble.parentNode.removeChild(bubble);
                }
            }, 400);
        });

        gameArea.appendChild(bubble);

        // Set a data attribute to track this bubble
        bubble.setAttribute('data-tracked', 'true');

        // Remove bubble after animation completes
        setTimeout(() => {
            if (bubble.parentNode && !bubble.classList.contains('pop')) {
                bubble.parentNode.removeChild(bubble);
            }
        }, bubbleSpeed * 1000);
    }

    // Increase game difficulty
    function increaseDifficulty() {
        if (!gameRunning) return;

        // Increase bubble generation rate (decrease interval)
        bubbleRate = Math.max(500, bubbleRate - 100);
        clearInterval(bubbleInterval);
        bubbleInterval = setInterval(createBubble, bubbleRate);

        // Speed up bubbles
        bubbleSpeed = Math.max(3, bubbleSpeed - 0.5);
    }

    // End game
    function endGame(escapedBubble) {
        gameRunning = false;
        clearInterval(bubbleInterval);
        clearInterval(difficultyInterval);

        // Reset difficulty for next game
        bubbleSpeed = 8;
        bubbleRate = 1500;

        // Highlight the escaped bubble if provided
        if (escapedBubble) {
            highlightEscapedBubble(escapedBubble);
        }

        finalScoreElement.textContent = score;
        gameOverScreen.classList.remove('hidden');
    }

    // Highlight the bubble that escaped
    function highlightEscapedBubble(bubble) {
        // Add a visual effect to show which bubble escaped
        bubble.style.boxShadow = '0 0 20px 10px rgba(255, 0, 0, 0.7)';
        bubble.style.zIndex = '100';

        // Add a pulsing animation
        bubble.animate([
            { boxShadow: '0 0 20px 10px rgba(255, 0, 0, 0.7)' },
            { boxShadow: '0 0 30px 15px rgba(255, 0, 0, 0.9)' },
            { boxShadow: '0 0 20px 10px rgba(255, 0, 0, 0.7)' }
        ], {
            duration: 800,
            iterations: 3
        });
    }

    // Check if bubbles have reached the top
    function checkGameOver() {
        if (!gameRunning) return;

        const bubbles = document.querySelectorAll('.bubble:not(.pop)');
        const gameAreaRect = gameArea.getBoundingClientRect();

        for (const bubble of bubbles) {
            const bubbleRect = bubble.getBoundingClientRect();

            // Check if the top of the bubble has reached or gone above the top of the game area
            // We use a small buffer (5px) to make sure it's visibly at the top
            if (bubbleRect.top <= gameAreaRect.top + 5) {
                // If a bubble has reached the top of the screen, end the game
                endGame(bubble);
                return;
            }
        }

        requestAnimationFrame(checkGameOver);
    }

    // Event listeners
    startButton.addEventListener('click', () => {
        startGame();
        requestAnimationFrame(checkGameOver);
    });

    restartButton.addEventListener('click', () => {
        startGame();
        requestAnimationFrame(checkGameOver);
    });

    // Touch support for mobile devices
    gameArea.addEventListener('touchstart', (e) => {
        if (!gameRunning) return;

        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);

        if (element && element.classList.contains('bubble')) {
            element.click();
            e.preventDefault(); // Prevent default touch behavior
        }
    }, { passive: false });
});
