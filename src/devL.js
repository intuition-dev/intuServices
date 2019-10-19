"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const URL = require('url');
var logger = require('tracer').console();
const Serv_1 = require("mbake/lib/Serv");
const MDB_1 = require("./srv/MDB");
const m = new MDB_1.MDB();
m.schema();
const serviceApp = new Serv_1.ExpressRPC();
serviceApp.makeInstance(['*']);
const handler = new Serv_1.BaseRPCMethodHandler();
serviceApp.routeRPC('monitor', 'monitor', (req, res) => {
    const params = URL.parse(req.url, true).query;
    params['ip'] = req.ip;
    m.ins(params);
    handler.ret(res, 'OK', 0, 0);
});
serviceApp.listen(8888);
const Client_1 = require("./agent/Client");
new Client_1.Client().foo();