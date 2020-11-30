const helper = require("../helper.js");


class AdresseDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        var sql = "SELECT * FROM Adresse WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error("No Record found by id=" + id);

        return helper.objectKeysToLower(result);

    }

    loadAll() {
        var sql = "SELECT * FROM Adresse";
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];
        
        result = helper.arrayObjectKeysToLower(result);
        return result;
    }

    exists(id) {
        var sql = "SELECT COUNT(ID) AS cnt FROM Adresse WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }

    create(strasse = "", plz = "", ort = "") {
        var sql = "INSERT INTO Adresse (Strasse,PLZ,Ort) VALUES (?,?,?)";
        var statement = this._conn.prepare(sql);
        var params = [strasse,  plz, ort];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not insert new Record. Data: " + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(strasse = "", plz = "", ort = "") {
        var sql = "UPDATE Adresse SET Strasse=?,PLZ=?,Ort=?, WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var params = [strasse, plz, ort, id];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not update existing Record. Data: " + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }

    delete(id) {
        try {
            var sql = "DELETE FROM Adresse WHERE ID=?";
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
        helper.log("AdresseDao [_conn=" + this._conn + "]");
    }
}

module.exports = AdresseDao;