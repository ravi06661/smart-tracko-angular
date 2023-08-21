export class PieChart {
    chartOptions = {
        series: [33, 33, 33],
        chart: {
          width: 300,
          type: "pie"
        },
        colors: ["#5754E5", "#FF4A11", "#F8961E"],
        legend:{position:'bottom'},
        labels: ["Present", "Absent", "Leave"],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
            }
          }
        ]
      }
}


