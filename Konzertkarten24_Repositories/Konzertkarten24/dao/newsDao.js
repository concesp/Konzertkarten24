const helper = require("../helper.js");
const KuenstlerDao = require("./kuenstlerDao.js");

class NewsDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        const kuenstlerDao = new KuenstlerDao(this._conn);

        var sql = "SELECT * FROM News WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error("No Record found by id=" + id);

        result = helper.objectKeysToLower(result);

        result.kuenstler = kuenstlerDao.loadById(result.kuenstlerid);
        delete result.kuenstlerid;

        return result;
    }

    loadAll() {
        const kuenstlerDao = new KuenstlerDao(this._conn);
        var kuenstler = kuenstlerDao.loadAll();

        var sql = "SELECT * FROM News";
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];
        
        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {
            console.log(result);
            for (var element of kuenstler) {
                if (element.id == result[i].kuenstlerid) {
                    result[i].kuenstler = element;
                    break;
                }
            }
            delete result[i].kuenstlerid;
        }

        return result;
    }

    exists(id) {
        var sql = "SELECT COUNT(ID) AS cnt FROM News WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }

    create(zeitpunkt = "", beschreibung = "", kuenstlerid = 1) {
        var sql = "INSERT INTO News (Zeitpunkt,Beschreibung,KuenstlerID) VALUES (?,?,?)";
        var statement = this._conn.prepare(sql);
        var params = [zeitpunkt, beschreibung, kuenstlerid];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not insert new Record. Data: " + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, zeitpunkt = "", beschreibung = "", kuenstlerid = 1) {
        var sql = "UPDATE News SET Zeitpunkt=?,Beschreibung=?, KuenstlerID=? WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var params = [zeitpunkt, beschreibung, kuenstlerid, id];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not update existing Record. Data: " + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }

    delete(id) {
        try {
            var sql = "DELETE FROM News WHERE ID=?";
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
        helper.log("NewsDao [_conn=" + this._conn + "]");
    }
}

module.exports = NewsDao;