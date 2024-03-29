"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const terse_b_1 = require("terse-b/terse-b");
const csv = require('csv-parser');
const fs = require('fs-extra');
const BaseDBS_1 = require("mbakex/lib/BaseDBS");
const ip = require('ip'); //
const perfy = require('perfy');
class GDB extends BaseDBS_1.BaseDBS {
    constructor() {
        super();
        this.log = new terse_b_1.TerseB(this.constructor.name);
        this.schema();
    } //()
    _ins(p) {
        let fromInt;
        let toInt;
        try {
            fromInt = ip.toLong(p['0']);
            toInt = ip.toLong(p['1']);
        }
        catch (err) {
            console.log(p['0']);
            fromInt = 0;
        }
        this.write(`INSERT INTO geo( fromInt, toInt, first, last, cont,
            cou, state, city, 
            lat, long
         )
            VALUES
         ( ?,?,?,?,?,
           ?,?,?,
           ?,?
         )`, fromInt, toInt, p['0'], p['1'], p['2'], p['3'], p['4'], p['5'], p['6'], p['7']);
    } //()
    async load() {
        perfy.start('imp');
        const csvFile = './gdb/dbip-city-lite-2020-01.csv';
        const THIZ = this;
        await fs.createReadStream(csvFile)
            .pipe(csv({ headers: false }))
            .on('data', async (row) => {
            await THIZ._ins(row);
        })
            .on('end', () => {
            let time = perfy.end('imp');
            console.log(':i:');
            this.log.info(time);
            this.get('64.78.253.68');
        });
    } //()
    async schema() {
        this.defCon(process.cwd() + '/dbip.db');
        const exists = this.tableExists('geo');
        this.log.info(exists);
        if (exists)
            return;
        this.log.info('.');
        this.write(`CREATE TABLE geo( fromInt, toInt,
         cou, state, city,
         first, last, cont,
         lat, long
         ) `);
        this.write(`CREATE INDEX geoLook ON geo (fromInt, toInt, cou, state, city DESC)`);
    } //()
    get(adrs) {
        const fromInt = ip.toLong(adrs);
        this.log.info(adrs, fromInt);
        const row = this.readOne(`SELECT cou, state, city FROM geo
         WHERE ? >= fromInt
      
         ORDER BY fromInt DESC 
         LIMIT 1
         `, fromInt);
        //let time = perfy.end('g')
        console.log(row);
        return row;
    } //()
} //()
exports.GDB = GDB;
