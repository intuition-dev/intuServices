// All rights reserved by MetaBake (INTUITION.DEV) | Cekvenich, licensed under LGPL 3.0

const fs = require('fs-extra')

var logger = require('tracer').console()

/**
 * Helper for SQLite3
 */
export class BBaseDBL {
   protected _fn
   protected _db

   static Database = require('better-sqlite3')

   con( fn) {
      this._fn = fn
      this._db = new BBaseDBL.Database(fn)

      this._db.pragma('cache_size = 5000')
      logger.trace(this._db.pragma('cache_size', { simple: true }))

      this._db.pragma('synchronous=OFF')
      this._db.pragma('count_changes=OFF')
      this._db.pragma('journal_mode=MEMORY')
      this._db.pragma('temp_store=MEMORY')

      this._db.pragma('locking_mode=EXCLUSIVE')
      logger.trace(this._db.pragma('locking_mode', { simple: true }))

   }

   tableExists(tab): boolean { 
      try {
         const row = this.readOne("SELECT name FROM sqlite_master WHERE type=\'table\' AND name= ?", tab)
         if(row['name'] == tab) return true
         return false
      } catch(err) {
         return false
      }   
   }//()

   // returns # of rows changed
   write(sql:string, ...args):number {
         const stmt = this._db.prepare(sql)
         const info= stmt.run(args)
         return info.changes
   }

   read(sql:string, ...args):Array<Object> {
      const stmt = this._db.prepare(sql)
      return stmt.all(args)
   }

   /**
   like read, but returns only the first row
   */
   readOne(sql:string, ...args):Object {
      const stmt = this._db.prepare(sql)
      return stmt.get(args)
   }

}//class

