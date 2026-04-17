// Data
let monthlyLimit = 10000;
let totalSpent = 7000;
let currentStream = null;
let torchOn = false;

// Screen Navigation
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    
    // Update bottom nav active state
    updateActiveNav(screenId);
    
    // Check if limit is reached
    if (screenId === 'homeScreen') {
        checkAndShowLimitWarning();
    }
}

function updateActiveNav(screenId) {
    const navItems = document.querySelectorAll('.nav-item');
    const screenToNav = {
        'homeScreen': 0,
        'inboxScreen': 1,
        'qrScreen': 2,
        'historyScreen': 3,
        'profileScreen': 4
    };
    
    navItems.forEach((item, index) => {
        if (index === screenToNav[screenId]) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Update Dashboard
function updateDashboard() {
    const remaining = monthlyLimit - totalSpent;
    const percentage = (totalSpent / monthlyLimit) * 100;
    
    document.getElementById('displayLimit').innerText = monthlyLimit.toLocaleString();
    document.getElementById('displaySpent').innerText = totalSpent.toLocaleString();
    document.getElementById('displayRemaining').innerText = remaining.toLocaleString();
    document.getElementById('homeProgressFill').style.width = `${Math.min(percentage, 100)}%`;
    
    // Change colors based on limit status
    const limitCard = document.querySelector('.limit-card');
    const statusText = document.querySelector('.status-text');
    
    if (totalSpent > monthlyLimit) {
        limitCard.style.border = '2px solid #FF3B30';
        statusText.innerHTML = 'Limit Reached <i class="fa-regular fa-circle-exclamation"></i>';
        statusText.style.background = '#FF3B3020';
        statusText.style.color = '#FF3B30';
        document.getElementById('homeProgressFill').style.background = '#FF3B30';
    } else if (remaining <= monthlyLimit * 0.1) {
        limitCard.style.border = '2px solid #FF9500';
        statusText.innerHTML = 'Almost Reached ⚠️';
        statusText.style.background = '#FF950020';
        statusText.style.color = '#FF9500';
        document.getElementById('homeProgressFill').style.background = '#FF9500';
    } else {
        limitCard.style.border = 'none';
        statusText.innerHTML = 'Within Limit <i class="fa-regular fa-circle-check"></i>';
        statusText.style.background = '#34C75920';
        statusText.style.color = '#34C759';
        document.getElementById('homeProgressFill').style.background = '#007AFF';
    }
}

// Edit Limit Functions
function showEditLimit() {
    document.getElementById('sliderAmount').innerText = monthlyLimit;
    document.getElementById('limitSlider').value = monthlyLimit;
    showScreen('editLimitScreen');
}

function updateSliderAmount(value) {
    document.getElementById('sliderAmount').innerText = parseInt(value).toLocaleString();
}

function saveNewLimit() {
    const newLimit = parseInt(document.getElementById('limitSlider').value);
    monthlyLimit = newLimit;
    updateDashboard();
    showScreen('homeScreen');
}

function selectPeriod(period) {
    document.querySelectorAll('.period-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Warning and Limit Functions
function checkAndShowLimitWarning() {
    const remaining = monthlyLimit - totalSpent;
    
    if (totalSpent > monthlyLimit) {
        showScreen('limitReachedScreen');
        document.getElementById('exceedLimit').innerText = monthlyLimit;
        document.getElementById('exceedSpent').innerText = totalSpent;
    } else if (remaining <= 1000 && remaining > 0) {
        document.getElementById('warningRemaining').innerText = remaining;
        document.getElementById('warningModal').classList.add('active');
    }
}

function showWarning() {
    const remaining = monthlyLimit - totalSpent;
    document.getElementById('warningRemaining').innerText = remaining;
    document.getElementById('warningModal').classList.add('active');
}

function closeWarning() {
    document.getElementById('warningModal').classList.remove('active');
}

function closeWarningAndReview() {
    document.getElementById('warningModal').classList.remove('active');
    showScreen('historyScreen');
}

function pauseLimit() {
    alert('Limit paused temporarily. You can continue spending without restrictions until you resume.');
}

// QR Scanner Functions
async function startQRScanner() {
    showScreen('qrScreen');
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        const video = document.getElementById('camera');
        video.srcObject = stream;
        currentStream = stream;
    } catch (err) {
        console.error('Camera error:', err);
        alert('Unable to access camera. Please check permissions.');
    }
}

function toggleTorch() {
    if (currentStream) {
        const track = currentStream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();
        
        if (capabilities.torch) {
            torchOn = !torchOn;
            track.applyConstraints({ advanced: [{ torch: torchOn }] });
        } else {
            alert('Torch not available on this device');
        }
    }
}

// Reset app (logout)
function resetApp() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }
    monthlyLimit = 10000;
    totalSpent = 7000;
    updateDashboard();
    showScreen('homeScreen');
}

// Simulate adding expense (for testing)
function addExpense(amount) {
    totalSpent += amount;
    updateDashboard();
    checkAndShowLimitWarning();
}

// Initialize
updateDashboard();

// Handle camera cleanup when leaving QR screen
const observer = new MutationObserver(() => {
    const qrScreen = document.getElementById('qrScreen');
    if (!qrScreen.classList.contains('active') && currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
    }
});
observer.observe(document.getElementById('screenContainer'), { attributes: true, childList: true, subtree: true });