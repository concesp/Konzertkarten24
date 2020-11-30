const helper = require("../helper.js");
const AdresseDao = require("./adresseDao.js");

class VeranstaltungsortDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        const adresseDao = new AdresseDao(this._conn);

        var sql = "SELECT * FROM Veranstaltungsort WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error("No Record found by id=" + id);

        result = helper.objectKeysToLower(result);

        result.adresse = adresseDao.loadById(result.adresseid);
        delete result.adresseid;

        return result;
    }

    loadAll() {
        const adresseDao = new AdresseDao(this._conn);
        var adresse = adresseDao.loadAll();

        var sql = "SELECT * FROM Veranstaltungsort";
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];
        
        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {
            for (var element of adresse) {
                if (element.id == result[i].adresseid) {
                    result[i].adresse = element;
                    break;
                }
            }
         //   delete result[i].adresseid;
        }

        return result;
    }

    exists(id) {
        var sql = "SELECT COUNT(ID) AS cnt FROM Veranstaltungsort WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }

    create(zusatztext = "", plaetze = "", adresseid = 1) {
        var sql = "INSERT INTO Veranstaltungsort (Zusatztext,Plaetze,AdresseID) VALUES (?,?,?)";
        var statement = this._conn.prepare(sql);
        var params = [zusatztext, plaetze, adresseid];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not insert new Record. Data: " + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, zusatztext = "", plaetze = "", adresseid = 1) {
        var sql = "UPDATE Veranstaltungsort SET Zusatztext=?,Plaetze=?,AdresseID=? WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var params = [zusatztext, plaetze, adresseid, id];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not update existing Record. Data: " + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }

    delete(id) {
        try {
            var sql = "DELETE FROM Veranstaltungsort WHERE ID=?";
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
        helper.log("VeranstaltungsortDao [_conn=" + this._conn + "]");
    }
}

module.exports = VeranstaltungsortDao;