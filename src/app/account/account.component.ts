import { Component, OnInit } from '@angular/core';
import {HttpConnectionService,userInfo,item,order} from '../http-connection.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {AlertService} from "../alert.service";

declare var $: any;
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  myAccount:userInfo={
    firstName:'',
    lastName:'',
    phonenumber:null,
    address:'',
    username:'',
    password:'',
    role:'User'
  };
  backup:userInfo;

  myOrders:order[]=[];

  selectedOrder:number;
  totalPrice:number;

  needChanged=false;
  constructor(private modalService:NgbModal,
  private httpConnection:HttpConnectionService,
              private alertService: AlertService) { }
  ngOnInit() {
    if (!this.httpConnection.localTest){
      this.httpConnection.getOrders().then(val=>{
        this.myOrders=val;
        for (let i of this.myOrders){
          i.price=0;
          for (let j of i.items){
            i.price+=j.price*j.quantity;
          }
        }
      });
      this.httpConnection.getUserInfo().then(val=>{
        this.myAccount=val;
        this.backup=val;
      });
    }
  }
  change(){
    this.needChanged=!this.needChanged;
    if (this.needChanged){
      Object.assign(this.backup,this.myAccount);
    } else {
      Object.assign(this.myAccount,this.backup);
    }
  }
  saveChange(){

    this.httpConnection.updateInfo(this.myAccount).then(value=>{
      if (value){
        this.needChanged=false;
        // this.alertService.success('Update successfully!')
        Swal.fire({
          type: 'success',
          title: 'Well Done!',
          text: 'Update successfully!'
        });
        // alert("Update successfully!");
      } else {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Update Failed'
        });
      }
    });
  }
  showDetail(content,index:number){
    this.selectedOrder=index;
    this.totalPrice=0;
    for (let i of this.myOrders[this.selectedOrder].items){
      this.totalPrice+=i.price*i.quantity;
    }
    this.modalService.open(content,{ariaLabelledBy:'modal-title',size: 'lg' });
  }


}
