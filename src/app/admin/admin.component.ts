import {Component, OnDestroy, OnInit} from '@angular/core';
import {Label} from 'ng2-charts';
import {ChartType, ChartOptions, ChartDataSets} from 'chart.js';
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

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
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
  dtOptions: DataTables.Settings={autoWidth:true};
  dtTrigger: Subject<any>=new Subject();
  orderList: fullOrder[]=[];
  totalIncome:number=0;
  pendingOrder: number=0;
  selectedOrder:fullOrder;
  orderIndex:number;
  totalPrice:number;
  newStatus:string;

  collapse_item:boolean=true;
  dtOptions2: DataTables.Settings={autoWidth:true};
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

  constructor(private modalService:NgbModal,
              private httpConnection:HttpConnectionService,
              private alertService: AlertService)
  { }

  ngOnInit() {
    this.httpConnection.getTops().then(val=>{
      if (val){
        for (let i of val){
          this.barChartLabels.push(i.name);
          this.barChartData[0].data.push(i.sales);
        }
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
