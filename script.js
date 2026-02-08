// ================== DOM ELEMENTS ==================
const locationStatus = document.getElementById("locationStatus");
const manualSection = document.getElementById("manualSection");
const analyseBtn = document.getElementById("analyseBtn");

const stateSelect = document.getElementById("stateSelect");
const districtSelect = document.getElementById("districtSelect");
const confirmBtn = document.getElementById("confirmLocation");

const imageInput = document.getElementById("imageInput");

const summarySection = document.getElementById("summarySection");
const summaryText = document.getElementById("summaryText");
const downloadBtn = document.getElementById("downloadBtn");

// ================== GLOBAL STATE ==================
let appState = {
    location: null,
    image: null,
    result: null
};

// ================== ON LOAD ==================
window.addEventListener("load", () => {
    requestLocation();
});

// ================== LOCATION ==================
function requestLocation() {
    if (!navigator.geolocation) {
        showManual("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        pos => {
            appState.location = {
                lat: pos.coords.latitude,
                lon: pos.coords.longitude
            };
            locationStatus.textContent = "📍 Location detected automatically";
        },
        () => {
            showManual("📍 Location permission denied");
        }
    );
}

function showManual(msg) {
    locationStatus.textContent = msg;
    manualSection.classList.remove("hidden");
    manualSection.scrollIntoView({ behavior: "smooth" });
}

confirmBtn.addEventListener("click", () => {
    if (!stateSelect.value || !districtSelect.value) {
        alert("Select state and district");
        return;
    }

    appState.location = {
        state: stateSelect.value,
        district: districtSelect.value
    };

    locationStatus.textContent = "📍 Location set manually";
});

// ================== IMAGE ==================
imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    appState.image = file;
    analyseBtn.disabled = false;
});

// ================== ANALYSE ==================
analyseBtn.addEventListener("click", async () => {
    if (!appState.location || !appState.image) {
        alert("Location and image required");
        return;
    }

    summaryText.textContent = "Analysing soil and climate...";
    summarySection.classList.remove("hidden");

    const formData = new FormData();
    formData.append("image", appState.image);
    formData.append("location", JSON.stringify(appState.location));

    try {
        const res = await fetch(
            "https://nirmalll17-devsoc.hf.space/predict",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await res.json();

        if (data.status !== "success") {
            summaryText.textContent = "Analysis failed";
            return;
        }

        appState.result = data.summary;
        renderSummary(data.summary);

    } catch (err) {
        console.error(err);
        summaryText.textContent = "Server error";
    }
});

// ================== RENDER SUMMARY ==================
function renderSummary(summary) {
    summaryText.innerHTML = `
<b>Soil Type:</b> ${summary.soil_type}<br>
<b>Weather:</b> ${summary.weather}<br>
<b>Rainfall:</b> ${summary.rainfall_est}<br><br>

<b>Recommended Crop:</b> ${summary.recommended_crop}<br>
<b>Top 3 Crops:</b>
<ul>
${summary.top_3_crops.map(c => `<li>${c}</li>`).join("")}
</ul>

<b>Nutrient Profile:</b><br>
N: ${summary.nutrient_profile.N}<br>
P: ${summary.nutrient_profile.P}<br>
K: ${summary.nutrient_profile.K}<br>
pH: ${summary.nutrient_profile.ph}
    `;
}

// ================== DOWNLOAD ==================
downloadBtn.addEventListener("click", () => {
    if (!appState.result) return;

    const text = JSON.stringify(appState.result, null, 2);
    const blob = new Blob([text], { type: "application/json" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "farmer_summary.json";
    a.click();
});
