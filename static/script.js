// Typewriter effect
const typewriterText = "Analyze the sentiment of any text instantly. Our AI-powered tool helps you understand emotions in comments, reviews, and feedback.";
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const element = document.getElementById('typewriterText');
    
    if (!isDeleting && charIndex <= typewriterText.length) {
        element.textContent = typewriterText.substring(0, charIndex);
        charIndex++;
        setTimeout(typeWriter, 50);
    } else if (charIndex > typewriterText.length) {
        setTimeout(() => {
            charIndex = 0;
            typeWriter();
        }, 3000);
    }
}

// Scroll animation with back and forth
let isOnFormSection = false;

function handleScroll() {
    const scrollPosition = window.scrollY;
    const threshold = window.innerHeight * 0.5;
    
    const introSection = document.getElementById('introSection');
    const formSection = document.getElementById('formSection');
    
    if (scrollPosition > threshold && !isOnFormSection) {
        // Scroll down - show form
        isOnFormSection = true;
        introSection.classList.add('slide-out');
        formSection.classList.add('slide-in');
        
        setTimeout(() => {
            document.getElementById('comment').focus();
        }, 400);
    } else if (scrollPosition <= threshold && isOnFormSection) {
        // Scroll up - show intro
        isOnFormSection = false;
        introSection.classList.remove('slide-out');
        formSection.classList.remove('slide-in');
    }
}

window.addEventListener('scroll', handleScroll);

// Smooth scroll behavior on wheel
let lastScrollTime = 0;
window.addEventListener('wheel', (e) => {
    const now = Date.now();
    if (now - lastScrollTime < 50) return;
    lastScrollTime = now;
    
    if (e.deltaY > 0) {
        window.scrollBy({ top: 100, behavior: 'smooth' });
    } else {
        window.scrollBy({ top: -100, behavior: 'smooth' });
    }
}, { passive: true });

// Back button functionality
function goBack() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Start typewriter on load
window.addEventListener('load', function() {
    typeWriter();
});

// Toggle analyze button based on input
function toggleAnalyzeButton() {
    const comment = document.getElementById('comment').value.trim();
    const analyzeBtn = document.getElementById('analyzeBtn');
    analyzeBtn.disabled = comment.length === 0;
}

async function analyzeSentiment() {
    const commentInput = document.getElementById('comment');
    const comment = commentInput.value.trim();
    
    // Validate input
    if (!comment) {
        return;
    }
    
    // Hide previous results and errors
    document.getElementById('result').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    document.getElementById('loading').style.display = 'block';
    document.getElementById('analyzeBtn').disabled = true;
    
    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ comment: comment })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'An error occurred');
        }
        
        displayResult(data);
        
    } catch (error) {
        showError(error.message);
    } finally {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('analyzeBtn').disabled = false;
    }
}

function displayResult(data) {
    const resultDiv = document.getElementById('result');
    const sentimentBadge = document.getElementById('sentimentBadge');
    const sentiment = data.sentiment.toLowerCase();
    
    sentimentBadge.textContent = data.sentiment.toUpperCase();
    sentimentBadge.className = 'result-badge ' + sentiment;
    
    resultDiv.style.display = 'block';
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// Trigger analysis on Enter key (Shift+Enter for new line)
window.addEventListener('load', function() {
    document.getElementById('comment').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            analyzeSentiment();
        }
    });
});
