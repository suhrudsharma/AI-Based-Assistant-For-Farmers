const autoBtn = document.getElementById("autoLocate");
const manualBtn = document.getElementById("manualBtn");
const drawer = document.getElementById("manualDrawer");
const statusText = document.getElementById("status");
const manualDiv = document.getElementById("manual");
const locationSpan = document.getElementById("location");
const seasonSpan = document.getElementById("season");

const stateSelect = document.getElementById("stateSelect");
const districtSelect = document.getElementById("districtSelect");
const stateSearch = document.getElementById("stateSearch");
const districtSearch = document.getElementById("districtSearch");
const confirmBtn = document.getElementById("confirmLocation");

let indiaData = {};
let currentState = "";

/* ---------- STEP 1: ASK LOCATION ON LOAD ---------- */
window.onload = () => {
    loadIndiaData();
};
autoBtn.addEventListener("click", askForLocation);

manualBtn.addEventListener("click", () => {
    drawer.classList.toggle("hidden");
});


function askForLocation() {
    if (!navigator.geolocation) {
        showManual("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        pos => {
            locationSpan.textContent =
                `Lat: ${pos.coords.latitude.toFixed(3)}, Lon: ${pos.coords.longitude.toFixed(3)}`;
            statusText.textContent = "Location detected automatically";
            seasonSpan.textContent = detectSeason();
        },
        () => showManual("Location permission denied")
    );
}

/* ---------- STEP 2: LOAD STATES & DISTRICTS ---------- */
async function loadIndiaData() {
    const res = await fetch("data/india_states_districts.json");
    indiaData = await res.json();

    populateStates(Object.keys(indiaData));
}

/* ---------- STATE DROPDOWN ---------- */
function populateStates(states) {
    stateSelect.innerHTML = "";
    states.forEach(state => {
        const opt = document.createElement("option");
        opt.value = state;
        opt.textContent = state;
        stateSelect.appendChild(opt);
    });
}

/* ---------- DISTRICT DROPDOWN ---------- */
function populateDistricts(state) {
    districtSelect.innerHTML = "";
    indiaData[state].forEach(dist => {
        const opt = document.createElement("option");
        opt.value = dist;
        opt.textContent = dist;
        districtSelect.appendChild(opt);
    });
}

/* ---------- SEARCH SUPPORT ---------- */
stateSearch.addEventListener("input", () => {
    const val = stateSearch.value.toLowerCase();
    const filtered = Object.keys(indiaData)
        .filter(s => s.toLowerCase().includes(val));
    populateStates(filtered);
});

stateSelect.addEventListener("change", () => {
    currentState = stateSelect.value;
    populateDistricts(currentState);
});

districtSearch.addEventListener("input", () => {
    const val = districtSearch.value.toLowerCase();
    const filtered = indiaData[currentState]
        .filter(d => d.toLowerCase().includes(val));
    districtSelect.innerHTML = "";
    filtered.forEach(d => {
        const opt = document.createElement("option");
        opt.value = d;
        opt.textContent = d;
        districtSelect.appendChild(opt);
    });
});

/* ---------- CONFIRM MANUAL LOCATION ---------- */
confirmBtn.addEventListener("click", () => {
    if (!stateSelect.value || !districtSelect.value) {
        alert("Select state and district");
        return;
    }

    locationSpan.textContent =
        `${districtSelect.value}, ${stateSelect.value}`;

    statusText.textContent = "Location set manually";
    seasonSpan.textContent = detectSeason();

    drawer.classList.add("hidden");
});


/* ---------- HELPERS ---------- */
function showManual(message) {
    statusText.textContent = message;
    drawer.classList.remove("hidden");
}


function detectSeason() {
    const m = new Date().getMonth() + 1;
    if (m >= 6 && m <= 10) return "Kharif";
    if (m >= 10 || m <= 2) return "Rabi";
    return "Zaid";
}
