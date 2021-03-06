"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker = require('faker');
const guid = require('uuid/v4');
const perfy = require('perfy');
const bunyan = require('bunyan');
const bformat = require('bunyan-format2');
const formatOut = bformat({ outputMode: 'short' });
const log = bunyan.createLogger({ src: true, stream: formatOut, name: "pup" });
const DB_1 = require("./DB");
const db = new DB_1.DB();
class LoadGen {
    async run() {
        perfy.start('loop');
        var i = 0;
        do {
            i++;
            await this.single();
        } while (i < 100 * 1000);
        await db.countMon();
        var result = perfy.end('loop');
        log.info(result.time);
    }
    async single() {
        const send = {
            guid: guid(), ip: faker.internet.ip(),
            host: faker.internet.userName(),
            nicR: faker.random.number(), nicT: faker.random.number(),
            memFree: faker.random.number(), memUsed: faker.random.number(),
            cpu: faker.random.number(),
            dt_stmp: new Date().toISOString()
        };
        db.ins(send);
    }
}
exports.LoadGen = LoadGen;
