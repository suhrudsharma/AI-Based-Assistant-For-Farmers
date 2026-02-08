const locationStatus = document.getElementById("locationStatus");
const manualSection = document.getElementById("manualSection");
const analyseBtn = document.getElementById("analyseBtn");

const stateSearch = document.getElementById("stateSearch");
const districtSearch = document.getElementById("districtSearch");
const stateSelect = document.getElementById("stateSelect");
const districtSelect = document.getElementById("districtSelect");
const confirmBtn = document.getElementById("confirmLocation");

const summarySection = document.getElementById("summarySection");
const summaryText = document.getElementById("summaryText");
const downloadBtn = document.getElementById("downloadBtn");

let indiaData = {};
let currentState = "";
let finalLocation = "";

/* -------- ON LOAD: ASK LOCATION IMMEDIATELY -------- */
window.onload = () => {
    loadIndiaData();
    requestLocation();
};

/* -------- LOCATION -------- */
function requestLocation() {
    if (!navigator.geolocation) {
        showManual("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        pos => {
            locationStatus.textContent = "📍 Location detected automatically";
            finalLocation = `Lat ${pos.coords.latitude.toFixed(2)}, Lon ${pos.coords.longitude.toFixed(2)}`;
            analyseBtn.disabled = false;
        },
        () => {
            showManual("📍 Location permission denied");
        }
    );
}

function showManual(message) {
    locationStatus.textContent = message;
    manualSection.classList.remove("hidden");
    manualSection.scrollIntoView({ behavior: "smooth" });
}

/* -------- LOAD DATA -------- */
async function loadIndiaData() {
    const res = await fetch("data/india_states_districts.json");
    indiaData = await res.json();
    populateStates(Object.keys(indiaData));
}

/* -------- STATE SEARCH -------- */
stateSearch.addEventListener("input", () => {
    const val = stateSearch.value.toLowerCase();
    const filtered = Object.keys(indiaData).filter(s =>
        s.toLowerCase().includes(val)
    );
    populateStates(filtered);
});

/* -------- DISTRICT SEARCH -------- */
districtSearch.addEventListener("input", () => {
    if (!currentState) return;
    const val = districtSearch.value.toLowerCase();
    const filtered = indiaData[currentState].filter(d =>
        d.toLowerCase().includes(val)
    );
    populateDistricts(filtered);
});

/* -------- DROPDOWNS -------- */
function populateStates(states) {
    stateSelect.innerHTML = "";
    states.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s;
        opt.textContent = s;
        stateSelect.appendChild(opt);
    });
}

stateSelect.addEventListener("change", () => {
    currentState = stateSelect.value;
    populateDistricts(indiaData[currentState]);
});

function populateDistricts(districts) {
    districtSelect.innerHTML = "";
    districts.forEach(d => {
        const opt = document.createElement("option");
        opt.value = d;
        opt.textContent = d;
        districtSelect.appendChild(opt);
    });
}

/* -------- CONFIRM MANUAL LOCATION -------- */
confirmBtn.addEventListener("click", () => {
    if (!stateSelect.value || !districtSelect.value) {
        alert("Select state and district");
        return;
    }

    finalLocation = `${districtSelect.value}, ${stateSelect.value}`;
    locationStatus.textContent = "📍 Location set manually";
    analyseBtn.disabled = false;
});

/* -------- ANALYSE -------- */
analyseBtn.addEventListener("click", () => {
    summaryText.textContent =
        `Location: ${finalLocation}\nSeason: ${detectSeason()}`;
    summarySection.classList.remove("hidden");
    summarySection.scrollIntoView({ behavior: "smooth" });
});

/* -------- DOWNLOAD SUMMARY -------- */
downloadBtn.addEventListener("click", () => {
    const blob = new Blob([summaryText.textContent], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "farmer_summary.txt";
    a.click();
});

/* -------- SEASON -------- */
function detectSeason() {
    const m = new Date().getMonth() + 1;
    if (m >= 6 && m <= 10) return "Kharif";
    if (m >= 10 || m <= 2) return "Rabi";
    return "Zaid";
}
