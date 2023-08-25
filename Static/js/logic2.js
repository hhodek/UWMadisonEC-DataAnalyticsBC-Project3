// Load data from both endpoints
Promise.all([
  d3.json('/api/v1.0/temp'),  // Load data from the first endpoint
  d3.json('/api/v1.0/precip')     // Load data from the second endpoint
]).then(([precipData, tempData]) => {
  // Combine data from both endpoints into a single array
  const allData = [...precipData, ...tempData];

  // Get variable names from the combined data
  const variables = Object.keys(allData[0]);

  // Get dropdown elements for X and Y variables
  const variableSelects = {
    x: d3.select('#x-variable'),
    y: d3.select('#y-variable')
  };

  // Populate dropdown options with variable names
  variables.forEach(variable => {
    for (const key in variableSelects) {
      variableSelects[key].append('option').text(variable);
    }
  });

  // Initial variable selections
  let xVariable = variables[0];
  let yVariable = variables[1];

  // Function to create the scatter plot
  function createScatterPlot() {
    // Extract X and Y values based on selected variables
    const xValues = allData.map(entry => entry[xVariable]);
    const yValues = allData.map(entry => entry[yVariable]);

    // Create trace with customized appearance
    const scatterData = [{
      x: xValues,
      y: yValues,
      mode: 'markers',
      type: 'scatter',
      marker: {
        size: 10,
        opacity: 0.7, // Adjust marker transparency
        color: 'blue', // Set marker color
        // colorscale: 'Viridis', color scale based on data values
        // cmin: minValue,
        // cmax: maxValue,
        // color: yValues,
        // colorbar: { title: 'Colorbar Title' }
      }
    }];

    // Layout configuration
    const layout = {
      title: 'Interactive Scatter Plot',
      xaxis: { title: xVariable }, // Set X-axis title
      yaxis: { title: yVariable }, // Set Y-axis title
      plot_bgcolor: '#f5f5f5',      // Set plot background color
      grid: { color: 'white' },     // Set grid color
      legend: { x: 1, y: 1 }        // Adjust legend position
    };

    // Create the scatter plot using Plotly
    Plotly.newPlot('scatter-plot', scatterData, layout);
  }

  // Function to update the selected variables
  function updateVariables(selectedKey) {
    if (selectedKey === 'x') {
      xVariable = variableSelects.x.property('value');
      yVariable = variableSelects.y.property('value');
    } else {
      xVariable = variableSelects.y.property('value');
      yVariable = variableSelects.x.property('value');
    }
  }

  // Event listeners for variable selections
  for (const key in variableSelects) {
    variableSelects[key].on('change', () => {
      updateVariables(key);
      createScatterPlot();
    });
  }

  // Initialize scatter plot when the browser is opened
  createScatterPlot();
});
