const helper = require("../helper.js");
const KundeDao = require("./kundeDao.js");
const ZahlungsartDao = require("./zahlungsartDao.js");
const VeranstaltungDao = require("./veranstaltungDao.js");

class BestellungDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        const veranstaltungDao = new VeranstaltungDao(this._conn);
        const kundeDao = new KundeDao(this._conn);
        const zahlungsartDao = new ZahlungsartDao(this._conn);

        var sql = "SELECT * FROM Bestellung WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error("No Record found by id=" + id);

        result = helper.objectKeysToLower(result);

        result.veranstaltung = veranstaltungDao.loadById(result.veranstaltungid);
        delete result.veranstaltungid;

        result.zahlungsart = zahlungsartDao.loadById(result.zahlungsartid);
        delete result.zahlungsartid;

        result.kunde = kundeDao.loadById(result.kundeid);
        delete result.kundeid;
        
        return result;
    }

    loadAll() {
        const veranstaltungDao = new VeranstaltungDao(this._conn);
        var veranstaltungen = veranstaltungDao.loadAll();
        const kundeDao = new KundeDao(this._conn);
        var kunden = kundeDao.loadAll();
        const zahlungsartDao = new ZahlungsartDao(this._conn);
        var methods = zahlungsartDao.loadAll();

        var sql = "SELECT * FROM Bestellung";
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];

        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {

            if (helper.isNull(result[i].kundeid)) {
                result[i].kunde = null;
            } else {
                for (var element of kunden) {
                    if (element.id == result[i].kundeid) {
                        result[i].kunde = element;
                        break;
                    }
                }
            }
            delete result[i].kundeid;

            for (var element of methods) {
                if (element.id == result[i].zahlungsartid) {
                    result[i].zahlungsart = element;
                    break;
                }
            }
            delete result[i].zahlungsartid;

            if (helper.isNull(result[i].veranstaltungid)) {
                result[i].veranstaltung = null;
            } else {
                for (var element of veranstaltungen) {
                    if (element.id == result[i].veranstaltungid) {
                        result[i].veranstaltung = element;
                        break;
                    }
                }
            }
        }

        return result;
    }

    exists(id) {
        var sql = "SELECT COUNT(ID) AS cnt FROM Bestellung WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }

    create(mehrwertsteuer =1,anzahl = 1, zahlungsartid = 1, veranstaltungid = 1, kundeid = 1) {
        var sql = "INSERT INTO Bestellung (Mehrwertsteuer,Anzahl,ZahlungsartID,VeranstaltungID, KundeID) VALUES (?,?,?,?,?)";
        var statement = this._conn.prepare(sql);
        var params = [mehrwertsteuer, anzahl, zahlungsartid, veranstaltungid, kundeid];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not insert new Record. Data: " + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }
    
    update(id, mehrwertsteuer =1,anzahl = 1, zahlungsartid = 1, veranstaltungid = 1, kundeid = 1) {
        var sql = "UPDATE Bestellung SET Mehrwertsteuer=?,Anzahl=?,ZahlungsartID=?,VeranstaltungID=?, KundeID=? WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var params = [mehrwertsteuer, anzahl, zahlungsartid, veranstaltungid, kundeid, id];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not update existing Record. Data: " + params);
        
        var updatedObj = this.loadById(id);
        return updatedObj;
    }

    delete(id) {
        try {
            var sql = "DELETE FROM Bestellung WHERE ID=?";
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
        helper.log("BestellungDao [_conn=" + this._conn + "]");
    }
}

module.exports = BestellungDao;