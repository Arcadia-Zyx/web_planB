import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const backend = 'https://simonxu0811-infsci2560-api.glitch.me/';


@Injectable({
  providedIn: 'root'
})
export class HttpConnectionService {
  public loginStatus = new EventEmitter();
  public status = 'logout';
  private headers;
  public isAdmin = false;
  public name = '';

  public localTest=false;

  constructor(private http: HttpClient) {
    let conTemp:loginInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
    if (conTemp!=null){
      this.headers= new HttpHeaders().set('Authorization', 'Bearer ' + conTemp.token);
      this.isAdmin=conTemp.isAdmin;
      this.name=conTemp.username;
      this.status='login';
    }
  }

  public async login(username: string, password: string) {
    return new Promise<boolean>(resolve => {
      this.http.post<loginResponse>(backend + 'users/login', {
        password: password,
        username: username
      }).subscribe((value) => {
        this.changeUserStatus('login');
        this.headers= new HttpHeaders().set('Authorization', 'Bearer ' + value.token);
        this.isAdmin = (value.role === 'Admin');
        this.name = value.username;

        let temp:loginInfo={
          token:value.token,
          isAdmin:this.isAdmin,
          username:this.name
        };

        sessionStorage.setItem('loginInfo',JSON.stringify(temp));

        resolve(true);
      }, response => {
        resolve(false);
      });
    });
  }

  public async getUserInfo() {
    return new Promise<userInfo>(resolve => {
      if (!this.name) {
        resolve(null);
      } else {
        this.http.get<userInfo>(backend + 'users/AllUserInfo/' + this.name,{headers:this.headers}).subscribe(value => {
            resolve(value);
          }, response => {
            resolve(null);
          }
        );
      }
    });
  }

  public async updateInfo(val:userInfo){
    return new Promise<boolean>(resolve => {
      if (!this.name) {
        resolve(false);
      } else {
        this.http.put<userInfo>(backend + 'users/updateUserInfo/' + this.name,val,{headers:this.headers}).subscribe(value => {
            resolve(true);
          }, response => {
            resolve(false);
          }
        );
      }
    });
  }

  public async getOrders(){
    return new Promise<order[]>(resolve => {
      if (!this.name) {
        resolve(null);
      } else {
        this.http.get<order[]>(backend + 'users/orderHistory/' + this.name,{headers:this.headers}).subscribe(value => {
            resolve(value);
          }, response => {
            resolve(null);
          }
        );
      }
    });
  }

  public async placeOrder(value:item[]){
    return new Promise<boolean>(resolve => {
      if (!this.name){
        resolve(false);
      } else {
        this.http.post(backend+'users/submitOrder/'+this.name,value,{headers:this.headers}).subscribe(val=>{
          resolve(true);
        },err=>{
          resolve(false);
        })
      }
    });
  }

  public async searchItems(keyword:string){
    return new Promise<item[]>(resolve => {
      this.http.get<item[]>(backend+'searchItems/'+keyword,{headers:this.headers}).subscribe(value => {
        resolve(value);
      }, err=>{
        resolve(null);
      })
    });
  }

  public async getAllItems() {
    return new Promise<item[]>(resolve => {
      this.http.get<item[]>(backend + 'getAllItems', {headers: this.headers}).subscribe((value) => {
        resolve(value);
      });
    });
  }

  public async getItemById(id:string){
    return new Promise<item>(resolve => {
      this.http.get<item>(backend + 'users/getItemsById/'+id, {headers: this.headers}).subscribe((value) => {
        resolve(value);
      },error => {
        resolve(null);
      });
    });
  }

  public async logout() {
    this.headers.set('Authorization', '');
    this.isAdmin = false;
    this.name='';
    sessionStorage.setItem('loginInfo',null);
    this.changeUserStatus('logout');
  }

  public async signup(value:userInfo){
    return new Promise<boolean>(resolve => {
      console.log(value);
      this.http.post(backend + 'users/signup',value, {headers: this.headers}).subscribe((value) => {
        resolve(true);
      },error => {
        resolve(false);
      });
    });
  }

  public async getLastOrder(){
    return new Promise<order>(resolve => {
      if (!this.name) resolve(null);
      else {
        this.http.get<order>(backend + 'users/getLastOrder/' + this.name, {headers: this.headers}).subscribe(value => {
          resolve(value);
        }, error => {
          resolve(null);
        });
      }
    });
  }

  public async getAllOrder(){
    return new Promise<fullOrder[]>(resolve => {
      if (!this.isAdmin) resolve(null);
      else {
        this.http.get<fullOrder[]>(backend + 'admins/getAllOrders', {headers: this.headers}).subscribe(value => {
          resolve(value);
        }, error => {
          resolve(null);
        });
      }
    });
  }

  public async getTops(){
    return new Promise<rank[]>(resolve => {
        this.http.get<rank[]>(backend + 'topTenSales', {headers: this.headers}).subscribe(value => {
          resolve(value);
        }, error => {
          resolve(null);
        });
    });
  }

  public async updateStatus(newOne:fullOrder){
    return new Promise<boolean>(resolve => {
      this.http.put(backend + 'admins/changeOrderHistory/'+newOne._id,newOne, {headers: this.headers}).subscribe(value => {
        resolve(true);
      }, error => {
        resolve(false);
      });
    });
  }

  public async updateItem(newOne:item){
    return new Promise<boolean>(resolve => {
      this.http.put(backend + 'admins/updateItem/'+newOne._id,newOne, {headers: this.headers}).subscribe(value => {
        resolve(true);
      }, error => {
        resolve(false);
      });
    });
  }

  public async addItem(newOne:item){
    return new Promise<boolean>(resolve => {
      this.http.post(backend + 'admins/addItems',newOne, {headers: this.headers}).subscribe(value => {
        resolve(true);
      }, error => {
        resolve(false);
      });
    });
  }

  public async deleteItem(id:string){
    return new Promise<boolean>(resolve => {
      this.http.delete(backend + 'admins/deleteItem/'+id, {headers: this.headers}).subscribe(value => {
        resolve(true);
      }, error => {
        resolve(false);
      });
    });
  }

  private changeUserStatus(status: string) {
    this.status = status;
    this.loginStatus.emit(status);
  }

}

export interface item {
  _id: string
  name: string,
  description: string,
  price: number,
  quantity: number,
  category: string,
  picture: string
}

export interface loginResponse {
  username: string,
  password: string,
  firstName: string,
  lastName: string,
  role: string,
  token: string
}

export interface userInfo {
  firstName: string,
  lastName: string,
  phonenumber: number,
  address: string,
  role:string,
  password:string,
  username:string,
}

export interface order{
  _id:string,
  price:number,
  createdAt:string,
  status:string,
  items:item[]
}

export interface fullOrder{
  _id:string,
  price:number,
  createdAt:string,
  status:string,
  firstName:string,
  lastName:string,
  address:string,
  phonenumber:number,
  items:item[]
}

export interface cartItem{
  _id:string;
  quantity:number;
}

export interface loginInfo{
  token:string,
  username:string,
  isAdmin:boolean,
}

export interface rank {
  _id:string,
  name:string,
  sales:number,
}
