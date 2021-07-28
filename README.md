# Errand Buddy - Providing Errand for a Fee

## User Story
An online marketplace for users to list services or errands to be fulfilled for a fee

## App Link




## Tech Stack / Libraries
* ReactJs
* Javascript
* NodeJs
* Express
* MongoDB
* JWT
* Material UI
* Bootstrap
* Nodemailer

## API Used
* Stripe
* Google map

## App Features

*  New User can see lists of errands posted at the Homepage
*  After successful login/register , User can accept or create errands which can be accepted by other users
*  Upon completion of errand, User can submit review and ratings of the other users which will be reflected in users dashboard
*  Errands not yet accepted can be edited or deleted
*  Payment page via Stripe will be reflected in users wallet
*  Payment received from other users will be reflected in dashboard


## Area of Improvements




## Wireframes








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
