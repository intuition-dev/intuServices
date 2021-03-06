// All rights reserved by Cekvenich|INTUITION.DEV) |  Cekvenich, licensed under LGPL 3.0

import { TerseB } from "terse-b/terse-b"

const log:any = new TerseB('main') 

import {  Serv }  from 'http-rpc/lib/Serv'

import {  MetricsHandler } from "./handler/MetricsHandler"
import {  DashHandler } from "./handler/DashHandler"
import { MeDB } from "./db/MeDB"

const express = require('express')

const srv = new Serv(['*'],4 *1024) 

const db =  new MeDB()

const mh = new MetricsHandler(db)

Serv._expInst.use(express.json( {type: '*/*'} ) )

Serv._expInst.use(function(req,resp, next){
   log.info(req.originalUrl)
   next()
})

// old school ajax, not rpc
Serv._expInst.post('/metrics',  mh.metrics)
Serv._expInst.post('/error', mh.error)
Serv._expInst.post('/log', mh.log)

//DASH
const dashH = new DashHandler(db)
srv.routeRPC('api',  dashH)

srv.serveStatic('./webApp', 60*60, 60)

Serv._expInst.use(function(req,resp, next){
   log.warn('err, not found', req.originalUrl)
})

srv.listen(3000)

