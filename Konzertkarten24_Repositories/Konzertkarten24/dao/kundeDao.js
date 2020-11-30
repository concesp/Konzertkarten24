const helper = require("../helper.js");
const AdresseDao = require("./adresseDao.js");

class KundeDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        const adresseDao = new AdresseDao(this._conn);

        var sql = "SELECT * FROM Kunde WHERE ID=?";
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
        var countries = adresseDao.loadAll();

        var sql = "SELECT * FROM Kunde";
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];
        
        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {
            for (var element of countries) {
                if (element.id == result[i].adresseid) {
                    result[i].adresse = element;
                    break;
                }
            }
            delete result[i].adresseid;
        }

        return result;
    }

    exists(id) {
        var sql = "SELECT COUNT(ID) AS cnt FROM Kunde WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }

    create(anrede = "", vorname = "", nachname = "", adresseID = 1, telefonnummer = "", email="") {
        var sql = "INSERT INTO Kunde (Anrede,Vorname,Nachname,AdresseID,Telefonnummer,Email) VALUES (?,?,?,?,?,?)";
        var statement = this._conn.prepare(sql);
        var params = [anrede, vorname, nachname, adresseID, telefonnummer, email];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not insert new Record. Data: " + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(anrede = "", vorname = "", nachname = "", adresseID = 1, telefonnummer = "", email="") {
        var sql = "UPDATE Kunde SET Anrede=?,Vorname=?,AdreseID=?,Telefonnummer=?,EMail=?, WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var params = [anrede, vorname, nachname, adresseID, telefonnummer, email, id];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not update existing Record. Data: " + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }

    delete(id) {
        try {
            var sql = "DELETE FROM Kunde WHERE ID=?";
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
        helper.log("KundeDao [_conn=" + this._conn + "]");
    }
}

module.exports = KundeDao;