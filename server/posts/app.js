import express from "express";
import { randomBytes } from "crypto";
import morgan from "morgan";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
  })
);

const posts = {};

console.log(posts);
app.get("/posts", (req, res, next) => {
  res.send(posts);
});

app.post("/posts/create", async (req, res, next) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = {
    id,
    title,
  };

  console.log("This is title:", title);

  await axios.post("http://event-bus-cluster-ip-service:4005/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  });

  res.status(201).json(posts[id]);
});

// this is the event bus emitted event
app.post("/events", (req, res) => {
  console.log("Received Event", req.body.type);

  res.send({});
});

app.listen(4000, () => {
  console.log("Posts Service Listening on 4000");
  console.log("hi there");
});
