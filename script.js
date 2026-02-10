// ================== DOM ELEMENTS ==================
const faqBtn = document.getElementById("faqBtn");
const faqModal = document.getElementById("faqModal");
const closeFaq = document.getElementById("closeFaq");
const landSizeInput = document.getElementById("landSizeInput");

const locationStatus = document.getElementById("locationStatus");
const locationSection = document.getElementById("locationSection");
const manualLocationInputs = document.getElementById("manualLocationInputs");
const analyseBtn = document.getElementById("analyseBtn");
const analyseBtnText = document.getElementById("analyseBtnText");


const confirmBtn = document.getElementById("confirmLocation");

const imageBtn = document.getElementById("imageBtn");
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const previewImg = document.getElementById("previewImg");
const imageStatusText = document.getElementById("imageStatusText");
const imageFileName = document.getElementById("imageFileName");

const loadingSpinner = document.getElementById("loadingSpinner");
const summarySection = document.getElementById("summarySection");
const summaryText = document.getElementById("summaryText");
const downloadBtn = document.getElementById("downloadBtn");
const stateInput = document.getElementById("stateInput");
const stateDropdown = document.getElementById("stateDropdown");

const districtInput = document.getElementById("districtInput");
const districtDropdown = document.getElementById("districtDropdown");

const tableSection = document.getElementById("tableSection");
const cropTableBody = document.getElementById("cropTableBody");
const chartSection = document.getElementById("chartSection");
const riskChartCanvas = document.getElementById("riskChart");

// ================== GLOBAL STATE ==================
let appState = {
    location: null,
    locationMethod: null, // 'gps' or 'manual'
    image: null,
    imageFile: null,
    result: null
};

let currentUnit = 'acres'; // 'acres' or 'hectares'
let chatOpen = false;
let chatFullscreen = false;
let currentLang = 'en'; // 'en' or 'hi'

// ================== LANGUAGE TRANSLATIONS ==================
const translations = {
    en: {
        heroTitle: 'Soil Doctor',
        heroSub: 'Upload soil image & check health',
        landSizeTitle: 'Land Size',
        landSizeSub: 'Enter your farm area',
        unitLabel: 'Unit:',
        acresBtn: 'Acres',
        hectaresBtn: 'Hectares',
        landSizeTip: 'This helps calculate accurate yield and revenue estimates',
        uploadTitle: 'Upload Soil Photo',
        locationTitle: 'Location Details',
        detectingGps: 'Detecting GPS...',
        stateLabel: 'State',
        districtLabel: 'District',
        statePlaceholder: 'Type state name',
        districtPlaceholder: 'Type district name',
        confirmLocation: 'Confirm Location',
        analyseBtn: 'Analyse Soil Health',
        analysing: 'Analyzing...',
        analysisComplete: 'Analysis Complete',
        loadingMsg: 'Analyzing soil and climate data...',
        fieldReport: 'Field Report',
        soilAnalysis: 'Soil Analysis',
        soilType: 'Soil Type:',
        weatherConditions: 'Weather & Season',
        temperature: 'Temperature',
        humidity: 'Humidity',
        annualRainfall: 'Annual Rainfall',
        season: 'Season',
        bestCrop: 'Best Crop Recommendation',
        recommended: 'Recommended:',
        seeFullTable: 'See the full comparison table below for all crop options.',
        farmDetails: 'Farm Details',
        locationLabel: 'Location:',
        landSizeLabel: 'Land Size:',
        downloadReport: 'Download Report as PDF',
        cropComparison: 'Crop Comparison',
        cropCol: 'Crop',
        suitabilityCol: 'Suitability %',
        yieldCol: 'Yield (tons)',
        revenueCol: 'Revenue (₹)',
        riskReward: 'Risk vs Reward Analysis',
        startOver: 'Start New Analysis',
        faqTitle: 'Frequently Asked Questions',
        chatTitle: 'Agri-Expert AI',
        chatSub: 'Ask about your recommendations',
        chatPlaceholder: 'Ask: Why did you recommend rice?',
        photoUploaded: 'Photo uploaded',
        optimalCropBadge: 'Most Optimal Crop',
        projectedRevenue: 'Projected Revenue',
        suitabilityScore: 'Suitability Score',
        climateMatch: 'Climate & soil match',
        expectedYield: 'Expected Yield:',
        langToggle: 'हिंदी'
    },
    hi: {
        heroTitle: 'मिट्टी डॉक्टर',
        heroSub: 'मिट्टी की तस्वीर अपलोड करें और स्वास्थ्य जांचें',
        landSizeTitle: 'भूमि का आकार',
        landSizeSub: 'अपने खेत का क्षेत्रफल दर्ज करें',
        unitLabel: 'इकाई:',
        acresBtn: 'एकड़',
        hectaresBtn: 'हेक्टेयर',
        landSizeTip: 'यह सटीक उपज और राजस्व अनुमान की गणना में मदद करता है',
        uploadTitle: 'मिट्टी की तस्वीर अपलोड करें',
        locationTitle: 'स्थान विवरण',
        detectingGps: 'GPS का पता लगा रहे हैं...',
        stateLabel: 'राज्य',
        districtLabel: 'जिला',
        statePlaceholder: 'राज्य का नाम टाइप करें',
        districtPlaceholder: 'जिले का नाम टाइप करें',
        confirmLocation: 'स्थान की पुष्टि करें',
        analyseBtn: 'मिट्टी स्वास्थ्य विश्लेषण',
        analysing: 'विश्लेषण हो रहा है...',
        analysisComplete: 'विश्लेषण पूर्ण',
        loadingMsg: 'मिट्टी और जलवायु डेटा का विश्लेषण...',
        fieldReport: 'क्षेत्र रिपोर्ट',
        soilAnalysis: 'मिट्टी विश्लेषण',
        soilType: 'मिट्टी का प्रकार:',
        weatherConditions: 'मौसम और ऋतु',
        temperature: 'तापमान:',
        humidity: 'आर्द्रता:',
        annualRainfall: 'वार्षिक वर्षा:',
        season: 'ऋतु:',
        bestCrop: 'सर्वश्रेष्ठ फसल सिफारिश',
        recommended: 'अनुशंसित:',
        seeFullTable: 'सभी फसल विकल्पों के लिए नीचे पूरी तुलना तालिका देखें।',
        farmDetails: 'खेत विवरण',
        locationLabel: 'स्थान:',
        landSizeLabel: 'भूमि का आकार:',
        downloadReport: 'रिपोर्ट PDF में डाउनलोड करें',
        cropComparison: 'फसल तुलना',
        cropCol: 'फसल',
        suitabilityCol: 'उपयुक्तता %',
        yieldCol: 'उपज (टन)',
        revenueCol: 'राजस्व (₹)',
        riskReward: 'जोखिम बनाम लाभ विश्लेषण',
        startOver: 'नया विश्लेषण शुरू करें',
        faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
        chatTitle: 'कृषि-विशेषज्ञ AI',
        chatSub: 'अपनी सिफारिशों के बारे में पूछें',
        chatPlaceholder: 'पूछें: आपने चावल की सिफारिश क्यों की?',
        photoUploaded: 'तस्वीर अपलोड हो गई',
        optimalCropBadge: 'सबसे उपयुक्त फसल',
        projectedRevenue: 'अनुमानित राजस्व',
        suitabilityScore: 'उपयुक्तता स्कोर',
        climateMatch: 'जलवायु और मिट्टी मिलान',
        expectedYield: 'अपेक्षित उपज:',
        langToggle: 'English'
    }
};

function t(key) {
    return translations[currentLang]?.[key] || translations['en'][key] || key;
}

// Title Case helper for crop names
function toTitleCase(str) {
    if (!str || str === 'N/A') return str;
    return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function setLanguage(lang) {
    currentLang = lang;
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.tagName === 'INPUT') {
            el.placeholder = t(key);
        } else {
            el.textContent = t(key);
        }
    });
    // Update lang toggle button text
    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) langBtn.textContent = t('langToggle');
}

let statesData = {}; // Will hold the JSON data

// ================== STATE TO COORDINATES MAPPING (FOR MANUAL LOCATION) ==================
// Approximate center coordinates for Indian states
const STATE_COORDINATES = {
    "Andhra Pradesh": { lat: 15.9129, lon: 79.7400 },
    "Arunachal Pradesh": { lat: 28.2180, lon: 94.7278 },
    "Assam": { lat: 26.2006, lon: 92.9376 },
    "Bihar": { lat: 25.0961, lon: 85.3131 },
    "Chhattisgarh": { lat: 21.2787, lon: 81.8661 },
    "Goa": { lat: 15.2993, lon: 74.1240 },
    "Gujarat": { lat: 22.2587, lon: 71.1924 },
    "Haryana": { lat: 29.0588, lon: 76.0856 },
    "Himachal Pradesh": { lat: 31.1048, lon: 77.1734 },
    "Jharkhand": { lat: 23.6102, lon: 85.2799 },
    "Karnataka": { lat: 15.3173, lon: 75.7139 },
    "Kerala": { lat: 10.8505, lon: 76.2711 },
    "Madhya Pradesh": { lat: 22.9734, lon: 78.6569 },
    "Maharashtra": { lat: 19.7515, lon: 75.7139 },
    "Manipur": { lat: 24.6637, lon: 93.9063 },
    "Meghalaya": { lat: 25.4670, lon: 91.3662 },
    "Mizoram": { lat: 23.1645, lon: 92.9376 },
    "Nagaland": { lat: 26.1584, lon: 94.5624 },
    "Odisha": { lat: 20.9517, lon: 85.0985 },
    "Punjab": { lat: 31.1471, lon: 75.3412 },
    "Rajasthan": { lat: 27.0238, lon: 74.2179 },
    "Sikkim": { lat: 27.5330, lon: 88.5122 },
    "Tamil Nadu": { lat: 11.1271, lon: 78.6569 },
    "Telangana": { lat: 18.1124, lon: 79.0193 },
    "Tripura": { lat: 23.9408, lon: 91.9882 },
    "Uttar Pradesh": { lat: 26.8467, lon: 80.9462 },
    "Uttarakhand": { lat: 30.0668, lon: 79.0193 },
    "West Bengal": { lat: 22.9868, lon: 87.8550 },
    "Andaman and Nicobar Islands": { lat: 11.7401, lon: 92.6586 },
    "Chandigarh": { lat: 30.7333, lon: 76.7794 },
    "Dadra and Nagar Haveli and Daman and Diu": { lat: 20.1809, lon: 73.0169 },
    "Delhi": { lat: 28.7041, lon: 77.1025 },
    "Jammu and Kashmir": { lat: 33.7782, lon: 76.5762 },
    "Ladakh": { lat: 34.1526, lon: 77.5771 },
    "Lakshadweep": { lat: 10.5667, lon: 72.6417 },
    "Puducherry": { lat: 11.9416, lon: 79.8083 }
};

// ================== INITIALIZE ON LOAD ==================
window.addEventListener("load", async () => {
    console.log("App loaded...");
    await loadStatesData();
    requestLocation();
    setupEventListeners();
});

// ================== LOAD STATES DATA FROM JSON ==================
async function loadStatesData() {
    try {
        const response = await fetch('data/india_states_districts.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        statesData = await response.json();
        console.log("States data loaded:", Object.keys(statesData).length, "states");

    } catch (error) {
        console.error("Error loading states data:", error);
        alert("⚠️ Error loading location data. Please refresh the page.");
    }
    checkManualLocationComplete();

}

// ================== POPULATE STATES DROPDOWN ==================

function filterStates(query) {
    stateDropdown.innerHTML = "";
    const matches = Object.keys(statesData)
        .filter(s => s.toLowerCase().includes(query.toLowerCase()));

    if (matches.length === 0) {
        stateDropdown.innerHTML = `<li class="px-4 py-2 text-gray-400">No matches found</li>`;
    } else {
        matches.forEach(state => {
            const li = document.createElement("li");
            li.textContent = state;
            li.className = "px-4 py-2 cursor-pointer hover:bg-gray-100";
            li.onclick = () => selectState(state);
            stateDropdown.appendChild(li);
        });
    }

    stateDropdown.classList.remove("hidden");
}
function selectState(state) {
    stateInput.value = state;
    stateDropdown.classList.add("hidden");

    districtInput.disabled = false;
    districtInput.value = "";
    districtDropdown.innerHTML = "";


    checkManualLocationComplete();
}


// ================== POPULATE DISTRICTS BASED ON STATE ==================



function filterDistricts(query) {
    const state = stateInput.value.trim();
    districtDropdown.innerHTML = "";

    if (!statesData[state]) return;

    const matches = statesData[state]
        .filter(d => d.toLowerCase().includes(query.toLowerCase()));

    if (matches.length === 0) {
        districtDropdown.innerHTML = `<li class="px-4 py-2 text-gray-400">No matches found</li>`;
    } else {
        matches.forEach(dist => {
            const li = document.createElement("li");
            li.textContent = dist;
            li.className = "px-4 py-2 cursor-pointer hover:bg-gray-100";
            li.onclick = () => selectDistrict(dist);
            districtDropdown.appendChild(li);
        });
    }

    districtDropdown.classList.remove("hidden");
}
function selectDistrict(district) {
    districtInput.value = district;
    districtDropdown.classList.add("hidden");
    checkManualLocationComplete();
}

// ================== EVENT LISTENERS SETUP ==================
function setupEventListeners() {
    // Image button click
    imageBtn.addEventListener("click", () => {
        imageInput.click();
    });

    // Image input change
    imageInput.addEventListener("change", handleImageUpload);

    // Confirm location button
    confirmBtn.addEventListener("click", handleManualLocation);

    // Analyse button
    analyseBtn.addEventListener("click", handleAnalyse);

    // Download button
    downloadBtn.addEventListener("click", handleDownloadPDF);

    // FAQ button
    faqBtn.addEventListener("click", () => {
        faqModal.classList.remove("hidden");
        faqModal.classList.add("flex");
    });
    closeFaq.addEventListener("click", () => {
        faqModal.classList.add("hidden");
        faqModal.classList.remove("flex");
    });
    faqModal.addEventListener("click", (e) => {
        if (e.target === faqModal) {
            faqModal.classList.add("hidden");
            faqModal.classList.remove("flex");
        }
    });

    // State/District inputs
    stateInput.addEventListener("input", (e) => {
        const value = e.target.value.trim();
        if (!value) { stateDropdown.classList.add("hidden"); return; }
        filterStates(value);
    });
    districtInput.addEventListener("input", (e) => {
        const value = e.target.value.trim();
        if (!value) { districtDropdown.classList.add("hidden"); return; }
        filterDistricts(value);
    });

    // ===== UNIT TOGGLE =====
    document.querySelectorAll('.unit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const newUnit = btn.dataset.unit;
            if (newUnit === currentUnit) return;

            // Convert value
            const input = landSizeInput;
            let val = parseFloat(input.value) || 1;
            if (newUnit === 'hectares') {
                val = val * 0.4047; // acres → hectares
            } else {
                val = val / 0.4047; // hectares → acres
            }
            input.value = Math.round(val * 100) / 100;
            input.placeholder = `Enter land size in ${newUnit} (e.g., ${newUnit === 'acres' ? '2.5' : '1.0'})`;

            currentUnit = newUnit;

            // Update button styles
            document.querySelectorAll('.unit-btn').forEach(b => {
                b.classList.remove('bg-cow-dung-green', 'text-white');
                b.classList.add('bg-white', 'text-gray-600');
            });
            btn.classList.remove('bg-white', 'text-gray-600');
            btn.classList.add('bg-cow-dung-green', 'text-white');

            // Update unit labels throughout the page
            document.querySelectorAll('.land-unit-label').forEach(el => {
                el.textContent = newUnit;
            });
        });
    });

    // ===== CHAT FAB + POPUP =====
    const chatFab = document.getElementById('chatFab');
    const chatPopup = document.getElementById('chatPopup');
    const chatClose = document.getElementById('chatClose');

    chatFab.addEventListener('click', () => {
        chatOpen = !chatOpen;
        if (chatOpen) {
            chatPopup.classList.remove('hidden');
            chatFab.querySelector('#chatFabIcon').className = 'fas fa-times';
            document.getElementById('chatBadge')?.classList.add('hidden');
        } else {
            chatPopup.classList.add('hidden');
            chatFab.querySelector('#chatFabIcon').className = 'fas fa-comments';
        }
    });
    chatClose.addEventListener('click', () => {
        chatOpen = false;
        chatPopup.classList.add('hidden');
        chatFab.querySelector('#chatFabIcon').className = 'fas fa-comments';
    });

    // ===== CHAT FULLSCREEN TOGGLE =====
    const chatExpand = document.getElementById('chatExpand');
    if (chatExpand) {
        chatExpand.addEventListener('click', () => {
            chatFullscreen = !chatFullscreen;
            if (chatFullscreen) {
                chatPopup.classList.add('fullscreen');
                chatExpand.innerHTML = '<i class="fas fa-compress"></i>';
                chatExpand.title = 'Minimize';
            } else {
                chatPopup.classList.remove('fullscreen');
                chatExpand.innerHTML = '<i class="fas fa-expand"></i>';
                chatExpand.title = 'Fullscreen';
            }
        });
    }

    // ===== LANGUAGE TOGGLE =====
    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const newLang = currentLang === 'en' ? 'hi' : 'en';
            setLanguage(newLang);
        });
    }

    // ===== DETECT LOCATION BUTTON =====
    const detectLocationBtn = document.getElementById('detectLocationBtn');
    if (detectLocationBtn) {
        detectLocationBtn.addEventListener('click', () => {
            // Reset location state and try GPS again
            locationStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Detecting GPS...';
            locationStatus.classList.remove('text-orange-600', 'text-green-600');
            locationStatus.classList.add('text-gray-500');
            detectLocationBtn.classList.add('hidden');
            manualLocationInputs.classList.add('hidden');
            requestLocation();
        });
    }

    // ===== START OVER =====
    const startOverBtn = document.getElementById('startOverBtn');
    if (startOverBtn) {
        startOverBtn.addEventListener('click', resetApp);
    }
}


// ================== LOCATION HANDLING ==================
function requestLocation() {
    if (!navigator.geolocation) {
        console.log("Geolocation not supported");
        showManualLocationInputs("🌍 Geolocation not supported. Please enter manually.");
        return;
    }

    locationStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Detecting GPS...';

    navigator.geolocation.getCurrentPosition(
        (position) => {
            // GPS Success
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            appState.location = {
                lat: lat,
                lon: lon
            };

            locationStatus.innerHTML = `Location detected<br><span class="text-xs opacity-70">Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}</span>`;
            locationStatus.classList.add("text-green-600");

            console.log("GPS location obtained:", appState.location);
            checkAnalyseButtonState();
        },
        (error) => {
            // GPS Failed
            console.log("GPS error:", error.message);
            let errorMsg = "📍 Location permission denied. Please enter manually.";

            if (error.code === error.PERMISSION_DENIED) {
                errorMsg = "📍 Location permission denied. Please enter manually.";
            } else if (error.code === error.POSITION_UNAVAILABLE) {
                errorMsg = "📍 Location unavailable. Please enter manually.";
            } else if (error.code === error.TIMEOUT) {
                errorMsg = "📍 Location request timed out. Please enter manually.";
            }

            showManualLocationInputs(errorMsg);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

function showManualLocationInputs(message) {
    locationStatus.textContent = message;
    locationStatus.classList.add("text-orange-600");
    manualLocationInputs.classList.remove("hidden");
    // Show detect location button
    const detectBtn = document.getElementById('detectLocationBtn');
    if (detectBtn) detectBtn.classList.remove('hidden');

    // Smooth scroll to location section
    setTimeout(() => {
        locationSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
}

function handleManualLocation() {
    const state = stateInput.value.trim();
    const district = districtInput.value.trim();


    if (!state || !district) {
        alert("⚠️ Please select both state and district.");
        return;
    }

    // ✅ Get approximate coordinates for the state
    const coords = STATE_COORDINATES[state] || { lat: 20.5937, lon: 78.9629 }; // Default to India center

    appState.location = {
        lat: coords.lat,
        lon: coords.lon,
        state: state,
        district: district
    };
    appState.locationMethod = 'manual';

    locationStatus.innerHTML = `Location set manually<br><span class="text-xs opacity-70">${district}, ${state}</span>`;
    locationStatus.classList.remove("text-orange-600");
    locationStatus.classList.add("text-green-600");

    // Hide manual inputs and detect button after confirmation

    manualLocationInputs.classList.add("hidden");
    const detectBtn = document.getElementById('detectLocationBtn');
    if (detectBtn) detectBtn.classList.add('hidden');

    checkAnalyseButtonState();


    console.log("Manual location set:", appState.location);
    checkAnalyseButtonState();
}

function checkManualLocationComplete() {
    const state = stateInput.value.trim();
    const district = districtInput.value.trim();

    const validState = statesData[state];
    const validDistrict = validState && validState.includes(district);

    if (validState && validDistrict) {
        confirmBtn.classList.remove("opacity-50");
        confirmBtn.disabled = false;
    } else {
        confirmBtn.classList.add("opacity-50");
        confirmBtn.disabled = true;
    }
}



// ================== IMAGE HANDLING ==================
function handleImageUpload(event) {
    const file = event.target.files[0];

    if (!file) {
        console.log("No file selected");
        return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert("⚠️ Please upload a valid image file.");
        return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        alert("⚠️ Image size too large. Please upload an image smaller than 10MB.");
        return;
    }

    appState.imageFile = file;

    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => {
        appState.image = e.target.result; // base64 string
        previewImg.src = e.target.result;
        imagePreview.classList.remove("hidden");
        imageBtn.classList.add("opacity-50");

        // Update status text
        imageStatusText.innerHTML = '✅ <span class="text-green-600">Photo Uploaded</span>';
        imageFileName.textContent = `📷 ${file.name}`;
        imageFileName.classList.remove("hidden");

        console.log("Image uploaded:", file.name);
        checkAnalyseButtonState();
    };

    reader.onerror = () => {
        alert("⚠️ Error reading image file. Please try again.");
    };

    reader.readAsDataURL(file);
}

// ================== ANALYSE BUTTON STATE ==================
function checkAnalyseButtonState() {
    const hasLocation = appState.location !== null;
    const hasImage = appState.image !== null;

    console.log("Checking analyse button state:", { hasLocation, hasImage });

    if (hasLocation && hasImage) {
        // Enable button
        analyseBtn.disabled = false;
        analyseBtn.classList.remove("bg-gray-300", "text-gray-500", "cursor-not-allowed");
        analyseBtn.classList.add("bg-cow-dung-green", "text-white", "hover:bg-cow-dung-light", "cursor-pointer");
        analyseBtnText.textContent = "Analyse Soil Health";

        // Smooth scroll to analyse button
        setTimeout(() => {
            analyseBtn.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
    } else {
        // Keep disabled
        analyseBtn.disabled = true;
        analyseBtn.classList.add("bg-gray-300", "text-gray-500", "cursor-not-allowed");
        analyseBtn.classList.remove("bg-cow-dung-green", "text-white", "hover:bg-cow-dung-light", "cursor-pointer");

        if (!hasImage && !hasLocation) {
            analyseBtnText.textContent = "Upload image & set location first";
        } else if (!hasImage) {
            analyseBtnText.textContent = "Upload soil image first";
        } else if (!hasLocation) {
            analyseBtnText.textContent = "Set location first";
        }
    }
}

// ================== ANALYSE FUNCTIONALITY ==================
async function handleAnalyse() {


    if (!appState.location || !appState.imageFile) {
        alert("⚠️ Please upload an image and set location before analyzing.");
        return;
    }

    console.log("Starting analysis...");

    // Hide previous results
    summarySection.classList.add("hidden");

    // Show loading spinner
    loadingSpinner.classList.remove("hidden");
    analyseBtn.disabled = true;
    const analyseBtnIcon = document.getElementById('analyseBtnIcon');
    analyseBtnText.textContent = "Analyzing...";
    analyseBtnIcon.className = "fas fa-spinner fa-spin";

    // Scroll to loading spinner
    setTimeout(() => {
        loadingSpinner.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);

    // Prepare form data to match backend requirements
    const formData = new FormData();
    formData.append("file", appState.imageFile);
    formData.append("lat", appState.location.lat.toString());
    formData.append("lon", appState.location.lon.toString());

    // Backend always expects acres
    let landSizeVal = parseFloat(landSizeInput?.value) || 1;
    if (currentUnit === 'hectares') {
        landSizeVal = landSizeVal / 0.4047; // convert hectares to acres for backend
    }
    formData.append("land_size", landSizeVal.toString());

    // Fix 3: Send manual location state/district so backend uses them directly
    if (appState.locationMethod === 'manual' && appState.location.state && appState.location.district) {
        formData.append("state", appState.location.state);
        formData.append("district", appState.location.district);
    }

    console.log("Sending request with:");
    console.log("- file:", appState.imageFile.name);
    console.log("- lat:", appState.location.lat);
    console.log("- lon:", appState.location.lon);

    try {
        // ✅ UPDATED: Changed endpoint from "/predict" to "/analyze"
        const response = await fetch("https://nirmalll17-devsoc.hf.space/analyze", {
            method: "POST",
            body: formData,
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error Response:", errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (data.status !== "success") {
            throw new Error(data.message || "Analysis failed");
        }

        // Store result
        // Fix 3: If manual location, override backend location with user input
        let displayLocation = data.location;
        if (appState.locationMethod === 'manual' && appState.location.state && appState.location.district) {
            displayLocation = `${appState.location.district}, ${appState.location.state}`;
        }

        const normalizedResult = {
            soil_type: data.soil,
            location: displayLocation,
            recommended_crop: data.optimal_crop?.crop || "N/A",
            suitability: data.optimal_crop?.suitability,
            revenue: data.optimal_crop?.revenue,
            top_3_crops: data.recommendations
                ? data.recommendations.slice(0, 3).map(r => r.crop)
                : [],
            full_table: data.recommendations || [],
            scatter_graph: data.scatter_graph || [],
            // Fix 1: Store weather data from backend
            season: data.season || 'N/A',
            temperature: data.temperature ?? 'N/A',
            humidity: data.humidity ?? 'N/A',
            annual_rainfall: data.annual_rainfall ?? 'N/A'
        };

        appState.result = normalizedResult;
        // Display optimal crop hero section
        displayOptimalCrop(normalizedResult);
        renderSummary(normalizedResult);
        renderCropTable(normalizedResult.full_table);
        renderScatterChart(normalizedResult.scatter_graph);




        // Hide loading, show results
        loadingSpinner.classList.add("hidden");

        summarySection.classList.remove("hidden");
        // Update button to show completion
        analyseBtnText.textContent = "✓ Analysis Complete";
        analyseBtnIcon.className = "fas fa-check-circle";
        analyseBtn.classList.remove('bg-gray-300');
        analyseBtn.classList.add('bg-cow-dung-green', 'text-white');

        // Show Start Over button
        document.getElementById('startOverBtn')?.classList.remove('hidden');

        // Show chatbot FAB
        const chatFab = document.getElementById('chatFab');
        if (chatFab) {
            chatFab.classList.remove('hidden');
            document.getElementById('chatBadge')?.classList.remove('hidden');
        }

        // Fix 2: Scroll to optimal crop section (above summary)
        setTimeout(() => {
            document.getElementById('optimalCropSection')?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);

    } catch (error) {
        console.error("Analysis error:", error);

        loadingSpinner.classList.add("hidden");

        alert(`❌ Analysis failed: ${error.message}\n\nPossible reasons:\n• API server is down or sleeping\n• Network connectivity issues\n• Invalid response from server\n\nPlease try again in a moment.`);

        // Re-enable analyse button
        analyseBtn.disabled = false;
        analyseBtnText.textContent = "Analyse Soil Health";
        analyseBtnIcon.className = "fas fa-brain";
        checkAnalyseButtonState();
    }
}

// ================== RENDER SUMMARY ==================
function renderSummary(summary) {
    console.log("Rendering summary:", summary);

    const unitLabel = currentUnit;
    const landVal = parseFloat(landSizeInput?.value) || 1;

    // Fix 1: Show actual weather data from backend
    let summaryHTML = `
        <div class="space-y-4">
            <div class="border-b border-gray-200 pb-3">
                <h4 class="text-sm font-bold text-gray-500 uppercase mb-2">${t('soilAnalysis')}</h4>
                <p class="text-lg"><span class="font-semibold">${t('soilType')}</span> ${(summary.soil_type || 'N/A').replace(/_/g, ' ')}</p>
            </div>

            <div class="border-b border-gray-200 pb-3">
                <h4 class="text-sm font-bold text-gray-500 uppercase mb-2">${t('weatherConditions')}</h4>
                <div class="grid grid-cols-2 gap-3">
                    <div style="background:#6B4226" class="p-3 rounded-lg text-center">
                        <p class="text-xs font-bold uppercase" style="color:#FFFFF0">${t('temperature')}</p>
                        <p class="text-lg font-bold" style="color:#FFFFF0">${summary.temperature !== 'N/A' ? summary.temperature + '°C' : 'N/A'}</p>
                    </div>
                    <div style="background:#6B4226" class="p-3 rounded-lg text-center">
                        <p class="text-xs font-bold uppercase" style="color:#FFFFF0">${t('humidity')}</p>
                        <p class="text-lg font-bold" style="color:#FFFFF0">${summary.humidity !== 'N/A' ? summary.humidity + '%' : 'N/A'}</p>
                    </div>
                    <div style="background:#6B4226" class="p-3 rounded-lg text-center">
                        <p class="text-xs font-bold uppercase" style="color:#FFFFF0">${t('annualRainfall')}</p>
                        <p class="text-lg font-bold" style="color:#FFFFF0">${summary.annual_rainfall !== 'N/A' ? summary.annual_rainfall + ' mm' : 'N/A'}</p>
                    </div>
                    <div style="background:#6B4226" class="p-3 rounded-lg text-center">
                        <p class="text-xs font-bold uppercase" style="color:#FFFFF0">${t('season')}</p>
                        <p class="text-lg font-bold" style="color:#FFFFF0">${summary.season || 'N/A'}</p>
                    </div>
                </div>
            </div>

            <div class="border-b border-gray-200 pb-3">
                <h4 class="text-sm font-bold text-gray-500 uppercase mb-2">${t('bestCrop')}</h4>
                <p class="text-lg text-cow-dung-green font-bold mb-1">${t('recommended')} ${toTitleCase(summary.recommended_crop || 'N/A')}</p>
                <p class="text-sm text-gray-500">${t('seeFullTable')}</p>
            </div>

            <div>
                <h4 class="text-sm font-bold text-gray-500 uppercase mb-2">${t('farmDetails')}</h4>
                <p class="text-sm"><span class="font-semibold">${t('locationLabel')}</span> ${summary.location || 'N/A'}</p>
                <p class="text-sm"><span class="font-semibold">${t('landSizeLabel')}</span> ${landVal} ${unitLabel}</p>
            </div>
        </div>
    `;

    summaryText.innerHTML = summaryHTML;
}
// ================== DISPLAY OPTIMAL CROP HERO ==================
function displayOptimalCrop(result) {
    const landSize = parseFloat(landSizeInput?.value) || 1;
    const optimalCropSection = document.getElementById('optimalCropSection');

    if (!optimalCropSection) return;

    document.getElementById('optimalCropName').textContent =
        result.recommended_crop.charAt(0).toUpperCase() + result.recommended_crop.slice(1);

    document.getElementById('optimalRevenue').textContent =
        `₹${result.revenue?.toLocaleString('en-IN') || '0'}`;

    document.getElementById('optimalSuitability').textContent =
        `${result.suitability || 0}%`;

    document.getElementById('optimalYield').textContent =
        result.full_table[0]?.yield_ton || '0';

    document.getElementById('optimalLandSize').textContent = landSize.toFixed(1);
    document.getElementById('optimalLandSize2').textContent = landSize.toFixed(1);

    // Update unit labels
    document.querySelectorAll('.land-unit-label').forEach(el => {
        el.textContent = currentUnit;
    });

    optimalCropSection.classList.remove('hidden');
}
function renderCropTable(rows) {
    cropTableBody.innerHTML = "";

    rows.forEach(r => {
        const tr = document.createElement("tr");
        tr.className = "border-t";

        tr.innerHTML = `
            <td class="p-3 font-semibold">${r.crop}</td>
            <td class="p-3 text-center">${r.suitability}%</td>
            <td class="p-3 text-center">${r.yield_ton}</td>
            <td class="p-3 text-center">₹${r.revenue.toLocaleString()}</td>
        `;

        cropTableBody.appendChild(tr);
    });

    tableSection.classList.remove("hidden");
}
let riskChart = null;



function renderScatterChart(points) {
    if (!riskChartCanvas) return;

    if (riskChart) {
        riskChart.destroy();
    }

    // Color code: optimal crop = green, others = blue
    const optimalCrop = appState.result?.recommended_crop;
    const colors = points.map(p => p.crop === optimalCrop ? '#10b981' : '#4A5D23');
    const sizes = points.map(p => p.crop === optimalCrop ? 12 : 7);

    riskChart = new Chart(riskChartCanvas, {
        type: "scatter",
        data: {
            datasets: [{
                label: "Crops",
                data: points,
                backgroundColor: colors,
                pointRadius: sizes,
                pointHoverRadius: 14,
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#fff',
                    titleColor: '#000',
                    bodyColor: '#666',
                    borderColor: '#ddd',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        title: (ctx) => {
                            return ctx[0].raw.crop.toUpperCase();
                        },
                        label: (ctx) => {
                            const p = ctx.raw;
                            return [
                                `Suitability: ${p.x}%`,
                                `Revenue: ₹${p.y.toLocaleString('en-IN')}`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Suitability Score (%)",
                        font: { size: 14, weight: 'bold' },
                        color: '#4A5D23'
                    },
                    min: 0,
                    max: 100,
                    grid: {
                        color: '#f0f0f0',
                        drawBorder: false
                    },
                    ticks: {
                        callback: function (value) {
                            return value + '%';
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Projected Revenue (₹)",
                        font: { size: 14, weight: 'bold' },
                        color: '#4A5D23'
                    },
                    beginAtZero: true,
                    grid: {
                        color: '#f0f0f0',
                        drawBorder: false
                    },
                    ticks: {
                        callback: function (value) {
                            return '₹' + value.toLocaleString('en-IN');
                        }
                    }
                }
            }
        }
    });

    chartSection.classList.remove("hidden");
}

// ================== PDF DOWNLOAD (html2pdf.js) ==================
async function handleDownloadPDF() {
    if (!appState.result) {
        alert("⚠️ No report available to download.");
        return;
    }

    console.log("Generating PDF...");

    const originalHTML = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
    downloadBtn.disabled = true;

    try {
        // Build a hidden container with all analysis content
        const pdfContainer = document.createElement('div');
        pdfContainer.style.cssText = 'padding:30px;font-family:Arial,sans-serif;max-width:800px;background:white;';
        pdfContainer.innerHTML = generatePDFContent();

        document.body.appendChild(pdfContainer);

        const opt = {
            margin: 0.5,
            filename: `Growmore_Report_${new Date().toISOString().slice(0, 10)}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        await html2pdf().set(opt).from(pdfContainer).save();

        document.body.removeChild(pdfContainer);

        downloadBtn.innerHTML = originalHTML;
        downloadBtn.disabled = false;
    } catch (error) {
        console.error("PDF generation error:", error);
        alert("❌ PDF generation failed. Please try again.");
        downloadBtn.innerHTML = originalHTML;
        downloadBtn.disabled = false;
    }
}
document.addEventListener("click", (e) => {
    if (!stateInput.contains(e.target) && !stateDropdown.contains(e.target)) {
        stateDropdown.classList.add("hidden");
    }
    if (!districtInput.contains(e.target) && !districtDropdown.contains(e.target)) {
        districtDropdown.classList.add("hidden");
    }

});
// ================== CHATBOT FUNCTIONALITY ==================
let chatThreadId = null;

// ================== FORMAT CHAT MESSAGE (Markdown → HTML) ==================
function formatChatMessage(text) {
    if (!text) return '<p class="text-sm text-gray-700">No response.</p>';

    // Escape HTML entities to prevent injection
    let safe = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Split into lines for processing
    let lines = safe.split('\n');
    let html = '';
    let inUl = false;
    let inOl = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Heading lines: ### / ## / #
        if (/^###\s+(.+)/.test(line)) {
            if (inUl) { html += '</ul>'; inUl = false; }
            if (inOl) { html += '</ol>'; inOl = false; }
            html += `<h5 class="font-bold text-gray-800 mt-3 mb-1 text-sm">${line.replace(/^###\s+/, '')}</h5>`;
            continue;
        }
        if (/^##\s+(.+)/.test(line)) {
            if (inUl) { html += '</ul>'; inUl = false; }
            if (inOl) { html += '</ol>'; inOl = false; }
            html += `<h4 class="font-bold text-gray-800 mt-3 mb-1">${line.replace(/^##\s+/, '')}</h4>`;
            continue;
        }
        if (/^#\s+(.+)/.test(line)) {
            if (inUl) { html += '</ul>'; inUl = false; }
            if (inOl) { html += '</ol>'; inOl = false; }
            html += `<h4 class="font-bold text-cow-dung-green mt-3 mb-1">${line.replace(/^#\s+/, '')}</h4>`;
            continue;
        }

        // Bullet list: - item or * item
        if (/^\s*[-*]\s+(.+)/.test(line)) {
            if (inOl) { html += '</ol>'; inOl = false; }
            if (!inUl) { html += '<ul class="list-disc list-inside ml-2 my-1 text-sm text-gray-700 space-y-0.5">'; inUl = true; }
            html += `<li>${line.replace(/^\s*[-*]\s+/, '')}</li>`;
            continue;
        }

        // Numbered list: 1. item
        if (/^\s*\d+\.\s+(.+)/.test(line)) {
            if (inUl) { html += '</ul>'; inUl = false; }
            if (!inOl) { html += '<ol class="list-decimal list-inside ml-2 my-1 text-sm text-gray-700 space-y-0.5">'; inOl = true; }
            html += `<li>${line.replace(/^\s*\d+\.\s+/, '')}</li>`;
            continue;
        }

        // Close open lists if we hit a non-list line
        if (inUl) { html += '</ul>'; inUl = false; }
        if (inOl) { html += '</ol>'; inOl = false; }

        // Empty line = paragraph break
        if (line.trim() === '') {
            html += '<div class="h-2"></div>';
            continue;
        }

        // Normal text line
        html += `<p class="text-sm text-gray-700 my-0.5">${line}</p>`;
    }

    // Close any remaining open lists
    if (inUl) html += '</ul>';
    if (inOl) html += '</ol>';

    // Inline formatting: **bold**, *italic*
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    return html;
}

async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const question = input.value.trim();

    if (!question) return;

    // Add user message to chat
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'flex gap-3 mb-4 justify-end';
    userMsgDiv.innerHTML = `
        <div class="bg-cow-dung-green text-white p-3 rounded-xl shadow-sm max-w-md">
            <p class="text-sm">${question}</p>
        </div>
        <div class="w-8 h-8 bg-cow-dung-green rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
            <i class="fas fa-user"></i>
        </div>
    `;
    chatMessages.appendChild(userMsgDiv);
    input.value = '';

    // Add "thinking" message
    const thinkingDiv = document.createElement('div');
    thinkingDiv.className = 'flex gap-3 mb-4';
    thinkingDiv.id = 'thinkingMessage';
    thinkingDiv.innerHTML = `
        <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
            <i class="fas fa-robot"></i>
        </div>
        <div class="bg-gray-200 p-3 rounded-xl shadow-sm max-w-md">
            <p class="text-sm text-gray-600"><i class="fas fa-spinner fa-spin"></i> Thinking...</p>
        </div>
    `;
    chatMessages.appendChild(thinkingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Prepare context from analysis
    const context = appState.result ?
        `Soil: ${appState.result.soil_type} in ${appState.result.location}. Best Crop: ${appState.result.recommended_crop} (Suitability: ${appState.result.suitability}%, Revenue: ₹${appState.result.revenue}). Alternatives: ${appState.result.top_3_crops.join(", ")}.`
        : "No analysis data available yet.";

    try {
        const response = await fetch('https://nirmalll17-devsoc.hf.space/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: question,
                context: context,
                thread_id: chatThreadId
            })
        });

        const data = await response.json();

        // Remove thinking message
        document.getElementById('thinkingMessage')?.remove();

        if (data.reply) {
            // Save thread ID for conversation continuity
            if (data.thread_id) chatThreadId = data.thread_id;

            // Add bot response with formatted markdown
            const botMsgDiv = document.createElement('div');
            botMsgDiv.className = 'flex gap-3 mb-4';
            botMsgDiv.innerHTML = `
                <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="bg-white p-3 rounded-xl shadow-sm max-w-md chat-message-content">
                    ${formatChatMessage(data.reply)}
                </div>
            `;
            chatMessages.appendChild(botMsgDiv);
        } else {
            throw new Error('No reply from AI');
        }

    } catch (error) {
        console.error('Chat error:', error);
        document.getElementById('thinkingMessage')?.remove();

        const errorDiv = document.createElement('div');
        errorDiv.className = 'flex gap-3 mb-4';
        errorDiv.innerHTML = `
            <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                <i class="fas fa-exclamation"></i>
            </div>
            <div class="bg-red-50 p-3 rounded-xl shadow-sm max-w-md border border-red-200">
                <p class="text-sm text-red-700">Sorry, I couldn't process your question. Please try again.</p>
            </div>
        `;
        chatMessages.appendChild(errorDiv);
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
}
function generatePDFContent() {
    const result = appState.result;
    const date = new Date().toLocaleDateString('en-IN');
    const time = new Date().toLocaleTimeString('en-IN');
    const unitLabel = currentUnit;
    const landVal = parseFloat(landSizeInput?.value) || 1;

    // Build crop table rows
    let tableRows = '';
    if (result.full_table && result.full_table.length > 0) {
        result.full_table.forEach((r, i) => {
            tableRows += `
                <tr style="${i % 2 === 0 ? 'background:#f9fafb;' : ''}">
                    <td style="padding:10px;border:1px solid #e5e7eb;font-weight:600;">${r.crop}</td>
                    <td style="padding:10px;border:1px solid #e5e7eb;text-align:center;">${r.suitability}%</td>
                    <td style="padding:10px;border:1px solid #e5e7eb;text-align:center;">${r.yield_ton}</td>
                    <td style="padding:10px;border:1px solid #e5e7eb;text-align:center;">₹${r.revenue?.toLocaleString('en-IN') || '0'}</td>
                </tr>`;
        });
    }

    return `
        <div style="text-align:center;border-bottom:3px solid #4A5D23;padding-bottom:20px;margin-bottom:25px;">
            <h1 style="color:#4A5D23;margin:0;font-size:28px;">🌾 Growmore Soil Health Report</h1>
            <p style="color:#666;margin:5px 0;">Generated: ${date} at ${time}</p>
        </div>

        <div style="margin-bottom:20px;padding:15px;border-left:4px solid #4A5D23;background:#f9fafb;">
            <h2 style="color:#4A5D23;font-size:16px;margin:0 0 8px 0;">📊 Soil Analysis</h2>
            <p style="margin:5px 0;"><strong>Soil Type:</strong> ${(result.soil_type || 'N/A').replace(/_/g, ' ')}</p>
            <p style="margin:5px 0;"><strong>Location:</strong> ${result.location || 'N/A'}</p>
            <p style="margin:5px 0;"><strong>Land Size:</strong> ${landVal} ${unitLabel}</p>
        </div>

        <div style="margin-bottom:20px;padding:15px;border-left:4px solid #2563eb;background:#eff6ff;">
            <h2 style="color:#2563eb;font-size:16px;margin:0 0 8px 0;">🌤️ Weather & Season</h2>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <p style="margin:3px 0;"><strong>Temperature:</strong> ${result.temperature !== 'N/A' ? result.temperature + '°C' : 'N/A'}</p>
                <p style="margin:3px 0;"><strong>Humidity:</strong> ${result.humidity !== 'N/A' ? result.humidity + '%' : 'N/A'}</p>
                <p style="margin:3px 0;"><strong>Annual Rainfall:</strong> ${result.annual_rainfall !== 'N/A' ? result.annual_rainfall + ' mm' : 'N/A'}</p>
                <p style="margin:3px 0;"><strong>Season:</strong> ${result.season || 'N/A'}</p>
            </div>
        </div>

        <div style="background:#4A5D23;color:white;padding:18px;border-radius:8px;margin:20px 0;text-align:center;">
            <h3 style="margin:0 0 8px 0;">🌾 Recommended Crop</h3>
            <p style="font-size:24px;margin:0;font-weight:bold;">${result.recommended_crop || 'N/A'}</p>
            <p style="margin:6px 0 0 0;opacity:0.8;">Suitability: ${result.suitability || 0}% | Revenue: ₹${result.revenue?.toLocaleString('en-IN') || '0'}</p>
        </div>

        <div style="margin-bottom:20px;">
            <h2 style="color:#4A5D23;font-size:16px;margin:0 0 10px 0;">📋 Crop Comparison Table</h2>
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
                <thead>
                    <tr style="background:#4A5D23;color:white;">
                        <th style="padding:10px;text-align:left;">Crop</th>
                        <th style="padding:10px;text-align:center;">Suitability %</th>
                        <th style="padding:10px;text-align:center;">Yield (tons)</th>
                        <th style="padding:10px;text-align:center;">Revenue (₹)</th>
                    </tr>
                </thead>
                <tbody>${tableRows}</tbody>
            </table>
        </div>

        <div style="margin-top:30px;padding-top:15px;border-top:2px solid #ddd;text-align:center;color:#666;font-size:11px;">
            <p>© 2025 Growmore - AI Farming Assistant</p>
            <p>This report is AI-generated and should be verified with local agricultural experts.</p>
        </div>
    `;
}

// ================== RESET / START OVER ==================
function resetApp() {
    // Reset state
    appState = { location: null, locationMethod: null, image: null, imageFile: null, result: null };
    chatThreadId = null;
    chatOpen = false;
    chatFullscreen = false;

    // Hide result sections
    document.getElementById('optimalCropSection')?.classList.add('hidden');
    summarySection.classList.add('hidden');
    tableSection.classList.add('hidden');
    chartSection.classList.add('hidden');
    document.getElementById('startOverBtn')?.classList.add('hidden');
    loadingSpinner.classList.add('hidden');

    // Hide chat FAB & popup
    document.getElementById('chatFab')?.classList.add('hidden');
    document.getElementById('chatPopup')?.classList.add('hidden');

    // Reset image
    imageInput.value = '';
    imagePreview.classList.add('hidden');
    imageBtn.classList.remove('opacity-50');
    imageStatusText.innerHTML = t('uploadTitle');
    imageFileName.classList.add('hidden');

    // Reset land size
    landSizeInput.value = '1';
    currentUnit = 'acres';
    document.querySelectorAll('.unit-btn').forEach(b => {
        if (b.dataset.unit === 'acres') {
            b.classList.add('bg-cow-dung-green', 'text-white');
            b.classList.remove('bg-white', 'text-gray-600');
        } else {
            b.classList.remove('bg-cow-dung-green', 'text-white');
            b.classList.add('bg-white', 'text-gray-600');
        }
    });

    // Reset analyse button
    const analyseBtnIcon = document.getElementById('analyseBtnIcon');
    analyseBtnIcon.className = 'fas fa-brain';
    analyseBtnText.textContent = t('analyseBtn');
    analyseBtn.classList.remove('bg-green-600');
    checkAnalyseButtonState();

    // Reset chat messages
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.innerHTML = `
            <div class="flex gap-3 mb-4">
                <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="bg-white p-3 rounded-xl shadow-sm max-w-[85%]">
                    <p class="text-sm text-gray-700">I've analyzed your farm data. Ask me anything about the recommendations!</p>
                </div>
            </div>
        `;
    }

    // Re-request location
    requestLocation();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

console.log("Script loaded successfully!");