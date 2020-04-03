// graph font et font color setup
(Chart.defaults.global.defaultFontFamily = "Nunito"),
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

(function($) {
  // activer le menu des payes
  $("select").selectpicker();
  // faire une ajax request pour obtenir les donnés de covid19
  $.get("https://pomber.github.io/covid19/timeseries.json", function(data) {
    // remplire le menu  avec les payes
    filldropdown(data);
    // remplire l'input avec la date par defaut
    filldate(data.Algeria[66].date);
    // calculer et remplire les cards avec les statistic total
    getallstats(data);
    // generer les dates pour le graph
    let dts = getFormatedDates(data);
    // calculer les statistic pour le graph
    let sts = getStatsByDate(data);
    // generer le graph
    generateGraph(dts, sts);

    // remplire le tableau avec les statistic des payes selectionner dans le menu
    var t = $("#dataTable").DataTable();
    $("#countries").on("change", function() {
      t.clear().draw();
      let conts = $("#countries").val();
      conts.forEach(element => {
        let elems = data[element];
        t.row
          .add([
            element,
            elems[elems.length - 1].confirmed,
            elems[elems.length - 1].deaths,
            elems[elems.length - 1].recovered
          ])
          .draw(false);
      });
    });
  });

  function getallstats(data) {
    let confirmed = 0;
    let deaths = 0;
    let recovered = 0;
    for (const country in data) {
      if (data.hasOwnProperty(country)) {
        const element = data[country];
        let last = element[element.length - 1];
        confirmed += last.confirmed;
        deaths += last.deaths;
        recovered += last.recovered;
      }
    }
    $("#confirmed").text(confirmed);
    $("#deaths").text(deaths);
    $("#recovered").text(recovered);
  }

  function filldate(d) {
    d = new Date(d);

    let m = d.getMonth() + 1 <= 9 ? "0" : "";
    m += d.getMonth() + 1;

    let formatted_date = d.getFullYear() + "-" + m + "-" + d.getDate();

    $("#date").val(formatted_date);
  }

  function filldropdown(data) {
    let countries = "";

    for (const country in data) {
      countries += `<option value="${country}">${country}</option>`;
    }

    $("#countries").html(countries);
    $(".selectpicker").selectpicker("refresh");
  }

  function getFormatedDates(data) {
    let dates = [];

    for (let i = data.Algeria.length - 1; i >= 0; i -= 7) {
      let d = new Date(data.Algeria[i].date);

      let m = d.getMonth() + 1 <= 9 ? "0" : "";
      m += d.getMonth() + 1;

      let formatted_date = m + "-" + d.getDate();
      dates.push(formatted_date);
    }
    return dates;
  }

  function getStatsByDate(data) {
    let ct = [],
      dt = [],
      rt = [];
    for (let i = data.Algeria.length - 1; i >= 0; i -= 7) {
      let c = 0,
        d = 0,
        r = 0;
      for (const country in data) {
        if (data.hasOwnProperty(country)) {
          const element = data[country];

          c += element[i].confirmed;
          d += element[i].deaths;
          r += element[i].recovered;
        }
      }
      ct.push(c);
      dt.push(d);
      rt.push(r);
    }
    return [ct, dt, rt];
  }

  function number_format(number, decimals, dec_point, thousands_sep) {
    // *     example: number_format(1234.56, 2, ',', ' ');
    // *     return: '1 234,56'
    number = (number + "").replace(",", "").replace(" ", "");
    var n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
      sep = typeof thousands_sep === "undefined" ? "," : thousands_sep,
      dec = typeof dec_point === "undefined" ? "." : dec_point,
      s = "",
      toFixedFix = function(n, prec) {
        var k = Math.pow(10, prec);
        return "" + Math.round(n * k) / k;
      };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || "").length < prec) {
      s[1] = s[1] || "";
      s[1] += new Array(prec - s[1].length + 1).join("0");
    }
    return s.join(dec);
  }

  function generateGraph(dts, data) {
    var ctx = document.getElementById("myAreaChart");
    var myLineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: dts.reverse(),
        datasets: [
          {
            label: "Confirmed",
            lineTension: 0.3,
            backgroundColor: "rgba(78, 115, 223, 0)",
            borderColor: "rgba(78, 115, 223, 1)",
            pointRadius: 3,
            pointBackgroundColor: "rgba(78, 115, 223, 1)",
            pointBorderColor: "rgba(78, 115, 223, 1)",
            pointHoverRadius: 3,
            pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
            pointHoverBorderColor: "rgba(78, 115, 223, 1)",
            pointHitRadius: 10,
            pointBorderWidth: 2,
            data: data[0].reverse()
          },
          {
            label: "Deaths",
            lineTension: 0.3,
            backgroundColor: "rgba(78, 115, 223, 0.0)",
            borderColor: "#E74A3B",
            pointRadius: 3,
            pointBackgroundColor: "#E74A3B",
            pointBorderColor: "#E74A3B",
            pointHoverRadius: 3,
            pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
            pointHoverBorderColor: "rgba(78, 115, 223, 1)",
            pointHitRadius: 10,
            pointBorderWidth: 2,
            data: data[1].reverse()
          },
          {
            label: "Recovered",
            lineTension: 0.3,
            backgroundColor: "rgba(78, 115, 223, 0.0)",
            borderColor: "#1CC88A",
            pointRadius: 3,
            pointBackgroundColor: "#1CC88A",
            pointBorderColor: "#1CC88A",
            pointHoverRadius: 3,
            pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
            pointHoverBorderColor: "rgba(78, 115, 223, 1)",
            pointHitRadius: 10,
            pointBorderWidth: 2,
            data: data[2].reverse()
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 25,
            top: 25,
            bottom: 0
          }
        },
        scales: {
          xAxes: [
            {
              time: {
                unit: "date"
              },
              gridLines: {
                display: false,
                drawBorder: false
              },
              ticks: {
                maxTicksLimit: 7
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                maxTicksLimit: 5,
                padding: 10,
                // Include a dollar sign in the ticks
                callback: function(value, index, values) {
                  return "" + number_format(value);
                }
              },
              gridLines: {
                color: "rgb(234, 236, 244)",
                zeroLineColor: "rgb(234, 236, 244)",
                drawBorder: false,
                borderDash: [2],
                zeroLineBorderDash: [2]
              }
            }
          ]
        },
        legend: {
          display: false
        },
        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          titleMarginBottom: 10,
          titleFontColor: "#6e707e",
          titleFontSize: 14,
          borderColor: "#dddfeb",
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          intersect: false,
          mode: "index",
          caretPadding: 10,
          callbacks: {
            label: function(tooltipItem, chart) {
              var datasetLabel =
                chart.datasets[tooltipItem.datasetIndex].label || "";
              return datasetLabel + ": $" + number_format(tooltipItem.yLabel);
            }
          }
        }
      }
    });
  }
})(jQuery);
