"use strict";
// All rights reserved by INTUITION.DEV |  Cekvenich, licensed under LGPL 3.0
Object.defineProperty(exports, "__esModule", { value: true });
// error 431 : https://stackoverflow.com/questions/32763165/node-js-http-get-url-length-limitation
const Serv_1 = require("http-rpc/lib/Serv");
const AgentHandler_1 = require("./handler/AgentHandler");
const AgDB_1 = require("./db/AgDB");
const DashHandler_1 = require("./handler/DashHandler");
const srv = new Serv_1.Serv(['*'], 16 * 1024); // set the size of header
let db = new AgDB_1.AgDB();
const ah = new AgentHandler_1.AgentHandler(db);
const dh = new DashHandler_1.DashHandler(db);
srv.routeRPC('agent', ah);
srv.routeRPC('dash', dh);
srv.listen(8888);
