const helper = require("../helper.js");
const BilderDao = require("./bilderDao.js");
const MusikrichtungDao = require("./musikrichtungDao.js");

class KuenstlerDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        const bilderDao = new BilderDao(this._conn);
        const musikrichtungDao = new MusikrichtungDao(this._conn);

        var sql = "SELECT * FROM Kuenstler WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error("No Record found by id=" + id);

        result = helper.objectKeysToLower(result);

        result.bilder = bilderDao.loadById(result.bilderid);
        delete result.bilderid;

        result.musikrichtung = musikrichtungDao.loadById(result.musikrichtungid);
        delete result.musikrichtungid;

        return result;
    }

    loadAll() {
        const bilderDao = new BilderDao(this._conn);
        var bilder = bilderDao.loadAll();
        const musikrichtungDao = new MusikrichtungDao(this._conn);
        var musikrichtung = musikrichtungDao.loadAll();
       
        var sql = "SELECT * FROM Kuenstler";
        var statement = this._conn.prepare(sql);
        var result = statement.all();
 
        if (helper.isArrayEmpty(result)) 
            return [];
        
        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {
            // result[i].bilder = null;
            //if(helper.isNull(result[i].bilderid)){
            //    result[i].bilder = null;

           // } 
           // else {
               
                for (var element of bilder) {              
                    if (element.id == result[i].bilderid) {
                        // console.log(result[i]); 23 i.O.
                        result[i].bilder = element;
                        break;
                    }
                }
                delete result[i].bilderid;
                
            //}  
            if (helper.isNull(result[i].musikrichtungid))  {
                result[i].musikrichtung=null;
            }else {  
                for (var element of musikrichtung) {
                    //console.log(element); = 23 i.O.
                    if (element.id == result[i].musikrichtungid) {
                        result[i].musikrichtung = element;
                        break;
                    }
                } 
            }    
            delete result[i].musikrichtungid;
        }
        return result;
    }
    

    exists(id) {
        var sql = "SELECT COUNT(ID) AS cnt FROM Kuenstler WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }

    create(bezeichnung = "", beschreibung = "", bilderid = 1, musikrichtungid = 1) {
        var sql = "INSERT INTO Kuenstler (Bezeichnung,Beschreibung,BilderID,MusikrichtungID) VALUES (?,?,?,?)";
        var statement = this._conn.prepare(sql);
        var params = [bezeichnung, beschreibung, bilderid, musikrichtungid];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not insert new Record. Data: " + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, bezeichnung = "", beschreibung = "", bilderid = 1, musikrichtungid = 1) {
        var sql = "UPDATE Kuenstler SET Bezeichnung=?,Beschreibung=?,BilderID=?,MusikrichtungID=? WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var params = [bezeichnung, beschreibung, bilderid, musikrichtungid, id];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not update existing Record. Data: " + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }

    delete(id) {
        try {
            var sql = "DELETE FROM Kuenstler WHERE ID=?";
            var statement = this._conn.prepare(sql);
            var result = statement.run(id);

            if (result.changes != 1) 
                throw new Error("Could not delete Record by id=" + id);

            return true;
        } catch (ex) {
            throw new Error("Could not delete Record by id=" + id + ". Reason: " + ex.message);
        }
    }

    toString() {
        helper.log("KuenstlerDao [_conn=" + this._conn + "]");
    }
}

module.exports = KuenstlerDao;