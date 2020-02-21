// All rights reserved by Cekvenich|INTUITION.DEV) |  Cekvenich, licensed under LGPL 3.0

import { SysAgent } from "./SysAgent"

import { HttpRPC } from "http-rpc/lib/SrvRPC"
import { YamlConfig } from "./FileOpsExtra"

const bunyan = require('bunyan')
const bformat = require('bunyan-format2')  
const formatOut = bformat({ outputMode: 'short' })

export class Agent {

    _log = bunyan.createLogger({src: true, stream: formatOut, name: this.constructor.name })
    
    config
    constructor() {
      this.config =new YamlConfig(process.cwd()+'/agentg.yaml')
      
      Agent.rpc = new HttpRPC(this.config['proto'], this.config['host'], this.config['port'])
    }
    static rpc 

    async runSmall() {
      this._log.info('loop: S')
      let params = await SysAgent.statsSmall()

      try {
        await Agent.rpc.invoke('agent', 'agentSmall', params  )
      } catch(err) {this._log.warn(err)}

      console.log(params)
      await  SysAgent.wait(1400)
      this.runSmall()
    }

    async runBig() {
      this._log.info('loop: B')
      let params = {}
      params = await SysAgent.statsBig()
      let ports = await new SysAgent().ports()
      params['ports'] = ports
      let ps = await SysAgent.ps()
      params['ps']= ps

      try {
        await Agent.rpc.invoke('agent', 'agentBig', params  )
      } catch(err) {this._log.warn(err)}

      console.log(params)
      await  SysAgent.wait(20*1000)
      this.runBig()
    }


}