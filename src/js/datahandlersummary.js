// pengurutan index chart
var implementasi_akhlak_chart;
var digital_culture_chart;
var nps_chart;
var penerimaan_chart;
var readiness_chart;
var intervensi_pimpinan_chart;
var intervensi_sistem_chart;
var intervensi_simbol_chart;

// karaktersitik chart
var generasi_chart;
var gender_chart;
var bandpos_charts;

document.getElementById("kategoridropdown").addEventListener("change", async function () {
  const summarySpreadsheetId = '1RSV3NoJ1Dg7bzeODxwOkhmBxfnF2eSb9';
  const selectedValue = this.value;
  let tempDataKarakteristik = [];
  let tempDataPengurutanIndex = [];

  if (selectedValue === "1") {
    // Telkom Parent
    tempDataKarakteristik = await getSheetData(summarySpreadsheetId, 'RESPONDEN', 'B5:B21');
    tempDataPengurutanIndex = await getSheetData(summarySpreadsheetId, 'SUMMARY1', 'D2:L2');
  } else if (selectedValue === "2") {
    // Telkom Group AP
    tempDataKarakteristik = await getSheetData(summarySpreadsheetId, 'RESPONDEN', 'E5:E22');
    tempDataPengurutanIndex = await getSheetData(summarySpreadsheetId, 'SUMMARY1', 'D3:L3');
  } else if (selectedValue === "3") {
    // Telkom Group - TSEL
    tempDataKarakteristik = await getSheetData(summarySpreadsheetId, 'RESPONDEN', 'I5:I22');
    tempDataPengurutanIndex = await getSheetData(summarySpreadsheetId, 'SUMMARY1', 'D4:L4');
  }

  console.log("Data Karakteristik:", tempDataKarakteristik);
  console.log("Data Pengurutan Index:", tempDataPengurutanIndex);

  // UPDATE PENGURUTAN INDEX
  if (tempDataPengurutanIndex.length >= 8) {
    const actualValue1 = (tempDataPengurutanIndex[1] * 100).toFixed(2);
    updateChartJSData(implementasi_akhlak_chart, [actualValue1, (100 - actualValue1).toFixed(2)]);
    const actualValue2 = (tempDataPengurutanIndex[2] * 100).toFixed(2);
    updateChartJSData(digital_culture_chart, [actualValue2, (100 - actualValue2).toFixed(2)]);
    const actualValue3 = (tempDataPengurutanIndex[3] * 100).toFixed(2);
    updateChartJSData(nps_chart, [actualValue3, (100 - actualValue3).toFixed(2)]);
    updateChartJSData(penerimaan_chart, [tempDataPengurutanIndex[4], tempDataPengurutanIndex[0]]);
    const actualValue4 = (tempDataPengurutanIndex[5] * 100).toFixed(2);
    updateChartJSData(readiness_chart, [actualValue4, (100 - actualValue4).toFixed(2)]);
    const actualValue5 = (tempDataPengurutanIndex[6] * 10).toFixed(2);
    updateChartJSData(intervensi_pimpinan_chart, [actualValue5, (4 - actualValue5).toFixed(2)]);
    const actualValue6 = (tempDataPengurutanIndex[7] * 10).toFixed(2);
    updateChartJSData(intervensi_sistem_chart, [actualValue6, (4 - actualValue6).toFixed(2)]);
    const actualValue7 = (tempDataPengurutanIndex[8] * 10).toFixed(2);
    updateChartJSData(intervensi_simbol_chart, [actualValue7, (4 - actualValue7).toFixed(2)]);
  } else {
    console.error("Possible invalid data received:", tempDataPengurutanIndex);
  }

  // UPDATE KARAKTERISTIK CHARTS
  if (tempDataKarakteristik.length >= 13) {
    const bandPosTotal = tempDataKarakteristik.slice(7).reduce((a, b) => a + b, 0);
    document.getElementById("totalbandpos").textContent = bandPosTotal;
    generasi_chart.updateSeries([{
      data: tempDataKarakteristik.slice(2, 7)
    }]);
    gender_chart.updateSeries(tempDataKarakteristik.slice(0, 2));
    bandpos_charts.updateSeries([{
      data: tempDataKarakteristik.slice(7)
    }]);
  } else {
    console.error("Possible invalid data received:", tempDataKarakteristik);
    alert("Data tidak lengkap atau salah.");
  }
});

function updateChartJSData(chart, data) {
  chart.data.labels = ['Terpilih', 'Tidak Terpilih'];
  chart.data.datasets[0].data = data;
  chart.update();
}

function generateStartingChartJS() {
  // Inisialisasi manual setiap chart
  implementasi_akhlak_chart = new Chart(document.getElementById('pie-akhlak').getContext('2d'), {
    type: 'pie',
    data: {
      labels: ['Terpilih', 'Tidak Terpilih'],
      datasets: [{
        data: [0, 0],
        backgroundColor: ['#28a745', '#ff0000']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.label + ': ' + tooltipItem.raw + '%';
            }
          }
        }
      },
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const modal = new bootstrap.Modal(document.getElementById('modal-akhlak'));
          modal.show();
        }
      }
    }
  });

  digital_culture_chart = new Chart(document.getElementById('pie-dci').getContext('2d'), {
    type: 'pie',
    data: {
      labels: ['Terpilih', 'Tidak Terpilih'],
      datasets: [{
        data: [0, 0],
        backgroundColor: ['#28a745', '#ff0000']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.label + ': ' + tooltipItem.raw + '%';
            }
          }
        }
      },
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const modal = new bootstrap.Modal(document.getElementById('modal-dci'));
          modal.show();
        }
      }
    }
  });

  nps_chart = new Chart(document.getElementById('pie-nps').getContext('2d'), {
    type: 'pie',
    data: {
      labels: ['Terpilih', 'Tidak Terpilih'],
      datasets: [{
        data: [0, 0],
        backgroundColor: ['#28a745', '#ff0000']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.label + ': ' + tooltipItem.raw + '%';
            }
          }
        }
      },
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const modal = new bootstrap.Modal(document.getElementById('modal-nps'));
          modal.show();
        }
      }
    }
  });

  // Inisialisasi penerimaan_chart
  penerimaan_chart = new Chart(document.getElementById('pie-penerimaan').getContext('2d'), {
    type: 'pie',
    data: {
      labels: ['Terpilih', 'Tidak Terpilih'],
      datasets: [{
        data: [0, 0],
        backgroundColor: ['#28a745', '#ff0000']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.label + ': ' + tooltipItem.raw + '%';
            }
          }
        }
      },
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const modal = new bootstrap.Modal(document.getElementById('modal-penerimaan'));
          modal.show();
        }
      }
    }
  });

  // Inisialisasi readiness_chart
  readiness_chart = new Chart(document.getElementById('pie-readiness').getContext('2d'), {
    type: 'pie',
    data: {
      labels: ['Terpilih', 'Tidak Terpilih'],
      datasets: [{
        data: [0, 0],
        backgroundColor: ['#28a745', '#ff0000']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.label + ': ' + tooltipItem.raw + '%';
            }
          }
        }
      },
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const modal = new bootstrap.Modal(document.getElementById('modal-readiness'));
          modal.show();
        }
      }
    }
  });

  // Intervensi Pimpinan Chart
  const leaderCtx = document.getElementById('intervention-leader-chart').getContext('2d');
  intervensi_pimpinan_chart = new Chart(leaderCtx, {
    type: 'pie',
    data: {
      labels: ['Terpilih', 'Tidak Terpilih'],
      datasets: [{
        data: [0, 0],
        backgroundColor: ['#28a745', '#ff0000'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.label + ': ' + tooltipItem.raw + '%';
            }
          }
        }
      },
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const modal = new bootstrap.Modal(document.getElementById('modal-intervention-leader'));
          modal.show();
        }
      }
    }
  });

  // Intervensi Sistem Chart
  const systemCtx = document.getElementById('intervention-system-chart').getContext('2d');
  intervensi_sistem_chart = new Chart(systemCtx, {
    type: 'pie',
    data: {
      labels: ['Terpilih', 'Tidak Terpilih'],
      datasets: [{
        data: [0, 0],
        backgroundColor: ['#28a745', '#ff0000'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.label + ': ' + tooltipItem.raw + '%';
            }
          }
        }
      },
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const modal = new bootstrap.Modal(document.getElementById('modal-intervention-system'));
          modal.show();
        }
      }
    }
  });

  // Intervensi Simbol Chart
  const symbolCtx = document.getElementById('intervention-symbol-chart').getContext('2d');
  intervensi_simbol_chart = new Chart(symbolCtx, {
    type: 'pie',
    data: {
      labels: ['Terpilih', 'Tidak Terpilih'],
      datasets: [{
        data: [0, 0],
        backgroundColor: ['#28a745', '#ff0000'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.label + ': ' + tooltipItem.raw + '%';
            }
          }
        }
      },
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const modal = new bootstrap.Modal(document.getElementById('modal-intervention-symbol'));
          modal.show();
        }
      }
    }
  });
}

function generateStartingChartApex() {
  // GENERASI CHART
  const gen_chart_options = {
    series: [{
      name: "Responden",
      data: [0, 0, 0, 0, 0],
    },
    ],
    chart: {
      height: 300,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    legend: {
      show: false,
    },
    colors: ["#0d6efd", "#20c997"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "string",
      categories: [
        "Baby Boomer",
        "Gen X",
        "Junior Millenial",
        "Senior Millenial",
        "Gen Z",
      ],
    },
    tooltip: {
      x: {
        format: "MMMM yyyy",
      },
    },
  };

  generasi_chart = new ApexCharts(
    document.querySelector("#generasi-chart"),
    gen_chart_options
  );

  // GENDER CHART
  const gender_chart_options = {
    series: [0, 0],
    chart: {
      type: "donut",
    },
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#0d6efd", "#d63384"],
  };

  gender_chart = new ApexCharts(
    document.querySelector("#gender-chart"),
    gender_chart_options
  );

  // BAND POSISI CHART
  const bandpos_options = {
    series: [{
      name: "Band Posisi",
      data: [0, 0, 0, 0, 0, 0, 0],
    },],
    chart: {
      type: "bar",
      height: 300,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    legend: {
      show: false,
    },
    colors: ["#0d6efd"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["I", "II", "III", "IV", "V", "VI", "VII"],
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " Orang";
        },
      },
    },
  };

  bandpos_charts = new ApexCharts(
    document.querySelector("#bandpos-charts"),
    bandpos_options
  );

  // RENDER ALL CHARTS
  generasi_chart.render();
  gender_chart.render();
  bandpos_charts.render();
}

async function getSheetData(spreadsheetId, sheetTab, range) {
  const FULL_URL = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?sheet=${sheetTab}&range=${range}`;

  try {
    const response = await fetch(FULL_URL);
    const text = await response.text();
    const json = JSON.parse(text.substr(47).slice(0, -2));

    let dataset = [];
    json.table.rows.forEach(row => {
      row.c.forEach(cell => {
        dataset.push(cell && cell.v !== null ? cell.v : 0);
      });
    });

    return dataset;
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Gagal mengambil data dari Google Sheets.");
    return [];
  }
}

document.addEventListener("DOMContentLoaded", function () {
  generateStartingChartJS();
  generateStartingChartApex();
});
