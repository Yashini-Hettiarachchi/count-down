document.addEventListener('DOMContentLoaded', function() {
    // Music controls
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const musicText = musicToggle.querySelector('.music-text');
    let isMusicPlaying = false;

    // Function to initialize music
    function initializeMusic() {
        // Set initial volume
        bgMusic.volume = 0.5; // Set to 50% volume for better user experience
        
        // Try to autoplay
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            musicToggle.classList.add('playing');
            musicText.textContent = 'Pause Music';
        }).catch(error => {
            console.log('Autoplay prevented:', error);
            // If autoplay is blocked, update UI to show play state
            isMusicPlaying = false;
            musicToggle.classList.remove('playing');
            musicText.textContent = 'Play Music';
        });
    }

    // Function to toggle music
    function toggleMusic() {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
            musicText.textContent = 'Play Music';
        } else {
            bgMusic.play().catch(error => {
                console.log('Playback prevented:', error);
            });
            musicToggle.classList.add('playing');
            musicText.textContent = 'Pause Music';
        }
        isMusicPlaying = !isMusicPlaying;
    }

    // Initialize music when page loads
    initializeMusic();

    // Add click event to music toggle button
    musicToggle.addEventListener('click', toggleMusic);

    // Check if we're on the door page
    const doorsContainer = document.querySelector('.doors-container');
    if (doorsContainer) {
        const leftDoor = document.querySelector('.left-door');
        const rightDoor = document.querySelector('.right-door');
        const openButton = document.getElementById('openDoors');
        let doorsOpened = false;

        // Add hover effect to doors
        [leftDoor, rightDoor].forEach(door => {
            door.addEventListener('mouseenter', () => {
                if (!doorsOpened) {
                    door.style.transform = door.classList.contains('left-door') 
                        ? 'rotateY(-10deg)' 
                        : 'rotateY(10deg)';
                }
            });

            door.addEventListener('mouseleave', () => {
                if (!doorsOpened) {
                    door.style.transform = 'rotateY(0deg)';
                }
            });
        });

        // Add sparkle effect to button
        openButton.addEventListener('mousemove', (e) => {
            const rect = openButton.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            openButton.style.setProperty('--x', `${x}px`);
            openButton.style.setProperty('--y', `${y}px`);
        });

        // Function to open doors and navigate
        function openDoorsAndNavigate() {
            if (doorsOpened) return;
            doorsOpened = true;

            // Add opening sound effect
            const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
            audio.volume = 0.2;
            audio.play().catch(() => {}); // Ignore if autoplay is blocked

            // Add particle effect
            createParticles();

            // Animate doors
            leftDoor.classList.add('open-left');
            rightDoor.classList.add('open-right');

            // Add shine effect to button
            openButton.style.animation = 'buttonShine 1s ease-in-out';

            // Fade out music before navigation
            if (isMusicPlaying) {
                const fadeOut = setInterval(() => {
                    if (bgMusic.volume > 0.1) {
                        bgMusic.volume -= 0.1;
                    } else {
                        clearInterval(fadeOut);
                        bgMusic.pause();
                        bgMusic.volume = 1.0;
                    }
                }, 100);
            }

            // Navigate to tribute page after animation
            setTimeout(() => {
                window.location.href = 'tribute.html';
            }, 2000);
        }

        // Create particle effect
        function createParticles() {
            const container = document.querySelector('.container');
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.cssText = `
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    background: radial-gradient(circle, #FFD700 0%, transparent 70%);
                    border-radius: 50%;
                    pointer-events: none;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    animation: particleAnimation ${1 + Math.random()}s ease-out forwards;
                `;
                container.appendChild(particle);

                // Remove particle after animation
                setTimeout(() => particle.remove(), 2000);
            }
        }

        // Add particle animation to styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleAnimation {
                0% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 1;
                }
                100% {
                    transform: translate(
                        calc(-50% + ${(Math.random() - 0.5) * 200}px),
                        calc(-50% + ${(Math.random() - 0.5) * 200}px)
                    ) scale(1);
                    opacity: 0;
                }
            }
            @keyframes buttonShine {
                0% { background-position: -100% 0; }
                100% { background-position: 200% 0; }
            }
        `;
        document.head.appendChild(style);

        // Event listeners for doors and button
        leftDoor.addEventListener('click', openDoorsAndNavigate);
        rightDoor.addEventListener('click', openDoorsAndNavigate);
        openButton.addEventListener('click', openDoorsAndNavigate);
    }

    // Check if we're on the tribute page
    const tributePage = document.querySelector('.tribute-page');
    if (tributePage) {
        // Add floating animation to content
        const contentWrapper = document.querySelector('.content-wrapper');
        contentWrapper.style.animation = 'float 6s ease-in-out infinite';

        // Add floating animation to styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(style);

        // Add staggered fade-in effect to elements with parallax
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.4}s`;
            
            // Add parallax effect on mouse move
            document.addEventListener('mousemove', (e) => {
                const { clientX, clientY } = e;
                const { innerWidth, innerHeight } = window;
                const x = (clientX / innerWidth - 0.5) * 20;
                const y = (clientY / innerHeight - 0.5) * 20;
                
                element.style.transform = `translate(${x}px, ${y}px)`;
            });
        });

        // Add gentle hover effect to message sections
        const sections = document.querySelectorAll('.message-section, .poem-section');
        sections.forEach(section => {
            section.addEventListener('mouseenter', () => {
                section.style.transform = 'translateY(-5px) scale(1.02)';
            });
            section.addEventListener('mouseleave', () => {
                section.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Birthday countdown functionality
    function updateCountdown() {
        // Get current time in Sri Lanka timezone (UTC+5:30)
        const now = new Date();
        const sriLankaTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
        
        const currentYear = sriLankaTime.getFullYear();
        const birthday = new Date(currentYear, 5, 25); // June 25 (month is 0-based)
        
        // Calculate the difference in milliseconds
        const diff = birthday - sriLankaTime;
        
        // Check if it's birthday today in Sri Lanka
        const isBirthday = sriLankaTime.getDate() === 25 && sriLankaTime.getMonth() === 5;
        
        const countdownElement = document.getElementById('countdown');
        const birthdayMessageElement = document.getElementById('birthday-message');
        
        if (isBirthday) {
            if (countdownElement) countdownElement.style.display = 'none';
            if (birthdayMessageElement) birthdayMessageElement.style.display = 'block';
            return;
        }
        
        // Calculate time units
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // Update the countdown display
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        if (daysElement) daysElement.textContent = String(days).padStart(2, '0');
        if (hoursElement) hoursElement.textContent = String(hours).padStart(2, '0');
        if (minutesElement) minutesElement.textContent = String(minutes).padStart(2, '0');
        if (secondsElement) secondsElement.textContent = String(seconds).padStart(2, '0');
    }

    // Only run countdown on the first page
    if (document.querySelector('.container')) {
        // Update countdown every second
        setInterval(updateCountdown, 1000);
        updateCountdown(); // Initial call
    }
}); 