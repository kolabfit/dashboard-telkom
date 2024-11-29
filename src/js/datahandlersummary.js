var gender_chart;

document.getElementById("kategoridropdown").addEventListener("change", async function () {
  const spreadsheetId = '1RSV3NoJ1Dg7bzeODxwOkhmBxfnF2eSb9';
  const selectedValue = this.value;
  let tempData = [];

  if (selectedValue === "1") {
    // Telkom Parent
    tempData = await getGenderData(spreadsheetId, 'RESPONDEN', 'B5:B6');
  } else if (selectedValue === "2") {
    // Telkom Group AP
    tempData = await getGenderData(spreadsheetId, 'RESPONDEN', 'E5:E6');
  } else if (selectedValue === "3") {
    // Telkom Group - TSEL
    tempData = await getGenderData(spreadsheetId, 'RESPONDEN', 'I5:I6');
  }

  if (tempData.length >= 2) {
    updateGenderChart(tempData[0] * 100, tempData[1] * 100);
  } else {
    console.error("Invalid data received:", tempData);
  }
});

function updateGenderChart(dataMale, dataFemale) {
  gender_chart.updateSeries([dataMale, dataFemale]);
}

function generateStartingChart(male, female) {
  const gender_chart_options = {
    series: [male, female],
    chart: {
      type: "donut",
    },
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false,
    },
    colors: [
      "#0d6efd",
      "#d63384",
    ],
  };

  gender_chart = new ApexCharts(
    document.querySelector("#gender-chart"),
    gender_chart_options,
  );

  gender_chart.render();
}

async function getGenderData(spreadsheetId, sheetTab, range) {
  let FULL_URL = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?sheet=${sheetTab}&range=${range}`;

  try {
    const response = await fetch(FULL_URL);
    const text = await response.text();
    const json = JSON.parse(text.substr(47).slice(0, -2));

    let dataset = [];
    json.table.rows.forEach(row => {
      row.c.forEach(cell => {
        dataset.push(cell ? cell.v : 0);
      });
    });

    return dataset;
  } catch (error) {
    console.error("Error fetching gender data:", error);
    return [];
  }
}

window.onload = async function () {
  generateStartingChart(0, 0);
};
