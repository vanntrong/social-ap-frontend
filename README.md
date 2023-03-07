
# Social App

Small Facebook clone - Written with ReactJS - Author [vanntrong](https://github.com/vanntrong)

**_NOTE:_**
This is a frontend part, if you want to see backend part please visit [https://github.com/vanntrong/social-app-backend](https://github.com/vanntrong/social-app-backend)

## Site Demo
[https://social-app.vovantrong.online/](https://social-app.vovantrong.online/)

## Features
- Expand your relationship, make more friends with the `friend` feature and `friend suggestion`
- Share life's moments with post feature and display modes: `public`, `private` and `friends only`
- `New feed` feature with Infinity scrolling
- Share short-term moments with the `story` feature, which automatically hides after 24 hours
- Integrated `real-time` feature, helping you to text, receive notifications fastest

## Technologies used

- [x] ReactJS
- [x] TypeScript
- [x] SCSS
- [x] Material UI
- [x] Redux
- [x] SocketIO

## Guide line

### After clone this project, please follow instructions below to run or build this project

Because this project is used to learn `ReactJS`, so I put env file here, you can use this env or use yours

#### Run in local

- Install dependencies

```sh
yarn install # or npm install
```

- Run project

```sh
yarn start # or npm run start
```
- Visit web page with url: [http://localhost:3000](http://localhost:3000)

#### Build via Docker

In this project, I used `Docker` and `Nginx` to build and serve web service

- Build Docker Image

```sh
docker build -t {your-image-name} .
```
- Run docker image

```sh
docker run -p 80:80/tcp --name {your-container-name} -d {your-image-name}
```
