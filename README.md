# Final Report

## Introduction 
- Introduce the team and provide a high level description of the project. Be sure to include full names and Pitt IDs.

#### Team members
||Name|Pitt Id|
|:---|---|---|
||Yixiang Zhu|yiz167|
||Tiance Zhang|tiz57|
||Qixian Wu|qiw63|
|Leader|Yiduo Wang||
||Zijian Xu|zix10|

## Objective 
- Describe with more specific details what your objectives and goals are for the project. What problems did you want to solve or what did you want to learn in developing this application? What features, beyond the ones listed in the assignment requirements, did you implement?

## Team member’s contributions 
- Describe in detail what each member of the team did on the project.  

|Responsibility|Name|
|:---|---|
|Software Design|Yixiang Zhu, Zijian Xu|
|Backend & API test|Zijian Xu|
|Frontend|Yixiang Zhu|
|UI design|Qixian Wu|


## Technical Architecture 
- What are the libraries, frameworks, and other technologies you used and how did you put them together. Use the MVC conceptual model to provide a guide (i.e. what are the models/views/controllers and what do they do).  
> Framewoks & Libraries    
Frontend: Angular 8 + ng-bootstrap + ng-charts + sweetalert2 + datatable  
Backend: Express.js + cors + jwt + mongoose + mongoose-timestamp-plugin  
- Backend  
In the backend, the architecture is that model layer contains users, order history and items.  
Controller layer contains each of the functions as well as the implement in Service layer.  
And then the backend creates REST API to send data to server and connect with the view layer.  
Different roles have their own authorities to get access to APIs. So JWT is applied to determine whether the roles are guests or users or admins.
 
 
> REST APIs for guest   
> - Url: https://simonxu0811-infsci2560-api.glitch.me/getAllItems  
> Method: GET
> - Url: https://simonxu0811-infsci2560-api.glitch.me/serachItems/:name  
> Method: GET
> - Url : https://simonxu0811-infsci2560-api.glitch.me/topTenSales  
> Method: GET
>
> REST APIs for users
> - Url: https://simonxu0811-infsci2560-api.glitch.me/users/signup  
> Method: POST
> - Url: https://simonxu0811-infsci2560-api.glitch.me/users/login  
> Method: POST
> - Url: https://simonxu0811-infsci2560-api.glitch.me/users/getItemsById/:id  
> Method: GET
> - Url: https://simonxu0811-infsci2560-api.glitch.me/users/submitOrder/:username  
> Method: POST
> - Url: https://simonxu0811-infsci2560-api.glitch.me/users/AllUserInfo/:username  
> Method: GET
> - Url: https://simonxu0811-infsci2560-api.glitch.me/users/updateUserInfo/:username  
> Method: PUT
> - Url: https://simonxu0811-infsci2560-api.glitch.me/users/orderHistory/:username  
> Method: GET
> - Url: https://simonxu0811-infsci2560-api.glitch.me/users/getLastOrder/:username  
> Method: GET
> 
>REST APIs for admins
> - Url: https://simonxu0811-infsci2560-api.glitch.me/admins/changeOrderHistory/:id  
> Method: PUT
> - Url: https://simonxu0811-infsci2560-api.glitch.me/admins/changeRole/:username/:role  
> Method: PUT
> - Url: https://simonxu0811-infsci2560-api.glitch.me/admins/addItems  
> Method: POST
> - Url: https://simonxu0811-infsci2560-api.glitch.me/admins/updateItem/:id  
> Method: PUT
> - Url: https://simonxu0811-infsci2560-api.glitch.me/admins/getAllOrders  
> Method: GET
> - Url: https://simonxu0811-infsci2560-api.glitch.me/admins/deleteItem/:id  
> Method: DELETE



## Challenges 
- Discuss any challenges you faced in trying to develop this app. Were there libraries or technologies you wanted to use but we’re frustrating? Where there features you couldn’t get working?


## Future Work 
- What features would you like to add to your application? If you had more time what technologies would you like to learn?

## Conclusion 
- Reflect upon the web technologies and standards you learned in this course, did you learn what you wanted? What technologies or standards do you think would be useful in future iterations of this course?

## Resources 
- List any resources that you used in creating this project (I.e. tutorials, library documentation, or blog posts). Only include resources that are beyond the readings from the course. 
Include any specific instructions for testing the functionality of your application.
