import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {HttpConnectionService,item,cartItem} from '../http-connection.service';
import {Router} from '@angular/router';
import {isAsciiLetter} from "codelyzer/angular/styles/chars";
declare var $: any;

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  searchText: string;
  items:item[]=[];
  selectedItem:item;
  selectOption:number[]=[];
  selectedQty:number;
  recentOrders:item[]=[];
  categoryList:string[]=[];
  filterList:item[]=[];
  filter:string="Show All";
  priceIndex:number=0;
  priceFilter=[
    {l:0,r:-1},
    {l:0,r:10},
    {l:10,r:20},
    {l:20,r:50},
    {l:50,r:100},
    {l:100,r:200},
    {l:200,r:500},
    {l:500,r:-1},
  ];
  constructor(private modalService:NgbModal,
              private httpConnection:HttpConnectionService,
              private router: Router
  ) { }

  ngOnInit() {

    if (this.httpConnection.localTest){

    } else {
      this.httpConnection.getAllItems().then(value=>{
        this.items=value;
        for (let k of this.items){
          if (this.categoryList.indexOf(k.category)<0){
            this.categoryList.push(k.category);
          }
        }
        this.filter="Select Category";
        this.priceIndex=0;
        this.selectFilter();
        if (!this.httpConnection.isAdmin) {
          this.httpConnection.getLastOrder().then(val => {
            if (val) {
              this.recentOrders = val.items;
              for (let i of this.recentOrders) {
                i.quantity = 0;
                for (let j of this.items) {
                  if (j._id == i._id) {
                    i.quantity = j.quantity;
                    break;
                  }
                }
              }
            }
          });
        }
      });
    }
  }

  search(){
    if (this.searchText){
      this.httpConnection.searchItems(this.searchText).then(value => {
        if (value) this.items=value;
        this.filter="Select Category";
        this.priceIndex=0;
        this.selectFilter();
      });
    } else {
      this.httpConnection.getAllItems().then(value=>{
        this.items=value;
        this.filter="Select Category";
        this.priceIndex=0;
        this.selectFilter();
      });
    }
  }
  selectFilter(){
      if (this.filter=="Select Category"||this.filter=="Show All"){
        this.filterList=[];
        for (let i of this.items){
          if (i.price>=this.priceFilter[this.priceIndex].l){
            if (this.priceFilter[this.priceIndex].r<0){
              this.filterList.push(i);
            } else if (i.price<this.priceFilter[this.priceIndex].r){
              this.filterList.push(i);
            }
          }
        }
      } else {
        this.filterList=[];
        for (let i of this.items){
          if (i.category==this.filter && i.price>=this.priceFilter[this.priceIndex].l){
            if (this.priceFilter[this.priceIndex].r<0){
              this.filterList.push(i);
            } else if (i.price<this.priceFilter[this.priceIndex].r){
              this.filterList.push(i);
            }

          }
        }
        console.log(this.filter,this.priceIndex,this.filterList);
      }
  }
  openDetail(content,index:number,source:string){
    if (source=='recent'){
      this.selectedItem=this.recentOrders[index];
    } else {
      this.selectedItem=this.items[index];
    }
    this.selectOption=[];
    for (let i=1;i<=(this.selectedItem.quantity<5?this.selectedItem.quantity:5);i++){
      this.selectOption.push(i);
    }
    this.modalService.open(content,{ariaLabelledBy:'modal-title'});
  }
  addToCart(){
    if (this.httpConnection.status=='logout' && this.httpConnection.localTest==false) {
      alert('You need to login first!');
      this.modalService.dismissAll();
      this.router.navigate(['login']);
    } else {
      if (this.selectedQty == 0) return;
      let temp: cartItem[] = JSON.parse(sessionStorage.getItem('cart'));
      if (!temp) temp = [];
      for (let i of temp){
        if (i._id===this.selectedItem._id){
          alert('This item is already in cart.');
          this.selectedQty = 0;
          this.modalService.dismissAll();
          return;
        }
      }
      temp.push({_id: this.selectedItem._id, quantity: this.selectedQty});
      this.selectedQty = 0;
      sessionStorage.setItem('cart', JSON.stringify(temp));
      alert('Add to cart successfully');
      this.modalService.dismissAll('add');
    }
  }



}
