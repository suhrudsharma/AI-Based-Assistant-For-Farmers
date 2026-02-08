const detectBtn = document.getElementById("detectBtn");
const locationSpan = document.getElementById("location");
const seasonSpan = document.getElementById("season");

detectBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
        locationSpan.textContent = "Geolocation not supported";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        successCallback,
        errorCallback
    );
});

function successCallback(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    locationSpan.textContent = `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;

    const season = detectSeason(new Date());
    seasonSpan.textContent = season;
}

function errorCallback(error) {
    locationSpan.textContent = "Location access denied";
    seasonSpan.textContent = "Manual selection needed";
}

function detectSeason(date) {
    const month = date.getMonth() + 1; // 1–12

    if (month >= 6 && month <= 10) {
        return "Kharif (Monsoon Season)";
    } else if (month >= 10 || month <= 2) {
        return "Rabi (Winter Season)";
    } else {
        return "Zaid (Summer Season)";
    }
}
