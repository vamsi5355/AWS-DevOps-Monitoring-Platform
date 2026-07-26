const express = require("express");
const path = require("path");
const os = require("os");
const fs = require("fs");
const si = require("systeminformation");
const pm2 = require("pm2");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ===========================
        HEALTH API
=========================== */

app.get("/health", (req, res) => {

    res.json({

        status: "Healthy",

        uptime: process.uptime(),

        timestamp: new Date(),

        server: os.hostname()

    });

});

/* ===========================
      SYSTEM INFORMATION
=========================== */

app.get("/api/system", async (req, res) => {

    try {

        const mem = await si.mem();

        const cpu = await si.currentLoad();

        const disk = await si.fsSize();

        res.json({

            hostname: os.hostname(),

            platform: os.platform(),

            architecture: os.arch(),

            nodeVersion: process.version,

            uptime: os.uptime(),

            totalMemory: mem.total,

            usedMemory: (
                mem.used /
                1024 /
                1024 /
                1024
            ).toFixed(2),

            freeMemory: (
                mem.available /
                1024 /
                1024 /
                1024
            ).toFixed(2),

            memoryUsage: (
                (mem.used / mem.total) *
                100
            ).toFixed(2),

            cpuUsage: cpu.currentLoad.toFixed(2),

            diskUsage:
                disk.length > 0
                    ? disk[0].use.toFixed(2)
                    : "0"

        });

    }

    catch (err) {

        res.status(500).json({

            error: err.message

        });

    }

});

/* ===========================
      DEPLOYMENT API
=========================== */

app.get("/api/deployment", (req, res) => {

    try {

        const filePath = path.join(
            __dirname,
            "data",
            "deployment.json"
        );

        const deployment = JSON.parse(
            fs.readFileSync(filePath)
        );

        res.json(deployment);

    }

    catch (err) {

        res.status(500).json({

            version: "N/A",

            build: "N/A",

            commit: "N/A",

            lastDeployment: "N/A",

            pipeline: "Unavailable"

        });

    }

});

/* ===========================
          PM2 API
=========================== */

app.get("/api/pm2", (req, res) => {

    pm2.connect((err) => {

        if (err) {

            return res.status(500).json({

                process: "Unavailable",

                status: "Offline",

                pid: "-",

                cpu: "-",

                memory: "-",

                restarts: "-"

            });

        }

        pm2.list((err, list) => {

            pm2.disconnect();

            if (err) {

                return res.status(500).json({

                    process: "Unavailable",

                    status: "Offline",

                    pid: "-",

                    cpu: "-",

                    memory: "-",

                    restarts: "-"

                });

            }

            if (list.length === 0) {

                return res.json({

                    process: "No Process",

                    status: "Stopped",

                    pid: "-",

                    cpu: "-",

                    memory: "-",

                    restarts: "-"

                });

            }

            const process = list[0];

            res.json({

                process: process.name,

                status: process.pm2_env.status,

                pid: process.pid,

                cpu: process.monit.cpu,

                memory: (
                    process.monit.memory /
                    1024 /
                    1024
                ).toFixed(2),

                restarts:
                    process.pm2_env.restart_time

            });

        });

    });

});

/* ===========================
         SERVER START
=========================== */

app.listen(PORT, () => {

    console.log(`🚀 Server running on port ${PORT}`);

});