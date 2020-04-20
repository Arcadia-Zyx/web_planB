import { Component, OnInit } from '@angular/core';
import {HttpConnectionService, item, cartItem} from '../http-connection.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartList:item[]=[{
    _id:'1235657457547',
    name: "apple",
    description: "des",
    price: 1.0,
    quantity: 10,
    category: "foods",
    picture: "/assets/apple.png"
  }];
  totalPrice=0;
  temp:cartItem[]=[];
  constructor(private httpConnection:HttpConnectionService) { }
  ngOnInit() {
    this.temp=JSON.parse(sessionStorage.getItem('cart'));
    console.log(this.temp);
    if (this.temp==null) this.temp=[];
    this.fetchData();
  }

  async fetchData(){
    this.cartList=[];
    for (let i of this.temp){
      await this.httpConnection.getItemById(i._id).then(value => {
        let goods:item=value;
        if (goods!=null) {
          goods.quantity = i.quantity;
          this.cartList.push(goods);
        } else {
          alert("Error while fetching data");
        }
      });
    }
    this.totalPrice=0;
    for (let i of this.cartList){
      this.totalPrice+=i.quantity*i.price;
    }
  }

  removeItem(index:number){
    this.cartList.splice(index,1);
    this.temp.splice(index,1);
    sessionStorage.setItem('cart',JSON.stringify(this.temp));
    this.totalPrice=0;
    for (let i of this.cartList){
      this.totalPrice+=i.quantity*i.price;
    }
  }
  clearAll(){
    this.temp=[];
    this.cartList=[];
    this.totalPrice=0;
    sessionStorage.setItem('cart',JSON.stringify([]));
  }
  submitOrder() {
    this.httpConnection.placeOrder(this.cartList).then(val => {
      if (val) {
        this.clearAll();
        alert('Your order has been placed!');
      } else {
        alert('Submit order failed!');
      }
    });
  }
}


