var generasi_chart;
var gender_chart;
var bandpos_charts;

document.getElementById("kategoridropdown").addEventListener("change", async function () {
  const karakteristikspreadsheetId = '1RSV3NoJ1Dg7bzeODxwOkhmBxfnF2eSb9';
  const selectedValue = this.value;
  let tempDataKarakteristik = [];

  if (selectedValue === "1") {
    // Telkom Parent
    tempDataKarakteristik = await getSheetData(karakteristikspreadsheetId, 'RESPONDEN', 'B5:B21');
  } else if (selectedValue === "2") {
    // Telkom Group AP
    tempDataKarakteristik = await getSheetData(karakteristikspreadsheetId, 'RESPONDEN', 'E5:E22');
  } else if (selectedValue === "3") {
    // Telkom Group - TSEL
    tempDataKarakteristik = await getSheetData(karakteristikspreadsheetId, 'RESPONDEN', 'I5:I22');
  }

  console.log("Data Karakteristik:", tempDataKarakteristik);

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

function generateStartingChart() {
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
    }, ],
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
        formatter: function(val) {
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
  generateStartingChart();
});
