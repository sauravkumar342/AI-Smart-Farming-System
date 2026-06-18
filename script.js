// ⚡ Energy Status (Battery Info)
let batteryLevel = 1; // default full
let isCharging = true;

if ('getBattery' in navigator) {
    navigator.getBattery().then(function (battery) {

        batteryLevel = battery.level;
        isCharging = battery.charging;

        console.log("🔋 Battery Level:", batteryLevel * 100 + "%");
        console.log("⚡ Charging:", isCharging);

    });
}





function drawChart(data) {
    console.log("DRAW CHART RUNNING ✅", data);

    const ctx = document.getElementById('myChart');
    if (!ctx) {
        console.log("Canvas NOT FOUND ❌");
        return;
    }

    if (window.myChart && typeof window.myChart.destroy === "function") {
        window.myChart.destroy();
    }
    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['N', 'P', 'K', 'Temp', 'Humidity', 'pH', 'Rainfall'],
            datasets: [{
                label: 'User Input',
                data: data,
                backgroundColor: [
                    '#4CAF50', '#2196F3', '#FF9800',
                    '#9C27B0', '#00BCD4', '#E91E63', '#FFC107'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}


document.addEventListener("DOMContentLoaded", function () {

    console.log("DOM READY ✅");

    const form = document.getElementById("crop-form");

    if (!form) {
        console.log("FORM NOT FOUND ❌");
        return;
    }

    console.log("FORM FOUND ✅");
    form.addEventListener("submit", function (e) {

        e.preventDefault();

        console.log("FORM SUBMITTED ✅");

        // 🌫 Fog Layer start (local processing)
        let N = parseFloat(form.N.value);
        let P = parseFloat(form.P.value);
        let K = parseFloat(form.K.value);
        let temp = parseFloat(form.temperature.value);
        let hum = parseFloat(form.humidity.value);
        let ph = parseFloat(form.ph.value);
        let rain = parseFloat(form.rainfall.value);

        console.log("📊 Local Data:", N, P, K, temp, hum, ph, rain);
        // 🌫 STEP 2: Local Validation (Fog Decision)

        if (isNaN(N) || isNaN(P) || isNaN(K) || isNaN(temp) || isNaN(hum) || isNaN(ph) || isNaN(rain)) {
            alert("❌ Please fill all fields correctly");
            return;
        }

        if (N < 0 || P < 0 || K < 0) {
            alert("❌ Nutrients (NPK) negative nahi ho sakte");
            return;
        }

        if (ph < 0 || ph > 14) {
            alert("❌ pH value 0–14 ke beech honi chahiye");
            return;
        }

        if (temp < -10 || temp > 60) {
            alert("❌ Temperature unrealistic hai");
            return;
        }

        console.log("✅ Validation Passed (Fog Layer)");




        // 🌫 STEP 3: Local Crop Prediction (Mini AI)

        let localCrop = "";

        if (temp > 25 && hum > 70 && rain > 100) {
            localCrop = "🌾 Rice (Fog Prediction)";
        }
        else if (temp < 25 && hum < 60) {
            localCrop = "🌾 Wheat (Fog Prediction)";
        }
        else if (temp > 20 && temp < 35 && rain < 100) {
            localCrop = "🌽 Maize (Fog Prediction)";
        }
        else {
            localCrop = "🌱 Mixed Crops (Fog Prediction)";
        }

        console.log("⚡ Local Crop:", localCrop);

        // 👉 Show instant result on screen
        document.getElementById("result-box").innerHTML = `
    <h2>⚡ Instant Result (Fog): ${localCrop}</h2>
    <p>⏳ Final AI result loading...</p>
`;



        // 🌐 Check Internet
        if (!navigator.onLine) {

            console.log("📴 Offline Mode");

            // Save data locally
            let offlineData = {
                N, P, K, temp, hum, ph, rain
            };

            localStorage.setItem("offlineFormData", JSON.stringify(offlineData));

            document.getElementById("result-box").innerHTML = `
        <h2>📴 Offline Mode</h2>
        <p>Data saved. Internet aane par auto send hoga.</p>
    `;

            return;
        }


        // ⚡ Energy-Aware Decision (YAHI ADD KARNA HAI)
        if (batteryLevel < 0.3 && !isCharging) {

            console.log("🔋 Low Battery Mode ON");

            document.getElementById("result-box").innerHTML += `
        <p>🔋 Low Battery: Showing only Fog result (saving energy)</p>
    `;

            return; // ❌ yahin stop ho jayega
        }

        // 🌐 STEP 4: Send to Server (Cloud AI)

        let formData = new FormData(form);

        fetch("/predict_ajax", {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(data => {

                console.log("🌐 Server Data:", data);

                // ✅ Final result overwrite (Cloud result)
                document.getElementById("result-box").innerHTML = `
                <h2>🌾 Final Crop: ${data.prediction}</h2>
                <h3>🧪 Fertilizer: ${data.fertilizer}</h3>
                <h3>🌱 Soil: ${data.soil}</h3>
                <h3>📈 Expected Yield: ${data.yield} kg/hectare</h3>
                <h3>💧 Irrigation: ${data.irrigation}</h3>
                <h3>🗓 Fertilizer Schedule: ${data.fertilizer_schedule}</h3>
            `;

                // 📊 Chart update
                drawChart(data.chart_data);

            })
            .catch(err => {
                console.log("ERROR:", err);
            });
    });

});














function sendMessage() {
    let input = document.getElementById("user-input");
    let message = input.value;

    if (message.trim() === "") return;

    let chatBox = document.getElementById("chat-box");

    // User message
    chatBox.innerHTML += `<div class="user-msg">${message}</div>`;

    // Send to backend
    fetch("/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ msg: message })
    })
        .then(res => res.json())
        .then(data => {
            chatBox.innerHTML += `<div class="bot-msg">${data.reply}</div>`;
            chatBox.scrollTop = chatBox.scrollHeight;
        });

    input.value = "";
}

function showSection(section) {
    document.querySelectorAll(".section").forEach(sec => {
        sec.style.display = "none";
    });

    document.getElementById(section + "-section").style.display = "block";
}



function showResource(type) {

    let content = "";

    if (type === "schemes") {
        content = `
        <h3>🏛 Government Schemes</h3>
        <p>PM-KISAN: ₹6000 per year support</p>
        <p>Soil Health Card Scheme</p>
        <p>Pradhan Mantri Fasal Bima Yojana</p>
        <p>url: <a href="https://www.india.gov.in/topics/agriculture" target="_blank">india.gov.in/topics/agriculture</a></p>
        <p>url: <a href="https://agriwelfare.gov.in/en/Major" target="_blank">agriwelfare.gov.in/en/Major-Schemes</a></p>
        <p>url: <a href="https://www.farmers.gov.in" target="_blank">farmers.gov.in</a></p>
        <p>url: <a href="https://www.myscheme.gov.in/search/category/Agriculture,Rural%20%26%20Environment" target="_blank">www.myscheme.gov.in</a></p>
        `;
    }

    else if (type === "weather") {
        content = `
        <h3>🌦 Weather Info</h3>
        <p>Check temperature, rainfall and humidity.</p>
        <p>Use weather section above for live data.</p>
        <p>url: <a href="https://city.imd.gov.in/citywx/responsive/" target="_blank">city.imd.gov.in/citywx/responsive/</a></p>
        <p>url: <a href="https://www.accuweather.com/" target="_blank">accuweather.com</a></p>  
        <p>url: <a href="https://weather.com/en-IN/weather/today/l/25.45,81.85" target="_blank">weather.com/en-IN/weather/today/l/25.45,81.85</a></p>
        `;
    }

    else if (type === "mandi") {
        content = `
        <h3>💰 Mandi Rates</h3>
        <p>Wheat: ₹2200/quintal</p>
        <p>Rice: ₹2000/quintal</p>
        <p>Maize: ₹1800/quintal</p>
        <p>url: <a href="https://www.commodityonline.com/mandiprices" target="_blank">commodityonline.com/mandiprices</a></p>
        <p>url: <a href="https://agmarknet.gov.in/home" target="_blank">agmarknet.gov.in/home</a></p>
        <p>url: <a href="https://www.data.gov.in/catalog/current-daily-price-various-commodities-various-markets-mandi" target="_blank">data.gov.in/catalog/current-daily-price-various-commodities-various-markets-mandi</a></p>
        <p>url: <a href="https://mandi.krishlal.com/" target="_blank">mandi.krishlal.com</a></p>
        `;
    }

    else if (type === "calendar") {
        content = `
        <h3>📅 Crop Calendar</h3>
        <p>Rabi Crops: Oct–March</p>
        <p>Kharif Crops: June–Oct</p>
        <p>url: <a href="https://www.ncdex.com/downloads/NCDEX_crop_calender_copy.pdf" target="_blank">NCDEX Crop Calendar</a></p>
        <p>url: <a href="https://krishijagran.com/crop-calendar/" target="_blank">Krishijagran Crop Calendar</a></p>
        <p>url: <a href="https://www.indiascienceandtechnology.gov.in/sites/default/files/Crop%20Calendar.pdf" target="_blank">Government Crop Calendar</a></p>
        `;
    }

    else if (type === "videos") {
        content = `
        <h3>🎥 Farming Videos</h3>
        <iframe width="100%" height="200" src="https://www.youtube.com/embed/LGF33NN4B8U?si=HELvgzsSBLqMsauL" frameborder="0" allowfullscreen></iframe>
        `;
    }

    else if (type === "loan") {
        content = `
        <h3>🏦 Loan Help</h3>
        <p>Kisan Credit Card (KCC)</p>
        <p>Low interest agriculture loans</p>
        `;
    }

    else if (type === "tools") {
        content = `
        <h3>⚙ Tools & Equipment</h3>
        <p>Tractor, Seed Drill, Sprayer</p>
        <p>Modern AI farming tools</p>
        `;
    }


    document.getElementById("resource-content").innerHTML = content;
}



function showLatest(type) {

    let content = "";

    if (type === "news") {
        content = `
        <h3>📰 Agriculture News</h3>
        <p>New irrigation policies launched</p>
        <p>Organic farming demand increasing</p>
        <p>url: <a href="https://krishijagran.com/" target="_blank">krishijagran.com</a></p>
        <P>url: <a href="https://www.agriculture.com/news" target="_blank">agriculture.com/news</a></p>
        <p>url: <a href="https://www.farmprogress.com/news" target="_blank">farmprogress.com/news</a></p>
        <P>url: <a href="https://agrinews.in/" target="_blank">agrinews.in</a></p>
        `;
    }

    else if (type === "weather_alert") {
        content = `
        <h3>🌦 Weather Alerts</h3>
        <p>⚠ Heatwave expected next week</p>
        <p>🌧 Heavy rainfall alert in some regions</p>
        <p>url: <a href="https://www.accuweather.com/en-IN/weather-news" target="_blank">accuweather.com/en-IN/weather-news</a></p>
        <p>url: <a href="https://weather.com/en-IN/weather/today/l/25.45,81.85" target="_blank">weather.com/en-IN/weather/today/l/25.45,81.85</a></p>
        <p>url: <a href="https://city.imd.gov.in/citywx/responsive/" target="_blank">city.imd.gov.in/citywx/responsive/</a></p>
        <p>url: <a href="https://www.imd.gov.in/section/nhac/dynamic/weather_alerts.htm" target="_blank">imd.gov.in/section/nhac/dynamic/weather_alerts.htm</a></p>
        `;
    }

    else if (type === "schemes_update") {
        content = `
        <h3>🏛 Scheme Updates</h3>
        <p>PM-KISAN new installment released</p>
        <p>New subsidy for drip irrigation</p>
        <p>url: <a href="https://www.india.gov.in/topics/agriculture" target="_blank">india.gov.in/topics/agriculture</a></p>
        <p>url: <a href="https://agriwelfare.gov.in/en/Major" target="_blank">agriwelfare.gov.in/en/Major-Schemes</a></p>
        <p>url: <a href="https://www.farmers.gov.in" target="_blank">farmers.gov.in</a></p>
        <p>url: <a href="https://www.myscheme.gov.in/search/category/Agriculture,Rural%20%26%20Environment" target="_blank">www.myscheme.gov.in</a></p>
        `;
    }

    else if (type === "market_trend") {
        content = `
        <h3>📈 Market Trends</h3>
        <p>Wheat price increasing</p>
        <p>Rice demand stable</p>
        <p>url: <a href="https://www.agriculture.com/market-trends" target="_blank">agriculture.com/market-trends</a></p>
        <p>url: <a href="https://www.farmprogress.com/market-trends" target="_blank">farmprogress.com/market-trends</a></p>
        <p>url: <a href="https://www.commodityonline.com/mandiprices" target="_blank">commodityonline.com/mandiprices</a></p>
        <p>url: <a href="https://agmarknet.gov.in/home" target="_blank">agmarknet.gov.in/home</a></p>
        <p>url: <a href="https://www.data.gov.in/catalog/current-daily-price-various-commodities-various-markets-mandi" target="_blank">data.gov.in/catalog/current-daily-price-various-commodities-various-markets-mandi</a></p>
        <p>url: <a href="https://mandi.krishlal.com/" target="_blank">mandi.krishlal.com</a></p>
        `;
    }

    else if (type === "govt_news") {
        content = `
        <h3>🏢 Govt Announcements</h3>
        <p>New farming policies announced</p>
        <p>Subsidy schemes updated</p>
        <p>url: <a href="https://www.india.gov.in/topics/agriculture" target="_blank">india.gov.in/topics/agriculture</a></p>
        <p>url: <a href="https://agriwelfare.gov.in/en/Major" target="_blank">agriwelfare.gov.in/en/Major-Schemes</a></p>
        <p>url: <a href="https://www.farmers.gov.in" target="_blank">farmers.gov.in</a></p>
        <p>url: <a href="https://www.myscheme.gov.in/search/category/Agriculture,Rural%20%26%20Environment" target="_blank">www.myscheme.gov.in</a></p>
        <p>url: <a href="https://pib.gov.in/PressReleasePage.aspx?PRID=1831234" target="_blank">pib.gov.in/PressReleasePage.aspx?PRID=1831234</a></p>
        `;
    }

    else if (type === "technology") {
        content = `
        <h3>🤖 Farming Technology</h3>
        <p>AI-based crop monitoring</p>
        <p>Drone spraying technology</p>
        <p>url: <a href="https://www.agritech.com/farming-technology" target="_blank">agritech.com/farming-technology</a></p>
        <p>url: <a href="https://www.dji.com/agras" target="_blank">dji.com/agras</a></p>
        <p>url: <a href="https://www.precisionag.com" target="_blank">precisionag.com</a></p>
        <p>url: <a href="https://www.farmprogress.com/technology" target="_blank">farmprogress.com/technology</a></p>
        <p>url: <a href="https://www.agriculture.com/technology" target="_blank">agriculture.com/technology</a></p>
        <p>url: <a href="https://www.agritech.com/farming-technology" target="_blank">agritech.com/farming-technology</a></p>
        `;
    }

    document.getElementById("latest-content").innerHTML = content;
}


// 📅 Show/Hide calendar
function toggleCalendar() {
    let popup = document.getElementById("calendar-popup");

    if (popup.style.display === "block") {
        popup.style.display = "none";
    } else {
        popup.style.display = "block";
    }
}

// 📆 Crop calendar logic
document.addEventListener("DOMContentLoaded", function () {

    const dateInput = document.getElementById("calendar-date");

    if (!dateInput) return;

    dateInput.addEventListener("change", function () {

        let date = new Date(this.value);
        let month = date.getMonth() + 1;

        let result = "";

        if (month >= 6 && month <= 7) {
            result = "🌾 Best time for Rice sowing";
        } else if (month >= 10 && month <= 11) {
            result = "🌾 Best time for Wheat sowing";
        } else if (month >= 3 && month <= 4) {
            result = "🌽 Good for Maize & Vegetables";
        } else {
            result = "🌱 General farming season";
        }

        document.getElementById("calendar-result").innerText = result;

    });

});

window.addEventListener("scroll", () => {
    document.querySelectorAll(".blog-card").forEach(card => {
        const top = card.getBoundingClientRect().top;
        if (top < window.innerHeight - 50) {
            card.classList.add("show");
        }
    });
});

function openBlog(blogId) {
    window.location.href = "/blog/" + blogId;
}




// 🔥 Register Service Worker (Offline Mode)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/static/js/sw.js')
        .then(() => console.log("SW Registered ✅"))
        .catch(err => console.log("SW Error ❌", err));
}



// 🔄 Auto Sync when back online
window.addEventListener("online", function () {

    console.log("🌐 Back Online");

    let savedData = localStorage.getItem("offlineFormData");

    if (savedData) {

        let data = JSON.parse(savedData);

        let formData = new FormData();
        formData.append("N", data.N);
        formData.append("P", data.P);
        formData.append("K", data.K);
        formData.append("temperature", data.temp);
        formData.append("humidity", data.hum);
        formData.append("ph", data.ph);
        formData.append("rainfall", data.rain);

        fetch("/predict_ajax", {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(data => {

                document.getElementById("result-box").innerHTML = `
                <h2>🌾 Synced Crop: ${data.prediction}</h2>
            `;

                localStorage.removeItem("offlineFormData");

            });

    }

});