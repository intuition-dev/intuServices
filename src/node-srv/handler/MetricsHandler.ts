import { MeDB } from "../db/MeDB"
import { Utils } from "../db/Utils"

const bunyan = require('bunyan')
const bformat = require('bunyan-format2')  
const formatOut = bformat({ outputMode: 'short' })
const log = bunyan.createLogger({src: true, stream: formatOut, name: "MetricsHandler"})

log.info('hand')
const hash = require("murmurhash3js")

export class MetricsHandler {
  
   static _db:MeDB
   
   constructor(db) {
      MetricsHandler._db = db
   }

   // perf trace route on ip

   // percent chance of processing vs ignore by domain
   
   async metrics1911(req, resp) {// RUM, APM, 

      let params = req.body
      
      // ip fingers
      let ip = req.connection.remoteAddress
      const fullDomain = params.domain
      let domain:string = fullDomain.replace('http://','').replace('https://','').split(/[/?#]/)[0]

      let str:string =  domain +  params.fidc + ip
      const fullFinger:string = hash.x64.hash128(str)
      
      setTimeout(function(){resp.send('OK')},0)

      try {
         // dev only XXX ***
         // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
         ip = '64.78.253.68'

         MetricsHandler._db.writeMetrics(domain, fullFinger, params, ip)
      } catch(err) {
         log.warn(err)
      }
   }//()
   
   error1911(req, resp) { //let str:string =  params.fidc + ip

      log.info('error')
      let ip = req.connection.remoteAddress
      let params = req.body
      
      const fullDomain = params.domain
      let domain:string = Utils.getDomain(fullDomain)

      let str:string =  domain + params.fidc + ip
      const fullFinger:string = hash.x64.hash128(str)

      let error = params.error

      setTimeout(function(){resp.send('OK')},0)
      
      if(! (MetricsHandler.isJSON(error)))
        MetricsHandler._db.writeError(domain, fullFinger, ip, fullDomain, error)
      else {    
         let mesage = JSON.parse(error)
      
         MetricsHandler._db.writeError(domain, fullFinger, ip, fullDomain, mesage.mesage,  mesage.mode, mesage.name, mesage.stack) 
      }

   }//()
   

   log(req, resp) {
      resp.send('log')
      let ip = req.connection.remoteAddress
      let params = req.body

      const fullDomain = params.domain
      let domain:string = Utils.getDomain(fullDomain)

      let fid = params.fidc
      let arg = params.arg
      MetricsHandler.isJSON(arg)

      let error = JSON.parse(arg)
      log.info(Object.keys(error))

      //log.info(error)

   }//()

   static isJSON(str):boolean {
      try {
         JSON.parse(str)
         return true
     } catch (e) {
         return false
      }

   }//()

}//class