// ==========================
// Format Uptime
// ==========================

function formatUptime(seconds) {

    seconds = Number(seconds);

    const days = Math.floor(seconds / 86400);

    const hours = Math.floor((seconds % 86400) / 3600);

    const minutes = Math.floor((seconds % 3600) / 60);

    return `${days}d ${hours}h ${minutes}m`;

}

// ==========================
// System Information
// ==========================

async function loadSystemInfo() {

    try {

        const response = await fetch("/api/system");

        const data = await response.json();

        document.getElementById("hostname").textContent =
            data.hostname;

        document.getElementById("platform").textContent =
            data.platform;

        document.getElementById("architecture").textContent =
            data.architecture;

        document.getElementById("nodeVersion").textContent =
            data.nodeVersion;

        document.getElementById("uptime").textContent =
            formatUptime(data.uptime);

        document.getElementById("memoryPercent").textContent =
            data.memoryUsage + "%";

        document.getElementById("memoryBar").style.width =
            data.memoryUsage + "%";

        document.getElementById("usedMemory").textContent =
            data.usedMemory + " GB";

        document.getElementById("freeMemory").textContent =
            data.freeMemory + " GB";

        document.getElementById("cpuLoad").textContent =
            data.cpuUsage + " %";

        document.getElementById("diskUsage").textContent =
            data.diskUsage + " %";

    }

    catch (err) {

        console.log(err);

    }

}

// ==========================
// Deployment
// ==========================

async function loadDeployment() {

    try {

        const response = await fetch("/api/deployment");

        const data = await response.json();

        document.getElementById("version").textContent =
            data.version;

        document.getElementById("build").textContent =
            data.build;

        document.getElementById("commit").textContent =
            data.commit;

        document.getElementById("lastDeployment").textContent =
            data.lastDeployment;

        document.getElementById("pipeline").textContent =
            data.pipeline;

    }

    catch (err) {

        console.log(err);

    }

}

// ==========================
// PM2
// ==========================

async function loadPM2() {

    try {

        const response = await fetch("/api/pm2");

        const data = await response.json();

        document.getElementById("pm2Process").textContent =
            data.process;

        document.getElementById("pm2Status").textContent =
            data.status;

        document.getElementById("pm2Pid").textContent =
            data.pid;

        document.getElementById("pm2Cpu").textContent =
            data.cpu + " %";

        document.getElementById("pm2Memory").textContent =
            data.memory + " MB";

        document.getElementById("pm2Restart").textContent =
            data.restarts;

    }

    catch (err) {

        console.log(err);

    }

}

// ==========================
// Health
// ==========================

async function loadHealth() {

    try {

        const response = await fetch("/health");

        const data = await response.json();

        document.getElementById("healthStatus").innerHTML =
            "🟢 " + data.status;

    }

    catch (err) {

        document.getElementById("healthStatus").innerHTML =
            "🔴 Offline";

    }

}

// ==========================
// Auto Refresh
// ==========================

function loadDashboard() {

    loadSystemInfo();

    loadDeployment();

    loadPM2();

    loadHealth();

}

loadDashboard();

setInterval(loadDashboard, 5000);