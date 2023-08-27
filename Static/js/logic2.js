// Load data from the endpoint
d3.json('/api/v1.0/volcano').then(volcanoData => {
  // Extract variable names for the dropdowns
  const variableNames = Object.keys(volcanoData[0]);

  // Populate dropdown options with X and Y variable names
  const dropdowns = {
    x: d3.select('#x-variable'),
    y: d3.select('#y-variable')
  };

  variableNames.forEach(variable => {
    for (const key in dropdowns) {
      dropdowns[key].append('option').text(variable);
    }
  });

  // Populate chart type dropdown manually
  const chartTypeDropdown = d3.select('#chart-type');

  // Initial variable selections
  let xVariable = variableNames[0];
  let yVariable = variableNames[1];
  let selectedChartType = 'scatter'; // Default chart type

  // Function to update the selected variables and chart type
  function updateVariables() {
    xVariable = dropdowns.x.property('value');
    yVariable = dropdowns.y.property('value');
    selectedChartType = chartTypeDropdown.property('value');
  }

  // Event listeners for variable selections and chart type
  dropdowns.x.on('change', () => {
    updateVariables();
    createChart();
  });

  dropdowns.y.on('change', () => {
    updateVariables();
    createChart();
  });

  chartTypeDropdown.on('change', () => {
    updateVariables();
    createChart();
  });

  // Create the chart function
  function createChart() {
    // Extract X and Y values based on selected variables
    const xValues = volcanoData.map(entry => entry[xVariable]);
    const yValues = volcanoData.map(entry => entry[yVariable]);

    // Create the appropriate trace based on the selected chart type
    let chartTrace;
    if (selectedChartType === 'scatter') {
      chartTrace = {
        x: xValues,
        y: yValues,
        mode: 'markers',
        type: 'scatter',
        marker: {
          size: 10,
          opacity: 0.7,
          color: 'rgb(67, 97, 102)' // Match background color of jumbotron
        },
        name: 'Scatter Plot'
      };
    } else if (selectedChartType === 'bar') {
      chartTrace = {
        x: xValues,
        y: yValues,
        type: 'bar',
        opacity: 0.7,
        marker: {
          color: 'rgb(67, 97, 102)' // Match background color of jumbotron
        },
        name: 'Bar Chart'
      };
    }

    // Layout configuration
    const layout = {
      title: 'Volcano Data', // Update title
      xaxis: { title: xVariable },
      yaxis: { title: yVariable },
      plot_bgcolor: 'rgb(151, 187, 186)', // Match background color of body
      paper_bgcolor: 'white', // Match paper background color of body
      font: {
        family: 'fantasy',
        color: 'rgb(67, 97, 102)' // Match font color of jumbotron
      },
      grid: { color: 'white' },
      legend: { x: 1, y: 1 }
    };

    // Combine chart traces
    const data = [chartTrace];

    // Create the plot using Plotly
    Plotly.newPlot('chart-container', data, layout);
  }

  // Initialize chart when the browser is opened
  createChart();
});
