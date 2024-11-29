function fetchExcelFile(url) {
  return fetch(url)
      .then(response => response.arrayBuffer())
      .then(buffer => XLSX.read(buffer, { type: "array" }));
}

function getChartData(workbook) {
  const sheet = workbook.Sheets['RESPONDEN'];
  const range = XLSX.utils.decode_range("A2:B21"); // Adjust based on exact range

  let data = [];
  for (let R = range.s.r; R <= range.e.r; ++R) {
      const category = sheet[`A${R + 1}`]?.v || "";
      const value = sheet[`B${R + 1}`]?.v || 0;
      data.push({ category, value });
  }
  return data;
}

document.getElementById("kategoridropdown").addEventListener("change", function() {
  const selectedValue = this.value;
  const filteredData = chartData.filter(item => item.category.includes(selectedValue));

  pieChart.data.labels = filteredData.map(item => item.category);
  pieChart.data.datasets[0].data = filteredData.map(item => item.value);
  pieChart.update();
});

const ctx = document.getElementById('pie-chart').getContext('2d');
const pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: true },
        }
    }
});
