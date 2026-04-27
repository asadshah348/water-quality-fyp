// ==========================================================
// WATER QUALITY MONITORING SYSTEM - DASHBOARD JS
// ==========================================================

// Configuration
const REFRESH_INTERVAL = 5000; // 5 seconds
const MAX_HISTORY = 20;

// Data storage
let sensorHistory = {
    timestamps: [],
    temperature: [],
    turbidity: [],
    waterLevel: [],
    tds: [],
    ph: [],
    pressure: []
};

// Gauge instances
let gauges = {};

// Chart instances
let charts = {};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initGauges();
    initCharts();
    fetchData();
    setInterval(fetchData, REFRESH_INTERVAL);
});

// Initialize Canvas Gauges
function initGauges() {
    // Temperature Gauge (0-50°C)
    gauges.temp = new RadialGauge({
        renderTo: 'temp-gauge',
        width: 200,
        height: 200,
        units: '°C',
        minValue: 0,
        maxValue: 50,
        majorTicks: [0, 10, 20, 30, 40, 50],
        minorTicks: 5,
        strokeTicks: true,
        highlights: [
            { from: 0, to: 30, color: 'rgba(16, 185, 129, 0.3)' },
            { from: 30, to: 35, color: 'rgba(245, 158, 11, 0.3)' },
            { from: 35, to: 50, color: 'rgba(239, 68, 68, 0.3)' }
        ],
        colorPlate: '#ffffff',
        colorMajorTicks: '#64748b',
        colorMinorTicks: '#cbd5e1',
        colorTitle: '#1e293b',
        colorUnits: '#64748b',
        colorNumbers: '#1e293b',
        colorNeedle: '#0ea5e9',
        colorNeedleEnd: '#0284c7',
        valueBox: true,
        animationDuration: 1000,
        animationRule: 'elastic',
        value: 0
    }).draw();

    // Turbidity Gauge (0-20 NTU)
    gauges.turbidity = new RadialGauge({
        renderTo: 'turbidity-gauge',
        width: 200,
        height: 200,
        units: 'NTU',
        minValue: 0,
        maxValue: 20,
        majorTicks: [0, 5, 10, 15, 20],
        minorTicks: 5,
        strokeTicks: true,
        highlights: [
            { from: 0, to: 4, color: 'rgba(16, 185, 129, 0.3)' },
            { from: 4, to: 10, color: 'rgba(245, 158, 11, 0.3)' },
            { from: 10, to: 20, color: 'rgba(239, 68, 68, 0.3)' }
        ],
        colorPlate: '#ffffff',
        colorMajorTicks: '#64748b',
        colorMinorTicks: '#cbd5e1',
        colorTitle: '#1e293b',
        colorUnits: '#64748b',
        colorNumbers: '#1e293b',
        colorNeedle: '#f59e0b',
        colorNeedleEnd: '#d97706',
        valueBox: true,
        animationDuration: 1000,
        animationRule: 'elastic',
        value: 0
    }).draw();

    // Water Level Gauge (0-100%)
    gauges.level = new RadialGauge({
        renderTo: 'level-gauge',
        width: 200,
        height: 200,
        units: '%',
        minValue: 0,
        maxValue: 100,
        majorTicks: [0, 20, 40, 60, 80, 100],
        minorTicks: 5,
        strokeTicks: true,
        highlights: [
            { from: 0, to: 10, color: 'rgba(239, 68, 68, 0.3)' },
            { from: 10, to: 80, color: 'rgba(16, 185, 129, 0.3)' },
            { from: 80, to: 100, color: 'rgba(239, 68, 68, 0.3)' }
        ],
        colorPlate: '#ffffff',
        colorMajorTicks: '#64748b',
        colorMinorTicks: '#cbd5e1',
        colorTitle: '#1e293b',
        colorUnits: '#64748b',
        colorNumbers: '#1e293b',
        colorNeedle: '#3b82f6',
        colorNeedleEnd: '#2563eb',
        valueBox: true,
        animationDuration: 1000,
        animationRule: 'elastic',
        value: 0
    }).draw();

    // TDS Gauge (0-1500 mg/L)
    gauges.tds = new RadialGauge({
        renderTo: 'tds-gauge',
        width: 200,
        height: 200,
        units: 'mg/L',
        minValue: 0,
        maxValue: 1500,
        majorTicks: [0, 300, 600, 900, 1200, 1500],
        minorTicks: 5,
        strokeTicks: true,
        highlights: [
            { from: 0, to: 500, color: 'rgba(16, 185, 129, 0.3)' },
            { from: 500, to: 1000, color: 'rgba(245, 158, 11, 0.3)' },
            { from: 1000, to: 1500, color: 'rgba(239, 68, 68, 0.3)' }
        ],
        colorPlate: '#ffffff',
        colorMajorTicks: '#64748b',
        colorMinorTicks: '#cbd5e1',
        colorTitle: '#1e293b',
        colorUnits: '#64748b',
        colorNumbers: '#1e293b',
        colorNeedle: '#06b6d4',
        colorNeedleEnd: '#0891b2',
        valueBox: true,
        animationDuration: 1000,
        animationRule: 'elastic',
        value: 0
    }).draw();

    // pH Gauge (0-14)
    gauges.ph = new RadialGauge({
        renderTo: 'ph-gauge',
        width: 200,
        height: 200,
        units: 'pH',
        minValue: 0,
        maxValue: 14,
        majorTicks: [0, 2, 4, 6, 8, 10, 12, 14],
        minorTicks: 2,
        strokeTicks: true,
        highlights: [
            { from: 0, to: 6.5, color: 'rgba(239, 68, 68, 0.3)' },
            { from: 6.5, to: 8.5, color: 'rgba(16, 185, 129, 0.3)' },
            { from: 8.5, to: 14, color: 'rgba(239, 68, 68, 0.3)' }
        ],
        colorPlate: '#ffffff',
        colorMajorTicks: '#64748b',
        colorMinorTicks: '#cbd5e1',
        colorTitle: '#1e293b',
        colorUnits: '#64748b',
        colorNumbers: '#1e293b',
        colorNeedle: '#10b981',
        colorNeedleEnd: '#059669',
        valueBox: true,
        animationDuration: 1000,
        animationRule: 'elastic',
        value: 7
    }).draw();

    // Pressure Gauge (700-1200 hPa)
    gauges.pressure = new RadialGauge({
        renderTo: 'pressure-gauge',
        width: 200,
        height: 200,
        units: 'hPa',
        minValue: 700,
        maxValue: 1200,
        majorTicks: [700, 800, 900, 1000, 1100, 1200],
        minorTicks: 5,
        strokeTicks: true,
        highlights: [
            { from: 700, to: 850, color: 'rgba(239, 68, 68, 0.3)' },
            { from: 850, to: 1200, color: 'rgba(16, 185, 129, 0.3)' }
        ],
        colorPlate: '#ffffff',
        colorMajorTicks: '#64748b',
        colorMinorTicks: '#cbd5e1',
        colorTitle: '#1e293b',
        colorUnits: '#64748b',
        colorNumbers: '#1e293b',
        colorNeedle: '#64748b',
        colorNeedleEnd: '#475569',
        valueBox: true,
        animationDuration: 1000,
        animationRule: 'elastic',
        value: 900
    }).draw();
}

// Initialize Charts
function initCharts() {
    const ctx1 = document.getElementById('trend-chart').getContext('2d');
    charts.trend = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: [],
                    borderColor: '#FF6384',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Turbidity (NTU)',
                    data: [],
                    borderColor: '#36A2EB',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y1'
                },
                {
                    label: 'TDS (mg/L)',
                    data: [],
                    borderColor: '#FFCE56',
                    backgroundColor: 'rgba(255, 206, 86, 0.1)',
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y1'
                },
                {
                    label: 'pH',
                    data: [],
                    borderColor: '#4BC0C0',
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y2'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 8,
                        font: { size: 11 }
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    },
                    title: {
                        display: true,
                        text: 'Temp / pH'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Turbidity / TDS'
                    }
                },
                y2: {
                    type: 'linear',
                    display: false,
                    position: 'right',
                    grid: {
                        display: false
                    },
                    min: 0,
                    max: 14
                }
            }
        }
    });

    const ctx2 = document.getElementById('comparison-chart').getContext('2d');
    charts.comparison = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['Temp', 'Turbidity', 'TDS', 'pH', 'Pressure'],
            datasets: [
                {
                    label: 'Current Value',
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)'
                    ],
                    borderRadius: 8
                },
                {
                    label: 'WHO Limit',
                    data: [30, 4, 500, 8.5, 850],
                    backgroundColor: 'rgba(16, 185, 129, 0.3)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    borderWidth: 2,
                    borderRadius: 8,
                    type: 'line',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    const ctx3 = document.getElementById('level-chart').getContext('2d');
    charts.level = new Chart(ctx3, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Water Level (%)',
                data: [],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    },
                    title: {
                        display: true,
                        text: 'Water Level (%)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 8,
                        font: { size: 11 }
                    }
                }
            }
        }
    });

    const ctx4 = document.getElementById('safety-chart').getContext('2d');
    charts.safety = new Chart(ctx4, {
        type: 'doughnut',
        data: {
            labels: ['Safe', 'Warning', 'Critical'],
            datasets: [{
                data: [6, 0, 0],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ],
                borderWidth: 0,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                }
            }
        }
    });
}

// Fetch data from API
async function fetchData() {
    try {
        document.getElementById('refresh-icon').classList.add('fa-spin');

        const response = await fetch('/api/data');
        const data = await response.json();

        if (data.error) {
            console.error('API Error:', data.error);
            return;
        }

        updateDashboard(data);
        updateHistory(data);
        updateCharts();

        document.getElementById('last-update-time').textContent = 
            new Date().toLocaleTimeString();

    } catch (error) {
        console.error('Fetch error:', error);
    } finally {
        setTimeout(() => {
            document.getElementById('refresh-icon').classList.remove('fa-spin');
        }, 1000);
    }
}

// Manual refresh
function manualRefresh() {
    fetchData();
}

// Update dashboard with new data
function updateDashboard(data) {
    const sensors = data.sensors;

    // Update gauges
    gauges.temp.value = sensors.Temperature.value;
    gauges.turbidity.value = sensors.Turbidity.value;
    gauges.level.value = sensors.Water_Level.value;
    gauges.tds.value = sensors.TDS.value;
    gauges.ph.value = sensors.PH.value;
    gauges.pressure.value = sensors.Pressure.value;

    // Update value displays
    document.getElementById('temp-value').textContent = sensors.Temperature.value;
    document.getElementById('turbidity-value').textContent = sensors.Turbidity.value;
    document.getElementById('level-value').textContent = sensors.Water_Level.value;
    document.getElementById('tds-value').textContent = sensors.TDS.value;
    document.getElementById('ph-value').textContent = sensors.PH.value;
    document.getElementById('pressure-value').textContent = sensors.Pressure.value;

    // Update WHO status badges
    updateWHOStatus('temp', sensors.Temperature.status);
    updateWHOStatus('turbidity', sensors.Turbidity.status);
    updateWHOStatus('level', sensors.Water_Level.status);
    updateWHOStatus('tds', sensors.TDS.status);
    updateWHOStatus('ph', sensors.PH.status);
    updateWHOStatus('pressure', sensors.Pressure.status);

    // Update prediction cards
    updatePredictionCards(data);

    // Update WHO table
    updateWHOTable(sensors);

    // Update drinkable checks
    updateDrinkableChecks(data.drinkable);

    // Update anomaly details
    updateAnomalyDetails(data.anomaly);

    // Update raw data
    document.getElementById('raw-data-content').textContent = 
        JSON.stringify(data.raw_data, null, 2);

    // Update alert banner
    updateAlertBanner(data);
}

// Update WHO status badge
function updateWHOStatus(param, status) {
    const element = document.getElementById(param + '-who-status');
    if (status === 'safe') {
        element.innerHTML = '<span class="badge badge-safe"><i class="fas fa-check-circle"></i> WHO Safe</span>';
    } else {
        element.innerHTML = '<span class="badge badge-danger"><i class="fas fa-exclamation-circle"></i> WHO Unsafe</span>';
    }
}

// Update prediction cards
function updatePredictionCards(data) {
    // Leakage
    const leakageCard = document.getElementById('leakage-card');
    const leakageStatus = document.getElementById('leakage-status');
    const leakageDetails = document.getElementById('leakage-details');

    leakageCard.className = 'prediction-card ' + data.leakage.severity;

    if (data.leakage.status === 'Leakage') {
        leakageStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i><span>Leakage Detected</span>';
        leakageStatus.className = 'status-badge critical';
        leakageDetails.textContent = 'Immediate action required! Check pipeline integrity.';
    } else {
        leakageStatus.innerHTML = '<i class="fas fa-check-circle"></i><span>No Leakage</span>';
        leakageStatus.className = 'status-badge safe';
        leakageDetails.textContent = 'All pressure and level sensors indicate normal operation.';
    }

    // Anomaly
    const anomalyCard = document.getElementById('anomaly-card');
    const anomalyStatus = document.getElementById('anomaly-status');
    const anomalyDetails = document.getElementById('anomaly-details');

    if (data.anomaly.is_anomaly) {
        const severity = data.anomaly.anomalies.some(a => a.severity === 'critical') ? 'critical' : 'warning';
        anomalyCard.className = 'prediction-card ' + severity;
        anomalyStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>' + 
            data.anomaly.anomaly_count + ' Anomalies</span>';
        anomalyStatus.className = 'status-badge ' + severity;
        anomalyDetails.textContent = data.anomaly.anomalies[0].message;
    } else {
        anomalyCard.className = 'prediction-card safe';
        anomalyStatus.innerHTML = '<i class="fas fa-check-circle"></i><span>Normal</span>';
        anomalyStatus.className = 'status-badge safe';
        anomalyDetails.textContent = 'All parameters within WHO safe limits.';
    }

    // Drinkable
    const drinkableCard = document.getElementById('drinkable-card');
    const drinkableStatus = document.getElementById('drinkable-status');
    const drinkableDetails = document.getElementById('drinkable-details');

    if (data.drinkable.is_drinkable) {
        drinkableCard.className = 'prediction-card safe';
        drinkableStatus.innerHTML = '<i class="fas fa-check-circle"></i><span>Drinkable</span>';
        drinkableStatus.className = 'status-badge safe';
        drinkableDetails.textContent = 'Water meets all WHO drinking water standards.';
    } else {
        drinkableCard.className = 'prediction-card critical';
        drinkableStatus.innerHTML = '<i class="fas fa-times-circle"></i><span>Not Drinkable</span>';
        drinkableStatus.className = 'status-badge critical';

        const failed = Object.entries(data.drinkable.checks)
            .filter(([_, check]) => !check.passed)
            .map(([name, _]) => name)
            .join(', ');
        drinkableDetails.textContent = 'Failed checks: ' + failed;
    }
}

// Update WHO standards table
function updateWHOTable(sensors) {
    const tbody = document.getElementById('who-table-body');

    const healthImpacts = {
        'Temperature': 'Affects microbial growth and chemical reactions',
        'Turbidity': 'Indicates presence of suspended particles and pathogens',
        'Water_Level': 'Critical for system pressure and flow management',
        'TDS': 'High levels cause kidney stones and cardiovascular issues',
        'PH': 'Acidic/alkaline water causes corrosion and health problems',
        'Pressure': 'Low pressure indicates leakage or system failure'
    };

    let html = '';
    for (const [param, info] of Object.entries(sensors)) {
        const statusClass = info.status === 'safe' ? 'status-safe' : 'status-unsafe';
        const statusIcon = info.status === 'safe' ? 'fa-check-circle' : 'fa-exclamation-circle';
        const displayName = param.replace('_', ' ');

        html += `
            <tr>
                <td><strong>${displayName}</strong></td>
                <td>${info.value} ${info.unit}</td>
                <td>${info.unit}</td>
                <td><code>${info.safe_range}</code></td>
                <td><span class="${statusClass}"><i class="fas ${statusIcon}"></i> ${info.status.toUpperCase()}</span></td>
                <td>${healthImpacts[param]}</td>
            </tr>
        `;
    }

    tbody.innerHTML = html;
}

// Update drinkable checks
function updateDrinkableChecks(drinkable) {
    // TDS Check
    const tdsCheck = document.getElementById('tds-check');
    const tdsValue = document.getElementById('tds-check-value');
    const tdsStatus = document.getElementById('tds-check-status');

    tdsValue.textContent = drinkable.checks.TDS.value;
    if (drinkable.checks.TDS.passed) {
        tdsCheck.className = 'drinkable-check-card passed';
        tdsStatus.textContent = 'PASSED ✓';
        tdsStatus.className = 'check-status passed';
    } else {
        tdsCheck.className = 'drinkable-check-card failed';
        tdsStatus.textContent = 'FAILED ✗';
        tdsStatus.className = 'check-status failed';
    }

    // pH Check
    const phCheck = document.getElementById('ph-check');
    const phValue = document.getElementById('ph-check-value');
    const phStatus = document.getElementById('ph-check-status');

    phValue.textContent = drinkable.checks.PH.value;
    if (drinkable.checks.PH.passed) {
        phCheck.className = 'drinkable-check-card passed';
        phStatus.textContent = 'PASSED ✓';
        phStatus.className = 'check-status passed';
    } else {
        phCheck.className = 'drinkable-check-card failed';
        phStatus.textContent = 'FAILED ✗';
        phStatus.className = 'check-status failed';
    }

    // Turbidity Check
    const turbidityCheck = document.getElementById('turbidity-check');
    const turbidityValue = document.getElementById('turbidity-check-value');
    const turbidityStatus = document.getElementById('turbidity-check-status');

    turbidityValue.textContent = drinkable.checks.Turbidity.value;
    if (drinkable.checks.Turbidity.passed) {
        turbidityCheck.className = 'drinkable-check-card passed';
        turbidityStatus.textContent = 'PASSED ✓';
        turbidityStatus.className = 'check-status passed';
    } else {
        turbidityCheck.className = 'drinkable-check-card failed';
        turbidityStatus.textContent = 'FAILED ✗';
        turbidityStatus.className = 'check-status failed';
    }
}

// Update anomaly details
function updateAnomalyDetails(anomaly) {
    const container = document.getElementById('anomaly-list');

    if (!anomaly.is_anomaly) {
        container.innerHTML = `
            <div class="no-anomaly">
                <i class="fas fa-check-circle"></i>
                <h4>All Parameters Normal</h4>
                <p>All water quality parameters are within WHO safe limits.</p>
            </div>
        `;
        return;
    }

    let html = '';
    anomaly.anomalies.forEach(item => {
        const severityClass = item.severity;
        const icon = item.severity === 'critical' ? 'fa-times-circle' : 'fa-exclamation-triangle';

        html += `
            <div class="anomaly-item ${severityClass}">
                <i class="fas ${icon}"></i>
                <div class="anomaly-content">
                    <h5>${item.parameter}</h5>
                    <p>${item.message}</p>
                </div>
                <div class="anomaly-value">
                    <div class="value">${item.value}</div>
                    <div class="severity">${item.severity}</div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Update alert banner
function updateAlertBanner(data) {
    const banner = document.getElementById('alert-banner');
    const message = document.getElementById('alert-message');

    let alerts = [];

    if (data.leakage.status === 'Leakage') {
        alerts.push('🚨 Leakage detected! Check pipeline immediately.');
    }

    if (data.anomaly.is_anomaly) {
        const criticalCount = data.anomaly.anomalies.filter(a => a.severity === 'critical').length;
        if (criticalCount > 0) {
            alerts.push(`⚠️ ${criticalCount} critical anomaly(s) detected!`);
        }
    }

    if (!data.drinkable.is_drinkable) {
        alerts.push('💧 Water is NOT safe for drinking according to WHO standards.');
    }

    if (alerts.length > 0) {
        banner.style.display = 'flex';
        banner.className = 'alert-banner critical';
        message.innerHTML = alerts.join(' | ');
    } else {
        banner.style.display = 'none';
    }
}

// Dismiss alert
function dismissAlert() {
    document.getElementById('alert-banner').style.display = 'none';
}

// Update history
function updateHistory(data) {
    const now = new Date();
    const timeLabel = now.getHours().toString().padStart(2, '0') + ':' + 
                     now.getMinutes().toString().padStart(2, '0') + ':' + 
                     now.getSeconds().toString().padStart(2, '0');

    sensorHistory.timestamps.push(timeLabel);
    sensorHistory.temperature.push(data.sensors.Temperature.value);
    sensorHistory.turbidity.push(data.sensors.Turbidity.value);
    sensorHistory.waterLevel.push(data.sensors.Water_Level.value);
    sensorHistory.tds.push(data.sensors.TDS.value);
    sensorHistory.ph.push(data.sensors.PH.value);
    sensorHistory.pressure.push(data.sensors.Pressure.value);

    // Keep only last MAX_HISTORY entries
    if (sensorHistory.timestamps.length > MAX_HISTORY) {
        sensorHistory.timestamps.shift();
        sensorHistory.temperature.shift();
        sensorHistory.turbidity.shift();
        sensorHistory.waterLevel.shift();
        sensorHistory.tds.shift();
        sensorHistory.ph.shift();
        sensorHistory.pressure.shift();
    }
}

// Update charts
function updateCharts() {
    // Update trend chart
    charts.trend.data.labels = sensorHistory.timestamps;
    charts.trend.data.datasets[0].data = sensorHistory.temperature;
    charts.trend.data.datasets[1].data = sensorHistory.turbidity;
    charts.trend.data.datasets[2].data = sensorHistory.tds;
    charts.trend.data.datasets[3].data = sensorHistory.ph;
    charts.trend.update('none');

    // Update comparison chart
    const lastTemp = sensorHistory.temperature[sensorHistory.temperature.length - 1] || 0;
    const lastTurbidity = sensorHistory.turbidity[sensorHistory.turbidity.length - 1] || 0;
    const lastTDS = sensorHistory.tds[sensorHistory.tds.length - 1] || 0;
    const lastPH = sensorHistory.ph[sensorHistory.ph.length - 1] || 0;
    const lastPressure = sensorHistory.pressure[sensorHistory.pressure.length - 1] || 0;

    charts.comparison.data.datasets[0].data = [lastTemp, lastTurbidity, lastTDS, lastPH, lastPressure];
    charts.comparison.update('none');

    // Update level chart
    charts.level.data.labels = sensorHistory.timestamps;
    charts.level.data.datasets[0].data = sensorHistory.waterLevel;
    charts.level.update('none');

    // Update safety distribution
    const lastData = {
        temperature: lastTemp,
        turbidity: lastTurbidity,
        waterLevel: lastTDS,
        tds: lastTDS,
        ph: lastPH,
        pressure: lastPressure
    };

    let safe = 0, warning = 0, critical = 0;

    // Check each parameter against WHO thresholds
    if (lastTemp >= 0 && lastTemp <= 30) safe++;
    else if (lastTemp > 30 && lastTemp <= 35) warning++;
    else critical++;

    if (lastTurbidity >= 0 && lastTurbidity <= 4) safe++;
    else if (lastTurbidity > 4 && lastTurbidity <= 10) warning++;
    else critical++;

    if (lastTDS >= 0 && lastTDS <= 500) safe++;
    else if (lastTDS > 500 && lastTDS <= 1000) warning++;
    else critical++;

    if (lastPH >= 6.5 && lastPH <= 8.5) safe++;
    else if ((lastPH >= 6.0 && lastPH < 6.5) || (lastPH > 8.5 && lastPH <= 9.0)) warning++;
    else critical++;

    if (lastPressure >= 850) safe++;
    else if (lastPressure >= 800 && lastPressure < 850) warning++;
    else critical++;

    // Water level
    if (lastTDS >= 10 && lastTDS <= 80) safe++;
    else if ((lastTDS >= 5 && lastTDS < 10) || (lastTDS > 80 && lastTDS <= 90)) warning++;
    else critical++;

    charts.safety.data.datasets[0].data = [safe, warning, critical];
    charts.safety.update('none');
}
