// ================== DOM ELEMENTS ==================
const locationStatus = document.getElementById("locationStatus");
const locationSection = document.getElementById("locationSection");
const manualLocationInputs = document.getElementById("manualLocationInputs");
const analyseBtn = document.getElementById("analyseBtn");
const analyseBtnText = document.getElementById("analyseBtnText");

const stateSelect = document.getElementById("stateSelect");
const districtSelect = document.getElementById("districtSelect");
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

// ================== GLOBAL STATE ==================
let appState = {
    location: null,
    locationMethod: null, // 'gps' or 'manual'
    image: null,
    imageFile: null,
    result: null
};

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
        populateStates();
    } catch (error) {
        console.error("Error loading states data:", error);
        alert("⚠️ Error loading location data. Please refresh the page.");
    }
}

// ================== POPULATE STATES DROPDOWN ==================
function populateStates() {
    // Clear existing options except placeholder
    stateSelect.innerHTML = '<option value="">Select State</option>';
    
    // Sort states alphabetically
    const sortedStates = Object.keys(statesData).sort();
    
    // Add each state as an option
    sortedStates.forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    });
    
    console.log("States populated:", sortedStates.length);
}

// ================== POPULATE DISTRICTS BASED ON STATE ==================
function populateDistricts(selectedState) {
    // Clear districts
    districtSelect.innerHTML = '<option value="">Select District</option>';
    
    if (!selectedState || !statesData[selectedState]) {
        districtSelect.disabled = true;
        return;
    }
    
    districtSelect.disabled = false;
    
    // Get districts for selected state and sort them
    const districts = statesData[selectedState].sort();
    
    // Add each district as an option
    districts.forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
    });
    
    console.log("Districts populated for", selectedState, ":", districts.length);
}

// ================== EVENT LISTENERS SETUP ==================
function setupEventListeners() {
    // Image button click
    imageBtn.addEventListener("click", () => {
        imageInput.click();
    });

    // Image input change
    imageInput.addEventListener("change", handleImageUpload);

    // State select change - populate districts
    stateSelect.addEventListener("change", (e) => {
        const selectedState = e.target.value;
        populateDistricts(selectedState);
        checkManualLocationComplete();
    });

    // District select change
    districtSelect.addEventListener("change", checkManualLocationComplete);

    // Confirm location button
    confirmBtn.addEventListener("click", handleManualLocation);

    // Analyse button
    analyseBtn.addEventListener("click", handleAnalyse);

    // Download button
    downloadBtn.addEventListener("click", handleDownloadPDF);
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
            appState.locationMethod = 'gps';

            locationStatus.innerHTML = `✅ Location detected automatically<br><span class="text-xs opacity-70">Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}</span>`;
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
    
    // Smooth scroll to location section
    setTimeout(() => {
        locationSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
}

function handleManualLocation() {
    const state = stateSelect.value.trim();
    const district = districtSelect.value.trim();

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

    locationStatus.innerHTML = `✅ Location set manually<br><span class="text-xs opacity-70">${district}, ${state}</span>`;
    locationStatus.classList.remove("text-orange-600");
    locationStatus.classList.add("text-green-600");

    // Hide manual inputs after confirmation
    manualLocationInputs.classList.add("hidden");

    console.log("Manual location set:", appState.location);
    checkAnalyseButtonState();
}

function checkManualLocationComplete() {
    // Real-time validation feedback
    const state = stateSelect.value.trim();
    const district = districtSelect.value.trim();
    
    if (state && district) {
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
    analyseBtnText.textContent = "Analyzing...";

    // Scroll to loading spinner
    setTimeout(() => {
        loadingSpinner.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);

    // ✅ UPDATED: Prepare form data to match backend requirements
    const formData = new FormData();
    formData.append("file", appState.imageFile);  // ✅ Changed from "image" to "file"
    formData.append("lat", appState.location.lat.toString());  // ✅ Separate lat field
    formData.append("lon", appState.location.lon.toString());  // ✅ Separate lon field

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
        appState.result = data.summary;

        // Hide loading, show results
        loadingSpinner.classList.add("hidden");
        renderSummary(data.summary);
        summarySection.classList.remove("hidden");

        // Scroll to summary
        setTimeout(() => {
            summarySection.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);

    } catch (error) {
        console.error("Analysis error:", error);
        
        loadingSpinner.classList.add("hidden");
        
        alert(`❌ Analysis failed: ${error.message}\n\nPossible reasons:\n• API server is down or sleeping\n• Network connectivity issues\n• Invalid response from server\n\nPlease try again in a moment.`);
        
        // Re-enable analyse button
        analyseBtn.disabled = false;
        checkAnalyseButtonState();
    }
}

// ================== RENDER SUMMARY ==================
function renderSummary(summary) {
    console.log("Rendering summary:", summary);

    // Create formatted HTML for summary
    let summaryHTML = `
        <div class="space-y-4">
            <div class="border-b border-gray-200 pb-3">
                <h4 class="text-sm font-bold text-gray-500 uppercase mb-2">Soil Analysis</h4>
                <p class="text-lg"><span class="font-semibold">Soil Type:</span> ${summary.soil_type || 'N/A'}</p>
            </div>

            <div class="border-b border-gray-200 pb-3">
                <h4 class="text-sm font-bold text-gray-500 uppercase mb-2">Weather Conditions</h4>
                <p><span class="font-semibold">Current Weather:</span> ${summary.weather || 'N/A'}</p>
                <p><span class="font-semibold">Rainfall Estimate:</span> ${summary.rainfall_est || 'N/A'}</p>
            </div>

            <div class="border-b border-gray-200 pb-3">
                <h4 class="text-sm font-bold text-gray-500 uppercase mb-2">Crop Recommendations</h4>
                <p class="text-lg text-cow-dung-green font-bold mb-2">🌾 Recommended: ${summary.recommended_crop || 'N/A'}</p>
                <p class="font-semibold mb-1">Top 3 Suitable Crops:</p>
                <ul class="list-disc list-inside ml-4 space-y-1">
                    ${summary.top_3_crops ? summary.top_3_crops.map(crop => `<li>${crop}</li>`).join('') : '<li>No data available</li>'}
                </ul>
            </div>

            <div>
                <h4 class="text-sm font-bold text-gray-500 uppercase mb-2">Nutrient Profile</h4>
                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-blue-50 p-3 rounded-lg">
                        <p class="text-xs text-gray-600">Nitrogen (N)</p>
                        <p class="text-xl font-bold text-blue-600">${summary.nutrient_profile?.N || 'N/A'}</p>
                    </div>
                    <div class="bg-orange-50 p-3 rounded-lg">
                        <p class="text-xs text-gray-600">Phosphorus (P)</p>
                        <p class="text-xl font-bold text-orange-600">${summary.nutrient_profile?.P || 'N/A'}</p>
                    </div>
                    <div class="bg-purple-50 p-3 rounded-lg">
                        <p class="text-xs text-gray-600">Potassium (K)</p>
                        <p class="text-xl font-bold text-purple-600">${summary.nutrient_profile?.K || 'N/A'}</p>
                    </div>
                    <div class="bg-green-50 p-3 rounded-lg">
                        <p class="text-xs text-gray-600">pH Level</p>
                        <p class="text-xl font-bold text-green-600">${summary.nutrient_profile?.ph || 'N/A'}</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    summaryText.innerHTML = summaryHTML;
}

// ================== PDF DOWNLOAD ==================
async function handleDownloadPDF() {
    if (!appState.result) {
        alert("⚠️ No report available to download.");
        return;
    }

    console.log("Generating PDF...");

    // Change button state
    const originalHTML = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
    downloadBtn.disabled = true;

    try {
        // Create PDF content
        const pdfContent = generatePDFContent();
        
        // Create a simple HTML-based PDF using print
        const printWindow = window.open('', '', 'height=800,width=800');
        printWindow.document.write(pdfContent);
        printWindow.document.close();
        
        // Wait for content to load
        setTimeout(() => {
            printWindow.print();
            
            // Reset button
            downloadBtn.innerHTML = originalHTML;
            downloadBtn.disabled = false;
        }, 500);

    } catch (error) {
        console.error("PDF generation error:", error);
        alert("❌ Failed to generate PDF. Please try again.");
        
        downloadBtn.innerHTML = originalHTML;
        downloadBtn.disabled = false;
    }
}

function generatePDFContent() {
    const result = appState.result;
    const date = new Date().toLocaleDateString('en-IN');
    const time = new Date().toLocaleTimeString('en-IN');

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Soil Health Report</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 40px;
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                }
                .header {
                    text-align: center;
                    border-bottom: 3px solid #4A5D23;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .header h1 {
                    color: #4A5D23;
                    margin: 0;
                    font-size: 32px;
                }
                .header p {
                    color: #666;
                    margin: 5px 0;
                }
                .section {
                    margin-bottom: 25px;
                    padding: 15px;
                    border-left: 4px solid #4A5D23;
                    background: #f9fafb;
                }
                .section h2 {
                    color: #4A5D23;
                    font-size: 18px;
                    margin-top: 0;
                    margin-bottom: 10px;
                }
                .section p {
                    margin: 8px 0;
                    line-height: 1.6;
                }
                .highlight {
                    background: #4A5D23;
                    color: white;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 20px 0;
                }
                .highlight h3 {
                    margin: 0 0 10px 0;
                }
                .nutrient-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin-top: 15px;
                }
                .nutrient-box {
                    padding: 15px;
                    border: 2px solid #4A5D23;
                    border-radius: 8px;
                    text-align: center;
                }
                .nutrient-box h4 {
                    margin: 0 0 5px 0;
                    color: #666;
                    font-size: 14px;
                }
                .nutrient-box p {
                    margin: 0;
                    font-size: 24px;
                    font-weight: bold;
                    color: #4A5D23;
                }
                ul {
                    margin: 10px 0;
                    padding-left: 20px;
                }
                li {
                    margin: 5px 0;
                }
                .footer {
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 2px solid #ddd;
                    text-align: center;
                    color: #666;
                    font-size: 12px;
                }
                @media print {
                    body {
                        padding: 20px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🌾 Soil Health Report</h1>
                <p><strong>Growmore - AgriMind AI</strong></p>
                <p>Generated: ${date} at ${time}</p>
                ${appState.location.state ? `<p>Location: ${appState.location.district}, ${appState.location.state}</p>` : ''}
            </div>

            <div class="section">
                <h2>📊 Soil Analysis</h2>
                <p><strong>Soil Type:</strong> ${result.soil_type || 'N/A'}</p>
            </div>

            <div class="section">
                <h2>🌤️ Weather Conditions</h2>
                <p><strong>Current Weather:</strong> ${result.weather || 'N/A'}</p>
                <p><strong>Rainfall Estimate:</strong> ${result.rainfall_est || 'N/A'}</p>
            </div>

            <div class="highlight">
                <h3>🌾 Recommended Crop</h3>
                <p style="font-size: 24px; margin: 0;"><strong>${result.recommended_crop || 'N/A'}</strong></p>
            </div>

            <div class="section">
                <h2>🌱 Top 3 Suitable Crops</h2>
                <ul>
                    ${result.top_3_crops ? result.top_3_crops.map(crop => `<li>${crop}</li>`).join('') : '<li>No data available</li>'}
                </ul>
            </div>

            <div class="section">
                <h2>🧪 Nutrient Profile</h2>
                <div class="nutrient-grid">
                    <div class="nutrient-box">
                        <h4>Nitrogen (N)</h4>
                        <p>${result.nutrient_profile?.N || 'N/A'}</p>
                    </div>
                    <div class="nutrient-box">
                        <h4>Phosphorus (P)</h4>
                        <p>${result.nutrient_profile?.P || 'N/A'}</p>
                    </div>
                    <div class="nutrient-box">
                        <h4>Potassium (K)</h4>
                        <p>${result.nutrient_profile?.K || 'N/A'}</p>
                    </div>
                    <div class="nutrient-box">
                        <h4>pH Level</h4>
                        <p>${result.nutrient_profile?.ph || 'N/A'}</p>
                    </div>
                </div>
            </div>

            <div class="footer">
                <p>&copy; 2025 AgriMind AI - Growmore Platform</p>
                <p>This report is generated based on AI analysis and should be verified with local agricultural experts.</p>
            </div>
        </body>
        </html>
    `;
}

console.log("Script loaded successfully!");