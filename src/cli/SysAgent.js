"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Invoke_1 = require("./Invoke");
class SysAgent {
    async ping() {
        console.log('ping:->');
        const track = new Object();
        track['guid'] = SysAgent.uuid();
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
            console.log('nic', data);
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
            track['cpu'] = data.avgload;
        });
        track['host'] = SysAgent.os.hostname();
        await SysAgent.rpc.invoke('monitor', 'monitor', 'monitor', track);
        await console.log('<-', JSON.stringify(track));
        await this.wait(2000);
        this.ping();
    }
    wait(t) {
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                console.log('.');
                resolve();
            }, t);
        });
    }
    async info() {
        console.log('info');
        await SysAgent.si.services('node, pm2, caddy').then(data => {
            for (let o of data)
                delete o['startmode'];
        });
        SysAgent.si.networkConnections().then(data => console.log(data));
        SysAgent.si.processes().then(data => console.log(data));
        SysAgent.si.networkInterfaces().then(data => console.log(data));
        SysAgent.si.fsSize().then(data => console.log(data));
        SysAgent.si.blockDevices().then(data => console.log(data));
        SysAgent.si.osInfo().then(data => console.log(data));
        SysAgent.si.users().then(data => console.log(data));
    }
}
exports.SysAgent = SysAgent;
SysAgent.uuid = require('uuid/v4');
SysAgent.si = require('systeminformation');
SysAgent.os = require('os');
SysAgent.rpc = new Invoke_1.httpRPC('http', 'localhost', 8888);