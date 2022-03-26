## Errand Buddy - Helping With Your Errands Daily

The intent of the site is to provide an online p2p marketplace for users to errands such as dog walks, pet sitting, picking up groceries, queuing for the latest phone or sneaker launch, etc. Users can list the errands they wish to outsource for a pre-determined fee and, other users (whom we call the buddy) can accept these errands.

* Built as part of a project for a software engineering course.
* Mern Stack App
* Frontend uses HTML, CSS, Javascript, React.js. Can be accessed at the following url: https://github.com/MichaelKalamogan/Errand-Buddy-Frontend


## Tech Stack / Libraries for backend

* Javascript
* Node.Js
* Express
* Mongoose
* MongoDB
* JsonWebToken
* Nodemailer
* Date fns

## API Used
* Stripe
* Google map

#### Authentication
* Authentication is done by using jsonwebtoken and localstorage stores the token for authenticating the client side routes, where needed.
* Reset password uses jsonwebtoken to send a link, through nodemailer, that is valid for a short period of time.

#### Uploading of files
Images are uploaded to cloudinary using multer and streamify, so as to minimise any local disk storage: https://cloudinary.com/blog/node_js_file_upload_to_a_local_server_or_to_the_cloud
* A cloudinary id was included in errand schemas to faciliate the deletion of previous images whenever there is an update to the image or the errand is deleted.

# Suggestions and Improvements
Will appreciate any suggestions and improvements to the code, layout, user interface or even the basic idea itself. Thank you. 


## Restful Routes

| No      | Route    |   Url  | HTTP Verb   |   Description  |
| ------- | -------- | ------ | ----------- | -------------  | 
|  1      | Index    |   /    |   Get       |    Homepage    |


## User Routes
 
| No      | Route    | Url                    | HTTP Verb   | Description                    |
| ------- | -------- | --------------------   | ---------   | ---------------------------    | 
| 1       | Login    | /api/users/login       | Post        | Login to accept/create errands |
| 2       | Register | /api/users/register    | Post        | Register new user              |
| 3       | Dashboard| /api/users/dashboard   | Get         | User's dashboard with job history, details and wallet balance |
| 4       | Create   |/api/users/create-errand| Post        | Create errands with form data  |
| 5       | Edit     |/api/users/forgot-password| Post      | Form to submit reset password  |
| 6       | Reset Password| api/users/reset-password/:id/:token| Get | Page to reset password |
| 7       | Submit New Password | /api/users/reset-password/submit| Patch | Submit new password|


## Errand Routes

| No      | Route    | Url                    | HTTP Verb   | Description                    |
| ------- | -------- | --------------------   | ---------   | ---------------------------    | 
| 1       | Show     | /api/errands/show/:id     | Get       | Direct to show full details of the errand
| 2       | Accept   | /api/errands/:id/accepted | Post      | Update database which buddy has accepted the errand |
| 3       | Completed | /api/errands/:id/completed| Post     | Update database that the buddy has completed the errand |
| 4       | Review    | /api/errands/:id/completed/review| Post |  For buddy to post review and rating on the job |




## Area of Improvements

* Some of the repeated code could be broken into functions.

