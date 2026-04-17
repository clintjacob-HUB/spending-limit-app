// Data
let monthlyLimit = 10000;
let totalSpent = 7000;
let currentStream = null;
let torchOn = false;

// Month selector variables
let currentYear = 2025;
let currentMonth = 3;

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Data for different months
const monthData = {
    "April 2025": { total: 7000, limit: 10000, transactions: [
        { date: "Apr 02", desc: "Grocery Store", amount: 1200 },
        { date: "Apr 02", desc: "Online Shop", amount: 800 },
        { date: "Apr 02", desc: "Restaurant", amount: 950 },
        { date: "Apr 02", desc: "Electric Bill", amount: 1500 }
    ]},
    "March 2025": { total: 8500, limit: 10000, transactions: [
        { date: "Mar 05", desc: "Groceries", amount: 2500 },
        { date: "Mar 10", desc: "Internet Bill", amount: 1500 },
        { date: "Mar 15", desc: "Restaurant", amount: 1200 },
        { date: "Mar 20", desc: "Shopping", amount: 2000 },
        { date: "Mar 25", desc: "Pharmacy", amount: 1300 }
    ]},
    "February 2025": { total: 6200, limit: 10000, transactions: [
        { date: "Feb 05", desc: "Groceries", amount: 2000 },
        { date: "Feb 10", desc: "Electric Bill", amount: 1500 },
        { date: "Feb 15", desc: "Dining", amount: 1200 },
        { date: "Feb 20", desc: "Shopping", amount: 1500 }
    ]},
    "January 2025": { total: 9100, limit: 10000, transactions: [
        { date: "Jan 05", desc: "Groceries", amount: 3000 },
        { date: "Jan 10", desc: "Water Bill", amount: 800 },
        { date: "Jan 15", desc: "Restaurant", amount: 1500 },
        { date: "Jan 20", desc: "Shopping", amount: 2000 },
        { date: "Jan 25", desc: "Pharmacy", amount: 1800 }
    ]},
    "December 2024": { total: 7800, limit: 10000, transactions: [
        { date: "Dec 05", desc: "Christmas Groceries", amount: 3500 },
        { date: "Dec 10", desc: "Gifts", amount: 2500 },
        { date: "Dec 15", desc: "Restaurant", amount: 1800 }
    ]}
};

// Amount increment/decrement
function incrementAmount() {
    let currentAmount = parseInt(document.getElementById('sliderAmount').innerText.replace(/,/g, ''));
    let newAmount = currentAmount + 500;
    if (newAmount <= 50000) {
        document.getElementById('sliderAmount').innerText = newAmount.toLocaleString();
        document.getElementById('limitSlider').value = newAmount;
    }
}

function decrementAmount() {
    let currentAmount = parseInt(document.getElementById('sliderAmount').innerText.replace(/,/g, ''));
    let newAmount = currentAmount - 500;
    if (newAmount >= 1000) {
        document.getElementById('sliderAmount').innerText = newAmount.toLocaleString();
        document.getElementById('limitSlider').value = newAmount;
    }
}

// Toggle checkbox with highlight - allows multiple selections
function toggleCheckbox(element) {
    element.classList.toggle('checked');
    const checkbox = element.querySelector('input[type="checkbox"]');
    if (checkbox) {
        checkbox.checked = !checkbox.checked;
    }
}

function updateHistoryDisplay() {
    const monthName = monthNames[currentMonth];
    const monthKey = `${monthName} ${currentYear}`;
    
    document.getElementById('currentMonthYear').innerHTML = `${monthName} ${currentYear}`;
    
    let data = monthData[monthKey];
    
    if (!data) {
        document.getElementById('historyTotalSpent').innerText = "0";
        document.getElementById('historyLimit').innerText = monthlyLimit;
        
        const transactionList = document.getElementById('transactionList');
        transactionList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #8e8e93;">
                <i class="fa-regular fa-calendar" style="font-size: 48px; margin-bottom: 16px; display: block;"></i>
                <p>No transactions for ${monthName} ${currentYear}</p>
            </div>
        `;
        return;
    }
    
    document.getElementById('historyTotalSpent').innerText = data.total.toLocaleString();
    document.getElementById('historyLimit').innerText = data.limit.toLocaleString();
    
    const transactionList = document.getElementById('transactionList');
    transactionList.innerHTML = '';
    
    let lastDate = '';
    data.transactions.forEach(trans => {
        if (trans.date !== lastDate) {
            const dateDiv = document.createElement('div');
            dateDiv.className = 'transaction-date';
            dateDiv.innerText = trans.date;
            transactionList.appendChild(dateDiv);
            lastDate = trans.date;
        }
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'transaction-item';
        itemDiv.innerHTML = `<span>${trans.desc}</span><span>₱ ${trans.amount.toLocaleString()}</span>`;
        transactionList.appendChild(itemDiv);
    });
}

function changeMonth(direction) {
    currentMonth += direction;
    
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    
    if (currentYear < 2024) {
        currentYear = 2024;
        currentMonth = 0;
    }
    
    if (currentYear > 2025) {
        currentYear = 2025;
        currentMonth = 3;
    }
    
    updateHistoryDisplay();
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    
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
    
    if (screenId === 'homeScreen') {
        checkAndShowLimitWarning();
    }
    
    if (screenId === 'historyScreen') {
        updateHistoryDisplay();
    }
}

function updateDashboard() {
    const remaining = monthlyLimit - totalSpent;
    const percentage = (totalSpent / monthlyLimit) * 100;
    
    document.getElementById('displayLimit').innerText = monthlyLimit.toLocaleString();
    document.getElementById('displaySpent').innerText = totalSpent.toLocaleString();
    document.getElementById('displayRemaining').innerText = remaining.toLocaleString();
    document.getElementById('homeProgressFill').style.width = `${Math.min(percentage, 100)}%`;
    
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

function showEditLimit() {
    document.getElementById('sliderAmount').innerText = monthlyLimit.toLocaleString();
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

function resetApp() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }
    monthlyLimit = 10000;
    totalSpent = 7000;
    updateDashboard();
    showScreen('homeScreen');
}

// Initialize
updateDashboard();

// Clean up camera when leaving QR screen
const observer = new MutationObserver(() => {
    const qrScreen = document.getElementById('qrScreen');
    if (!qrScreen.classList.contains('active') && currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
    }
});
observer.observe(document.getElementById('screenContainer'), { attributes: true, childList: true, subtree: true });
