<div align="center">

# `GSG` MERN-Chat-App

> #### This is a [**Progressive Web App**](https://medium.com/swlh/converting-existing-react-app-to-pwa-3c7e4e773db3) built using [`MERN Stack`](https://www.mongodb.com/mern-stack), which is primarily used for `Real-time Online Chatting` (similar to Whatsapp or MS Teams). Being a PWA, this app can be installed natively on mobile and desktop devices🔥. It allows a user to perform the following major operations:-

</div>

- Register/Login/Logout/search registered users
- Create one-to-one chats, discussion chats
- Send/edit/delete text messages
- Add/Edit/Delete/Download files (document/image/gif/audio/video) in messages
- Discussion Chat features (for all discussion members) 
  - View discussion members
  - Edit discussion display pic/discussion name 
  - Exit discussion
- Discussion Chat features (only for discussion admins)
  - Add/remove members 
  - Make/dismiss discussion admin 
  - Delete discussion 
- Edit profile pic/profile name
- Change profile password

<div align="center">

## Deployed Links 👇


</div>

## Tools Used 🛠️

### Frontend :-
- [React](https://reactjs.org/) for reusable, stateful UI components
- [Redux Toolkit](https://redux.js.org/tutorials/quick-start) for Global State Management
- [Sass](https://sass-lang.com/) for custom styling, responsive design
- [Bootstrap5](https://getbootstrap.com/) for quick styling, responsive design
- [Material UI](https://mui.com/) for dialogs, menus, alerts, toasts, tooltips, drawers, circular spinners, skeletons, chips, icons etc.
- [Lottie Files](https://lottiefiles.com/) for Animations
- [Emoji Picker](https://www.npmjs.com/package/emoji-picker-react) for adding emojis to text messages
- [Socket.io-client](https://www.npmjs.com/package/socket.io-client) for client-side socket setup and event handling
- [Axios](https://www.npmjs.com/package/axios) as an HTTP client for API calls

### Backend :-
- [Nodejs](https://nodejs.org/en/) as Backend JS Runtime
- [Express](https://expressjs.com/) as Backend Nodejs Framework
- [MongoDB](https://mongodb.com/) as Database
- [Mongoose](https://www.npmjs.com/package/mongoose) for Object Data Modeling Tool for MongoDB
- [Json Web Token](https://www.npmjs.com/package/jsonwebtoken) for User Authorization
- [Bcryptjs](https://www.npmjs.com/package/bcryptjs) for User Password Encryption and verification
- [Cloudinary package](https://www.npmjs.com/package/cloudinary) for uploading/deleting images to [cloudinary](https://cloudinary.com/)
- [AWS SDK Package](https://www.npmjs.com/package/aws-sdk) for downloading/deleting non-image files to [AWS S3](https://aws.amazon.com/s3/)
- [Multer](https://www.npmjs.com/package/multer) for uploading images temporarily to server for uploading to cloudinary 
- [Multer S3](https://www.npmjs.com/package/multer-s3) for uploading non-image files to AWS S3
- [Socket.io](https://www.npmjs.com/package/socket.io) for server-side socket setup and event handling

## Steps to Run Project Locally 💻

```bash
#Clone this repo to your local machine
git clone https://github.com/Abhishek-Sawant-98/Chat-Zoned.git

# Go to project root folder
cd Chat-Zoned
```
- Create `.env` file in root project folder and add the following environment variables (`KEY = VALUE`) 

|        **KEY**        |                                 **VALUE**                                |
|:---------------------:|:------------------------------------------------------------------------:|
|          PORT         |                        YOUR_PREFERRED_PORT_NUMBER                        |
|      MONGODB_URI      |                             YOUR_MONGODB_URI                             |
| CLOUDINARY_CLOUD_NAME |                        YOUR_CLOUDINARY_CLOUD_NAME                        |
|   CLOUDINARY_API_KEY  |                          YOUR_CLOUDINARY_API_KEY                         |
| CLOUDINARY_API_SECRET |                        YOUR_CLOUDINARY_API_SECRET                        |
|    DEFAULT_GROUP_DP   |                         YOUR_PREFERRED_IMAGE_URL                         |
|    DEFAULT_USER_DP    |                         YOUR_PREFERRED_IMAGE_URL                         |
|       JWT_SECRET      |                         YOUR_PREFERRED_JWT_SECRET                        |
|        NODE_ENV       | 'development' (While Developing)<br>or<br>'production' (While Deploying) |
|    S3_ACCESS_KEY_ID   |                         YOUR_AWS_S3_ACCESS_KEY_ID                        |
|  S3_SECRET_ACCESS_KEY |                       YOUR_AWS_S3_SECRET_ACCESS_KEY                      |
|       S3_REGION       |                         YOUR_AWS_S3_BUCKET_REGION                        |
|       S3_BUCKET       |                          YOUR_AWS_S3_BUCKET_NAME                         |

- Get `MongoDB URI` by creating a MongoDB cluster from [here](https://www.mongodb.com/)
- Get `cloudinary` related secret keys from [here](https://cloudinary.com/documentation/how_to_integrate_cloudinary)
- Get `AWS S3` related secret keys from [here](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html)
- Next, create another `.env` file in `frontend` folder and add the following environment variables (`KEY = VALUE`) 

|            **KEY**            |                                                          **VALUE**                                                          |
|:-----------------------------:|:---------------------------------------------------------------------------------------------------------------------------:|
|   REACT_APP_SERVER_BASE_URL   | http://localhost:YOUR_PORT_NUMBER <br>(Local Development)<br>or<br>https://YOUR_DEPLOYED_SERVER_URL <br>(During Deployment) |
|   REACT_APP_DEFAULT_USER_DP   |                                                   YOUR_PREFERRED_IMAGE_URL                                                  |
|   REACT_APP_DEFAULT_GROUP_DP  |                                                   YOUR_PREFERRED_IMAGE_URL                                                  |
| REACT_APP_PLACEHOLDER_IMG_URL |                                                   YOUR_PREFERRED_IMAGE_URL                                                  |
| REACT_APP_CLOUDINARY_BASE_URL |                                                  https://res.cloudinary.com                                                 |

### Run backend
```sh
# install dependencies (in root project folder)
npm install
# serve at localhost:YOUR_PORT_NUMBER
npm start
# serve with hot reload at localhost:YOUR_PORT_NUMBER
npm run dev
```

### Run frontend
```sh
# Go to 'frontend' folder
cd frontend
# install dependencies
npm install
# serve at localhost:3000 with hot reload
npm start
# build for production
npm run build
```


## License

[MIT](LICENSE) © WindAssassion

---

<div align="center">

### If you liked this app, show some ❤️ by starring 🌟 the repository 🙂

</div>

