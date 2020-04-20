import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {HttpConnectionService,item,cartItem} from '../http-connection.service';

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
  constructor(private http:HttpClient,
              private modalService:NgbModal,
              private httpConnection:HttpConnectionService,
  ) { }

  ngOnInit() {
    if (this.httpConnection.localTest){
      this.items=[{
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
      });
    }
  }

  search(){
    if (this.searchText){
      this.httpConnection.searchItems(this.searchText).then(value => {
        if (value) this.items=value;
      });
    } else {
      this.httpConnection.getAllItems().then(value=>{
        this.items=value;
      });
    }
  }

  openDetail(content,index:number){
    this.selectedItem=this.items[index];
    this.selectOption=[];
    for (let i=1;i<=(this.selectedItem.quantity<5?this.selectedItem.quantity:5);i++){
      this.selectOption.push(i);
    }
    this.modalService.open(content,{ariaLabelledBy:'modal-title'});
  }
  addToCart(){
    if (this.httpConnection.status=='logout' && this.httpConnection.localTest==false) {
      alert('You need to login first!');
      return;
    }
    if (this.selectedQty==0) return;
    let temp:cartItem[]=JSON.parse(sessionStorage.getItem('cart'));

    if (!temp) temp=[];
    temp.push({_id:this.selectedItem._id,quantity:this.selectedQty});
    this.selectedQty=0;
    console.log(temp);
    sessionStorage.setItem('cart',JSON.stringify(temp));
    this.modalService.dismissAll('add');
  }
}
