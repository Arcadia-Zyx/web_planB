import {Component, OnDestroy, OnInit} from '@angular/core';
import {Label} from 'ng2-charts';
import { ChartsModule } from 'ng2-charts';
import {Chart,ChartType, ChartOptions, ChartDataSets} from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import {HttpConnectionService, fullOrder, item,rank} from '../http-connection.service';
import {Subject} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {AlertService} from "../alert.service";


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit,OnDestroy{
  private truncateLength=10;
  public canvas : any;
  public ctx;
  public ChartData: number []=[];

  public chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
      legend: {
        display: false,
        position: "right"
      }

  };

  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{
        // ticks: {
        //   callback: value => _.truncate(value, { length: 5 })
        // }
      }], yAxes: [{
        // ticks: {
        //   callback: value => _.truncate(value, { length: this.truncateLength })
        // }
      }] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Best sales' },
  ];

  collapse_order:boolean=false;
  dtOptions: DataTables.Settings={autoWidth:true,responsive: true};
  dtTrigger: Subject<any>=new Subject();
  orderList: fullOrder[]=[];
  totalIncome:number=0;
  pendingOrder: number=0;
  selectedOrder:fullOrder;
  orderIndex:number;
  totalPrice:number;
  newStatus:string;

  collapse_item:boolean=false;
  dtOptions2: DataTables.Settings={autoWidth:true,responsive: true};
  dtTrigger2: Subject<any>=new Subject();
  itemsList:item[]=[];
  selectedItem:item={
    name:'',
    _id:'',
    description: '',
    price: null,
    quantity: 0,
    category: '',
    picture: ''
  };
  private myChart: Chart;
  public doughnutChartData:any []=[]
    // =[1,2,3,4,5,6,7,8,9,10]
  public doughnutChartLabels:any []=[]
    // =[1,2,3,4,5,6,7,8,9,10]
  constructor(private modalService:NgbModal,
              private httpConnection:HttpConnectionService,
              private alertService: AlertService)
  { }

  ngOnInit() {

    this.httpConnection.getTops().then(val=>{
      if (val){
        for (let i of val){
          // this.barChartLabels.push(['','Line1', 'Line2'],);
          this.barChartLabels.push(i.name);
          this.doughnutChartLabels.push(i.name);

          this.doughnutChartData.push(i.sales);
          // this.barChartLabels.push(['Line1']);
          this.barChartData[0].data.push(i.sales);
        }

        console.log("label"+this.barChartLabels)
        console.log(this.barChartData[0].data)


        this.canvas = document.getElementById("chartDonut4");
        this.ctx = this.canvas.getContext("2d");

        this.myChart = new Chart(this.ctx,
          // {
          //   type: 'pie',
          //   data: {
          //     labels: this.barChartLabels.slice(0,4),
          //     datasets: [
          //       {
          //         label: "Population (millions)",
          //         backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
          //         data: this.barChartData[0].data.slice(0,4)
          //       }
          //     ]
          //   },
          //   options: {
          //     responsive: false,
          //     legend: {
          //       display: true,
          //       position: "top"
          //     },
          //     tooltips: {
          //     },
          //     title: {
          //       display: true,
          //       text: 'Predicted world population (millions) in 2050'
          //     },
          //
          //   }
          // });

          {
          type: 'pie',
          data: {
            labels: this.barChartLabels
              // .slice(0,4)
            ,
            datasets: [{
              label: "Population (millions)",
              backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#FF6384",
                "#4BC0C0",
                "#FFCE56",
                "#E7E9ED",
                "#36A2EB"],
              // data:  [1,2,3,4,5,6,7,8,9,10]
              // data:this.ChartData,
              data:this.barChartData[0].data
                // .slice(0,4)
            }]
          },
          options: {
            // responsive: false,
            title: {
              display: false,
              text: 'Top 10 Sales'
            },
            legend: {
              display: false,
              position:"top"
            },

          }
        }
        );

      }
    });


    this.httpConnection.getAllOrder().then(val=>{
      if (val){
        this.orderList=val;
        for (let i of this.orderList){
          i.price=0;
          if (i.items) {
            for (let j of i.items) {
              i.price += j.price * j.quantity;
            }
            if (i.status=='Approved') this.totalIncome+=i.price;
          }
          if (i.status=='Pending'){
            this.pendingOrder+=1;
          }
        }
        this.dtTrigger.next();
      }
    });
    this.httpConnection.getAllItems().then(val => {
      if (val){
        this.itemsList=val;
      } else {
        this.itemsList=[];
      }
      this.dtTrigger2.next();
    });
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtTrigger2.unsubscribe();
  }
  showOrder(content,index:number){
    this.orderIndex=index;
    this.selectedOrder=this.orderList[index];
    this.totalPrice=this.orderList[index].price;
    this.newStatus='';
    this.modalService.open(content,{ariaLabelledBy:'modal-title',size: 'lg' })
  }
  updateStatus(){
    if (this.newStatus){
      this.selectedOrder.status=this.newStatus;
      this.httpConnection.updateStatus(this.selectedOrder).then(val => {
        if (val){
          this.orderList[this.orderIndex].status=this.newStatus;
          this.pendingOrder-=1;
          if (this.newStatus=='Approved'){
            this.totalIncome+=this.selectedOrder.price;
          }
          this.modalService.dismissAll();
        } else {
          console.log("Update Failed");
        }
      });
    }
  }
  editItem(content,index:number){
    console.log("sdasdass")
    if (index<0){
      this.selectedItem={
        name:'',
        _id:'',
        description: '',
        price: null,
        quantity: 0,
        category: '',
        picture: ''
      };
    } else {
      this.selectedItem=this.itemsList[index];
    }
    this.modalService.open(content,{ariaLabelledBy:'modal-title2',size: 'lg' });
  }
  updateItem(){
    if (this.selectedItem._id){
      this.httpConnection.updateItem(this.selectedItem).then(value => {
        if (value){
          // alert("Update successfully!");
          // this.alertService.success('Update successfully!');
          Swal.fire({
            type: 'success',
            title: 'Well Done!',
            text: 'Update successfully!'
          });
          this.httpConnection.getAllItems().then(val => {
            if (val){
              this.itemsList=val;
            } else {
              this.itemsList=[];
            }
          });
          this.modalService.dismissAll();
        } else {
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Failed!'
          });
        }
      });
    } else {
      this.httpConnection.addItem(this.selectedItem).then(value => {
        if (value){
          // alert("Add successfully!");
          // this.alertService.success('Add successfully!');
          Swal.fire({
            type: 'success',
            title: 'Well Done!',
            text: 'Add successfully!'
          });
          this.httpConnection.getAllItems().then(val => {
            if (val){
              this.itemsList=val;
            } else {
              this.itemsList=[];
            }
          });
          this.modalService.dismissAll();
        } else {
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Failed!'
          });
        }
      });
    }
  }
  deleteItem(index:number){
    this.httpConnection.deleteItem(this.itemsList[index]._id).then(value => {
      if (value){
        // alert("Deleted!");
        // this.alertService.success('Deleted!');
        Swal.fire({
          type: 'success',
          title: 'Well Done!',
          text: 'Deleted!'
        });
        this.itemsList.splice(index,1);
      }
    });
  }
}
