import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import routes from "./src/routes/index";
import * as admin from "firebase-admin";
import serviceAccount from "./serviceAccount.json";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Maintaining Friendships API!");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server!!!! is running at http://localhost:${port}`);
});

app.use(express.json());
app.use("/api", routes);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});
