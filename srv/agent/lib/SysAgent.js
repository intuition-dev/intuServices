"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan = require('bunyan');
const bformat = require('bunyan-format2');
const formatOut = bformat({ outputMode: 'short' });
const log = bunyan.createLogger({ src: true, stream: formatOut, name: "Base" });
const find = require('find-process');
const disk = require('diskusage');
class SysAgent {
    static async diskUsage() {
        const diskS = await disk.check('/');
        console.log(JSON.stringify(diskS));
        return diskS;
    }
    static async ports() {
        let ports = [];
        await SysAgent.si.networkConnections().then(data => {
            data.forEach(function (v) {
                ports.push(v.localport);
            });
        });
        console.log(ports);
        let results = [];
        let pids = {};
        for (let i = 0; i < ports.length; i++) {
            let row = await find('port', ports[i]);
            console.log(ports[i], row);
            if (!row)
                continue;
            if (row[0])
                row = row[0];
            let pid = row['pid'];
            if (pids.hasOwnProperty(pid))
                continue;
            pids[pid] = 'X';
            row['port'] = ports[i];
            delete row['ppid'];
            delete row['uid'];
            delete row['gid'];
            delete row['cmd'];
            delete row['bin'];
            results.push(row);
        }
        console.log(results);
        return results;
    }
    static async stats() {
        const track = new Object();
        track['guid'] = SysAgent.guid();
        track['dt_stamp'] = new Date().toISOString();
        await SysAgent.si.fsStats().then(data => {
            track['fsR'] = data.rx;
            track['fsW'] = data.wx;
        });
        await SysAgent.si.disksIO().then(data => {
            track['ioR'] = data.rIO;
            track['ioW'] = data.wIO;
        });
        await SysAgent.si.fsOpenFiles().then(data => {
            track['openMax'] = data.max;
            track['openAlloc'] = data.allocated;
        });
        let nic;
        await SysAgent.si.networkInterfaceDefault().then(data => {
            nic = data;
        });
        await SysAgent.si.networkStats(nic).then(function (data) {
            const dat = data[0];
            track['nicR'] = dat.rx_bytes;
            track['nicT'] = dat.tx_bytes;
        });
        await SysAgent.si.mem().then(data => {
            track['memFree'] = data.free;
            track['memUsed'] = data.used;
            track['swapUsed'] = data.swapused;
            track['swapFree'] = data.swapfree;
        });
        await SysAgent.si.currentLoad().then(data => {
            track['cpu'] = data.currentload;
            track['cpuIdle'] = data.currentload_idle;
        });
        track['host'] = SysAgent.os.hostname();
        return track;
    }
    static wait(t) {
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve();
            }, t);
        });
    }
}
exports.SysAgent = SysAgent;
SysAgent.guid = require('uuid/v4');
SysAgent.si = require('systeminformation');
SysAgent.os = require('os');