
    var data = {
      overallMin: 0,
      overallMax: 100,
      overall: [10, 20, 30, 40, 50], // Replace with your data
      individual: [ { x: 1, y: 10 }, { x: 2, y: 20 } ] // Replace with your data
    };
  
    // Create a reference to the canvas element
    var canvas = document.getElementById("grade-chart");
  
    // Initialize the chart using Chart.js
    var cbChart = new Chart(canvas, {
      type: "line", // Change to "scatter" if needed
      data: {
        datasets: [{
          label: 'Overall Grade',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 0.8)',
          pointBackgroundColor: 'rgb(54, 162, 235)',
          data: data.overall,
          lineTension: 0
        }, {
          label: 'Individual Assignments',
          pointBackgroundColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgb(75, 192, 192)',
          borderColor: 'transparent',
          data: data.individual,
          type: 'scatter',
          fill: false
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              min: data.overallMin,
              max: data.overallMax
            }
          }]
        }
        // Other chart options you might need
      }
    });