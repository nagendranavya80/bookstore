# Bookstore

A server-rendered bookstore application built with Express, EJS, and MongoDB.

## Features

* Create, read, update, and delete books
* Server-side rendering using EJS
* MongoDB for data storage
* Express-based backend
*  User registration and login
* Password hashing with bcrypt
* JWT-based authentication

## Note
* No actual book content is stored, only book metadata.
* Authentication was partially implemented as part of learning and experimentation. The project primarily focuses on bookstore CRUD functionality.
  
## Tech Stack

* Node.js
* Express
* EJS
* MongoDB

## Getting Started

### Prerequisites

* Node.js and npm
* MongoDB database

### Installation

```bash
git clone https://github.com/ruthlesscalm/bookstore.git
cd bookstore
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
HOST=localhost
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET_KEY=<a-long-random-secret>
```

### Development

Terminal 1:

```bash
npm run tailwind
```

Terminal 2:

```bash
npm run dev
```

Visit:

```text
http://localhost:3000
```

### Add sample books

Run this to add any missing sample books and sample cover images. Existing books are kept:

```bash
npm run seed
```

Book covers for the sample collection are loaded from Open Library. When adding a book from the Upload page, you can optionally choose a JPG, PNG, WebP, or AVIF cover image up to 5 MB; uploaded images are stored in `public/uploads`.

### Create an account and log in

Open [http://localhost:3000/login](http://localhost:3000/login), switch to **Create an account**, and register with an email and password of at least 8 characters. Then log in with those credentials. The login API returns a JWT that the page stores for the current browser session.

## Deploy on Render

1. Push the project to GitHub, then create a **Web Service** in [Render](https://render.com/docs/deploy-node-express-app) and connect the repository.
2. Set the build command to `npm install --include=dev && npm run build` and the start command to `npm start`.
3. Add these environment variables in Render:
   - `MONGODB_URI`: your MongoDB Atlas connection string.
   - `JWT_SECRET_KEY`: a long, random secret. Generate one locally with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"` and paste the output into Render; do not commit it.
   - `HOST`: `0.0.0.0`.
   - `NODE_ENV`: `production`.
   Render provides `PORT` automatically. Do not copy your local `.env` file into GitHub.
4. In MongoDB Atlas, create a database user for the app and allow connections from your hosting service. Prefer its documented outbound IPs; if those aren't available, an Atlas access-list entry of `0.0.0.0/0` allows connections from anywhere, so use a strong database password and a minimally privileged user.
5. Deploy, then open the Render URL. If the Atlas database is empty, run `npm run seed` locally with `MONGODB_URI` set to that database.

Sample covers are hosted by Open Library. Uploaded cover files are stored locally under `public/uploads`; on hosts with an ephemeral filesystem, uploaded covers may disappear after a restart or redeploy. Use persistent storage or an image-storage service such as Cloudinary if you need uploaded photos to remain available.

## License

This project is licensed under the MIT License.

Feel free to use the code for learning, experimentation, or reference.
