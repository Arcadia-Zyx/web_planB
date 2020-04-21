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
  filterIndex:number=-1;
  constructor(private modalService:NgbModal,
              private httpConnection:HttpConnectionService,
              private router: Router
  ) { }

  ngOnInit() {

    if (this.httpConnection.localTest){
      this.filterList=[{
        _id:'123',
        name: "apple",
        description: "des",
        price: 1.0,
        quantity: 10,
        category: "foods",
        picture: "/assets/apple.png"
      },{
        _id:'123',
        name: "apple",
        description: "des",
        price: 1.0,
        quantity: 2,
        category: "foods",
        picture: "/assets/apple.png"
      },{
        _id:'123',
        name: "apple",
        description: "des",
        price: 1.0,
        quantity: 0,
        category: "foods",
        picture: "/assets/apple.png"
      },{
        _id:'123',
        name: "apple",
        description: "des",
        price: 1.0,
        quantity: 10,
        category: "foods",
        picture: "/assets/apple.png"
      },{
        _id:'123',
        name: "apple",
        description: "des",
        price: 1.0,
        quantity: 10,
        category: "foods",
        picture: "/assets/apple.png"
      },{
        _id:'123',
        name: "apple",
        description: "des",
        price: 1.0,
        quantity: 10,
        category: "foods",
        picture: "/assets/apple.png"
      },{
        _id:'123',
        name: "apple",
        description: "des",
        price: 1.0,
        quantity: 10,
        category: "foods",
        picture: "/assets/apple.png"
      }];
    } else {
      this.httpConnection.getAllItems().then(value=>{
        this.items=value;
        for (let k of this.items){
          if (this.categoryList.indexOf(k.category)<0){
            this.categoryList.push(k.category);
          }
        }
        this.selectFilter(-1);
        this.httpConnection.getLastOrder().then(val=>{
          if (val){
            this.recentOrders=val.items;
            for (let i of this.recentOrders){
              i.quantity=0;
              for (let j of this.items){
                if (j._id==i._id){
                  i.quantity=j.quantity;
                  break;
                }
              }
            }
          }
        });
      });
    }
  }

  search(){
    if (this.searchText){
      this.httpConnection.searchItems(this.searchText).then(value => {
        if (value) this.items=value;
        this.selectFilter(-1);
      });
    } else {
      this.httpConnection.getAllItems().then(value=>{
        this.items=value;
        this.selectFilter(-1);
      });
    }
  }
  selectFilter(index:number){
      this.filterIndex=index;
      if (index<0){
        this.filterList=this.items;
      } else {
        this.filterList=[];
        for (let i of this.items){
          if (i.category==this.categoryList[index]){
            this.filterList.push(i);
          }
        }
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
