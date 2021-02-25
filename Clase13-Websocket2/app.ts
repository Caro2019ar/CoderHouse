import express, { Application, Request, Response } from "express";
import fs from "fs";
const path = require("path"),
	app: Application = express(),
	http = require("http").createServer(app),
	io = require("socket.io")(http),
	bodyParser = require("body-parser"),
	port = 8080,
	handlebars = require("express-handlebars");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("views"));
app.engine(
	"hbs",
	handlebars({
		extname: ".hbs",
		defaultLayout: "index.hbs",
		layoutsDir: __dirname + "/views/",
		partialsDir: __dirname + "/views/partials/",
	})
);
app.set("views", "./views");
app.set("view engine", "hbs");

let messages: any = [];
let produtos: any = [];

app.get("/", (req: Request, res: Response) => {
	res.render("index");
});

io.on("connection", (socket: any) => {
	console.log("Nuevo cliente conectado");
	socket.emit("messages", messages);
	socket.on("new-message", function (data: any) {
		messages.push(data);
		io.sockets.emit("messages", messages);
		fs.writeFileSync("messages.txt", JSON.stringify(messages));
	});
	socket.emit("produtos", produtos);
	socket.on("new-produto", function (produto: any) {
		produtos.push(produto);
		io.sockets.emit("produtos", produtos);
	});
});

http.listen(port, () => {
	console.log(`Conexión al puerto ${port}`);
});
