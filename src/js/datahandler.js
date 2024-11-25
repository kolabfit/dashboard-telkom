document.getElementById('kategoridropdown').addEventListener('change', (event) => {
  const selectedCategory = event.target.value;
  console.log(`Selected category: ${selectedCategory}`);
  // You can add additional logic here to handle the selected category change
});

// Event listener for the file input
document.getElementById('fileInput').addEventListener('change', handleFile);

// Data structure to store counts per sheet and generation type
const sheetData = {};
const generations = ['baby boomer', 'gen x', 'senior millennial', 'junior millennial', 'gen z'];
const categories = [
  'Agile', 'Data Driven', 'Innovative', 'Dinamis', 'Openness', 'Toleransi',
  'Gotong-royong', 'Kekeluargaan', 'Militansi', 'Selalu menjadi yang terbaik', 'Lainnya'
];

// Function to handle file reading and processing
function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, {
      type: 'array'
    });

    // Iterate through each sheet in the workbook
    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet, {
        header: 1
      });

      // Initialize data structure for each generation in the sheet
      sheetData[sheetName] = {};
      generations.forEach(gen => {
        sheetData[sheetName][gen] = {};
        categories.forEach(category => {
          sheetData[sheetName][gen][category] = 0;
        });
      });

      // Iterate through each row and count category occurrences per generation
      rows.forEach((row, rowIndex) => {
        if (rowIndex === 0) return; // Skip the header row

        const generationCell = row[0];
        if (generationCell && typeof generationCell === 'string') {
          // Normalize and detect the generation
          const normalizedGen = generationCell.toLowerCase();
          const detectedGen = generations.find(gen => normalizedGen.includes(gen));

          if (detectedGen) {
            // Process the rest of the row for category counts
            row.slice(1).forEach((cellValue) => {
              if (cellValue && typeof cellValue === 'string') {
                const normalizedValue = cellValue.trim().toLowerCase();
                categories.forEach(category => {
                  if (normalizedValue.includes(category.toLowerCase())) {
                    sheetData[sheetName][detectedGen][category]++;
                  }
                });

                // Handle 'Lainnya' category for unlisted values
                if (cellValue && !categories.some(cat => normalizedValue === cat.toLowerCase())) {
                  sheetData[sheetName][detectedGen]['Lainnya']++;
                }
              }
            });
          }
        }
      });

      console.log(`Data for sheet ${sheetName}:`, sheetData[sheetName]); // Debug output for each sheet
    });

    renderTabs();
  };
  reader.readAsArrayBuffer(file);
}

// Function to render tabs for each sheet
function renderTabs() {
  const tabsContainer = document.getElementById('tabsContainer');
  tabsContainer.innerHTML = '';

  Object.keys(sheetData).slice(1).forEach((sheetName, index) => {
    const tabButton = document.createElement('button');
    tabButton.textContent = sheetName;
    tabButton.classList = `mr-2 mb-2 px-4 py-2 rounded ${index === 0 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`;
    tabButton.setAttribute('data-sheet', sheetName);
    tabButton.addEventListener('click', (e) => switchTab(e, sheetName));
    tabsContainer.appendChild(tabButton);
  });

  // Automatically render the first sheet's charts
  renderCharts(Object.keys(sheetData)[1]);
}

// Function to switch the active tab and render the corresponding charts
function switchTab(event, sheetName) {
  document.querySelectorAll('#tabsContainer button').forEach(button => {
    button.classList.remove('bg-blue-500', 'text-white');
    button.classList.add('bg-gray-300');
  });
  event.target.classList.remove('bg-gray-300');
  event.target.classList.add('bg-blue-500', 'text-white');

  renderCharts(sheetName);
}

// Function to render the charts for the selected sheet
function renderCharts(sheetName) {
  console.log(`Rendering charts for sheet ${sheetName}`);
  console.log(sheetData[sheetName]);

  const chartsContainer = document.getElementById('chartsContainer');
  chartsContainer.innerHTML = '';

  if (!sheetData[sheetName]) return;

  generations.forEach(gen => {
    if (Object.values(sheetData[sheetName][gen]).some(count => count > 0)) {
      // Create data for the bar chart
      const categoryCounts = categories.map(category => sheetData[sheetName][gen][category]);
      const total = categoryCounts.reduce((sum, count) => sum + count, 0);

      const data = {
        labels: categories,
        datasets: [{
          label: `Chart for ${gen.charAt(0).toUpperCase() + gen.slice(1)}`,
          data: categoryCounts,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      };

      const config = {
        type: 'bar',
        data: data,
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return value; // Display values directly on the Y axis
                }
              }
            },
            x: {
              beginAtZero: true
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  const value = tooltipItem.raw;
                  const percentage = total > 0 ? (value / total * 100).toFixed(1) : 0;
                  return `${tooltipItem.label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        }
      };

      // Render the chart container with a canvas element
      const chartContainer = document.createElement('div');
      chartContainer.classList = 'mb-6';
      const canvas = document.createElement('canvas'); // Create canvas element
      chartContainer.appendChild(canvas);
      chartsContainer.appendChild(chartContainer);

      // Create the chart using the canvas
      new Chart(canvas, config);
    }
  });
}
