import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {


  temp: Observable < any[] > ;
  distancias: Observable < any[] > ;
  public valores = Array < number > ();
  public lineChart1Data: Array < any > = [{
    data: this.valores,
    label: 'valores'
  }];
  public lineChart1Labels: Array < any > = [];

  public lineChart3Data: Array < any > = [{
    data: [78, 81, 80, 45, 34, 12, 40],
    label: 'Humedad'
  }];
  public lineChart3Labels: Array < any > = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  itemsRef;
  humedRef;
  distancia;
  peso;
  temperatura;
  humedades;
  humedad;
  constructor(public db: AngularFireDatabase) {
    this.temp = db.list('Temperatura').valueChanges();
    this.humedades = db.list('Humedad').valueChanges();

    this.itemsRef = db.list('Temperatura');
        this.humedRef = db.list('Humedad');

    this.distancias = db.list('Basuras/distancia').valueChanges();

    this.temp.subscribe(res => {
      this.valores = [];
      res.forEach(valor => {
        this.valores.push(valor);
      });
      this.lineChart1Data = [{
        data: res,
        label: 'test'
      }];
      this.temperatura = res[res.length - 1];
    });

    this.humedades.subscribe(res => {
      this.valores = [];
      res.forEach(valor => {
        this.valores.push(valor);
      });
      this.lineChart3Data = [{
        data: res,
        label: 'humedad'
      }];
      this.humedad = res[res.length - 1];
    });

    this.distancias.subscribe(res => {
      this.valores = [];
      res.forEach(valor => {
        parseInt(valor);
        console.log(valor.distancia);
      });

    });

    db.object('/Basuras/distancia')
      .valueChanges()
      .subscribe(res => {
        console.log(res) //should give you the array of percentage. 
        this.distancia = res;
      });


    db.object('/Basuras/peso')
      .valueChanges()
      .subscribe(res => {
        console.log(res) //should give you the array of percentage. 
        this.peso = res;
      });

    this.humedRef.snapshotChanges(['child_added'])
      .subscribe(actions => {
        this.lineChart3Labels = [];
        actions.forEach(action => {
          this.lineChart3Labels.push(action.key);
        });
      });

    this.humedRef.snapshotChanges(['child_removed'])
      .subscribe(actions => {
        this.lineChart3Labels = [];
        actions.forEach(action => {
          this.lineChart3Labels.push(action.key);


        });
      });

      this.itemsRef.snapshotChanges(['child_added'])
      .subscribe(actions => {
        this.lineChart1Labels = [];
        actions.forEach(action => {
          this.lineChart1Labels.push(action.key);
        });
      });

    this.itemsRef.snapshotChanges(['child_removed'])
      .subscribe(actions => {
        this.lineChart1Labels = [];
        actions.forEach(action => {
          this.lineChart1Labels.push(action.key);


        });
      });
  }

  val;
  getDistanceWidth() {
    this.val = this.map(this.distancia, 0, 34, 0, 100);
    return this.val + "%";

  }

  getDistanceBack() {
    if (this.distancia < 13) {
      return "#f86c6b";
    } else if (this.distancia < 23) {
      return "#ffc107";
    } else {
      return "#4dbd74";
    }
  }

  radioModel: string = 'Día';
  title1 = 'Temperatura';
  subtitle1 = 'º centígrados';

  // lineChart1

  map(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }



  public lineChart1Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: 2 - 5,
          max: 100 + 5,
        }
      }],
    },
    elements: {
      line: {
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 7,
      },
    },
    legend: {
      display: true
    }
  };
  public lineChart1Colours: Array < any > = [{
    backgroundColor: '#fff',
    borderColor: 'rgba(255,255,255,.55)'
  }];
  public lineChart1Legend = false;
  public lineChart1Type = 'line';

  // lineChart2
  public lineChart2Data: Array < any > = [{
    data: [1, 18, 9, 17, 34, 22, 11],
    label: 'Series A'
  }];
  public lineChart2Labels: Array < any > = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart2Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: 1 - 5,
          max: 34 + 5,
        }
      }],
    },
    elements: {
      line: {
        tension: 0.00001,
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart2Colours: Array < any > = [{ // grey
    backgroundColor: getStyle('--info'),
    borderColor: 'rgba(255,255,255,.55)'
  }];
  public lineChart2Legend = false;
  public lineChart2Type = 'line';


  // lineChart3

  public lineChart3Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: false
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart3Colours: Array < any > = [{
    backgroundColor: 'rgba(255,255,255,.2)',
    borderColor: 'rgba(255,255,255,.55)',
  }];
  public lineChart3Legend = false;
  public lineChart3Type = 'line';


  // barChart1
  public barChart1Data: Array < any > = [{
    data: [78, 81, 80, 45, 34, 12, 40, 78, 81, 80, 45, 34, 12, 40, 12, 40],
    label: 'Series A'
  }];
  public barChart1Labels: Array < any > = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
  public barChart1Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
        barPercentage: 0.6,
      }],
      yAxes: [{
        display: false
      }]
    },
    legend: {
      display: false
    }
  };
  public barChart1Colours: Array < any > = [{
    backgroundColor: 'rgba(255,255,255,.3)',
    borderWidth: 0
  }];
  public barChart1Legend = false;
  public barChart1Type = 'bar';

  // mainChart

  public mainChartElements = 27;
  public mainChartData1: Array < number > = [];
  public mainChartData2: Array < number > = [];
  public mainChartData3: Array < number > = [];

  public mainChartData: Array < any > = [{
      data: this.mainChartData1,
      label: 'Plasticos'
    },
    {
      data: this.mainChartData2,
      label: 'Orgánicos'
    },
    {
      data: this.mainChartData3,
      label: 'Papel y Cartón'
    }
  ];
  /* tslint:disable:max-line-length */
  public mainChartLabels: Array < any > = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Thursday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  /* tslint:enable:max-line-length */
  public mainChartOptions: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips,
      intersect: true,
      mode: 'index',
      position: 'nearest',
      callbacks: {
        labelColor: function(tooltipItem, chart) {
          return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          drawOnChartArea: false,
        },
        ticks: {
          fontSize: 9,
          fontColor: '#2F88BB',
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5,
          stepSize: Math.ceil(250 / 5),
        }
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 10,
        hoverBorderWidth: 3,

      }
    },
    legend: {
      display: true
    }
  };
  public mainChartColours: Array < any > = [{ // brandInfo
      backgroundColor: hexToRgba(getStyle('--info'), 10),
      borderColor: getStyle('--info'),
      pointHoverBackgroundColor: '#fff'
    },
    { // brandSuccess
      backgroundColor: hexToRgba(getStyle('--success'), 10),
      borderColor: getStyle('--success'),
      pointHoverBackgroundColor: '#fff'
    },
    { // brandDanger
      backgroundColor: hexToRgba('#ABABAB', 10),
      borderColor: '#ABABAB',
      pointHoverBackgroundColor: '#fff',
    }
  ];
  public mainChartLegend = true;
  public mainChartType = 'line';

  // social box charts

  public brandBoxChartData1: Array < any > = [{
    data: [65, 59, 84, 84, 51, 55, 40],
    label: 'Facebook'
  }];
  public brandBoxChartData2: Array < any > = [{
    data: [1, 13, 9, 17, 34, 41, 38],
    label: 'Twitter'
  }];
  public brandBoxChartData3: Array < any > = [{
    data: [78, 81, 80, 45, 34, 12, 40],
    label: 'LinkedIn'
  }];
  public brandBoxChartData4: Array < any > = [{
    data: [35, 23, 56, 22, 97, 23, 64],
    label: 'Google+'
  }];

  public brandBoxChartLabels: Array < any > = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public brandBoxChartOptions: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
      }],
      yAxes: [{
        display: false,
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  public brandBoxChartColours: Array < any > = [{
    backgroundColor: 'rgba(255,255,255,.1)',
    borderColor: 'rgba(255,255,255,.55)',
    pointHoverBackgroundColor: '#fff'
  }];
  public brandBoxChartLegend = false;
  public brandBoxChartType = 'line';

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  ngOnInit(): void {
    // generate random values for mainChart
    for (let i = 0; i <= this.mainChartElements; i++) {
      this.mainChartData1.push(this.random(50, 200));
      this.mainChartData2.push(this.random(80, 100));
      this.mainChartData3.push(this.random(20, 240));
    }
  }
}
