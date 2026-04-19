//This is the main server controller file.  
//The backend server is started and defined here
//we use Express.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./src/routes/index.js";

dotenv.config();

const app = express(); // express variable
const port = process.env.PORT || 8080; //Port is defined in GCP (still 8080), but if not being deployed it will default to 8080 locally

//need to allow the backend to communicate with our frontend throught CORS
//these are all the URLs we allow
const allowedOrigins = [
  process.env.FRONTEND_URL, //deployed URL
  "http://localhost:3000", //localhost
  "http://127.0.0.1:3000",//localhost IP
].filter(Boolean);

app.use(
  cors({ //cors function to allow all the Origins we defined
    origin(origin, callback) {
      console.log("CORS origin:", origin);

      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json()); 
app.use("/api", apiRoutes); //imports all the routes we define in our backend API - index.js

//starts the server on port 8080
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
