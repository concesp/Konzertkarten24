const helper = require("../helper.js");
const KuenstlerDao = require("./kuenstlerDao.js");
const VeranstaltungsortDao = require("./veranstaltungsortDao.js");

class VeranstaltungDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        const veranstaltungsortDao = new VeranstaltungsortDao(this._conn);
        const kuenstlerDao = new KuenstlerDao(this._conn);

        var sql = "SELECT * FROM Veranstaltung WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error("No Record found by id=" + id);

        result = helper.objectKeysToLower(result);

        result.veranstaltungsort = veranstaltungsortDao.loadById(result.veranstaltungsortid);
        delete result.veranstaltungsortid;

        result.kuenstler = kuenstlerDao.loadById(result.kuenstlerid);
        delete result.kuenstlerid;

        if (helper.isNull(result.kuenstlerId)) {
            result.kuenstler = null;
        } else {
            result.kuenstler = kuenstlerDao.loadById(result.kuenstlerId);
        }
       delete result.kuenstlerid;

        return result;
    }

    loadAll() {
        const veranstaltungsortDao = new VeranstaltungsortDao(this._conn);
        var ort = veranstaltungsortDao.loadAll();
        const kuenstlerDao = new KuenstlerDao(this._conn);
        var kuenstler = kuenstlerDao.loadAll();
        
        var sql = "SELECT * FROM Veranstaltung";
        var statement = this._conn.prepare(sql);
        var result = statement.all();
        
        if (helper.isArrayEmpty(result)) 
            return [];
       
        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {

            for (var element of kuenstler) { 
                console.log(element);    
                if (element.id == result[i].kuenstlerid) {
                    result[i].kuenstler = element;
                    break;
                    }
                }
            delete result[i].kuenstlerid;
        
            if (helper.isNull(result[i].veranstaltungsortid)){
                result[i].veranstaltungsort=null;
            } else{
                for (var element of ort){
                    if (element.id == result[i].veranstaltungsortid) {
                        result[i].veranstaltungsort = element;
                        break;
                    }
                }
            }
            delete result[i].veranstaltungsortid;
      }
        return result;
    }

    exists(id) {
        var sql = "SELECT COUNT(ID) AS cnt FROM Veranstaltung WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }


    create(preis = "", datum = "", veranstaltungsortid = 1, kuenstlerid = 1) {
        var sql = "INSERT INTO Veranstaltung (Preis,Datum,VeranstaltungsortID,KuenstlerID) VALUES (?,?,?,?)";
        var statement = this._conn.prepare(sql);
        var params = [preis,datum,veranstaltungsortid,kuenstlerid];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not insert new Record. Data: " + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, preis = "", datum = "", veranstaltungsortid = 1, kuenstlerid = 1) {
        var sql = "UPDATE Veranstaltung SET Preis=?,Datum=?,VeranstaltungsortID=?,KuenstlerID=? WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var params = [preis,datum,veranstaltungsortid,kuenstlerid, id];
        var result = statement.run(params);


        if (result.changes != 1) 
            throw new Error("Could not update existing Record. Data: " + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }

    delete(id) {
        try {
            var sql = "DELETE FROM Veranstaltung WHERE ID=?";
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
        helper.log("VeranstaltungDao [_conn=" + this._conn + "]");
    }
}

module.exports = VeranstaltungDao;