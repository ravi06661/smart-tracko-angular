export class DonutChart {
    chartOptions = {
        series: [75, 20, 5],
        chart: {
          width: 320,
          type: "donut",
          toolbar: {
            show: false // Hide the default toolbar
          }
        },
        colors: ["#5754E5", "#FF4A11", "#F8961E"],
        labels: ["Present", "Absent", "Leaves"],
        legend: {
          position: "bottom", 
        },
        stroke: {
          show: false // Set this to false to remove the borders between the series
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 280
  
              },
              legend: {
                position: 'bottom'
              }
            }
          }
        ]
      };
}
