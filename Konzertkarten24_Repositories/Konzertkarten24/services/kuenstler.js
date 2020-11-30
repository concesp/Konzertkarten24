const helper = require("../helper.js");
const KuenstlerDao = require("../dao/kuenstlerDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.get("/kuenstler/gib/:id", function(request, response) {
    helper.log("Service Kuenstler: Client requested one record, id=" + request.params.id);

    const kuenstlerDao = new KuenstlerDao(request.app.locals.dbConnection);
    try {
        var result = kuenstlerDao.loadById(request.params.id);
        helper.log("Service Kuenstler: Record loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Kuenstler: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/kuenstler/alle", function(request, response) {
    helper.log("Service Kuenstler: Client requested all records");

    const kuenstlerDao = new KuenstlerDao(request.app.locals.dbConnection);
    try {
        var result = kuenstlerDao.loadAll();
        helper.log("Service Kuenstler: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Kuenstler: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/kuenstler/existiert/:id", function(request, response) {
    helper.log("Service Kuenstler: Client requested check, if record exists, id=" + request.params.id);

    const kuenstlerDao = new KuenstlerDao(request.app.locals.dbConnection);
    try {
        var result = kuenstlerDao.exists(request.params.id);
        helper.log("Service Kuenstler: Check if record exists by id=" + request.params.id + ", result=" + result);
        response.status(200).json(helper.jsonMsgOK({ "id": request.params.id, "existiert": result }));
    } catch (ex) {
        helper.logError("Service Kuenstler: Error checking if record exists. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post("/kuenstler", function(request, response) {
    helper.log("Service Kuenstler: Client requested creation of new record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.bezeichnung)) 
        errorMsgs.push("bezeichnung fehlt");
    if (helper.isUndefined(request.body.beschreibung)) 
        errorMsgs.push("beschreibung fehlt");
    if (helper.isUndefined(request.body.bilder)) {
        errorMsgs.push("bilder fehlt")
    } else if (helper.isUndefined(request.body.bilder.id)) 
        errorMsgs.push("bilder.id fehlt");
    if (helper.isUndefined(request.body.musikrichtung)) {
        errorMsgs.push("musikrichtung fehlt")
    } else if (helper.isUndefined(request.body.musikrichtung.id)) 
        errorMsgs.push("musikrichtung.id fehlt");
    
    if (errorMsgs.length > 0) {
        helper.log("Service Kuenstler: Creation not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Hinzufügen nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    const kuenstlerDao = new KuenstlerDao(request.app.locals.dbConnection);
    try {
        var result = kuenstlerDao.create(request.body.bezeichnung, request.body.beschreibung, request.body.bilder.id, request.body.musikrichtung.id);
        helper.log("Service Kuenstler: Record inserted");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Kuenstler: Error creating new record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.put("/kuenstler", function(request, response) {
    helper.log("Service Kuenstler: Client requested update of existing record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push("id fehlt");
    if (helper.isUndefined(request.body.bezeichnung)) 
        errorMsgs.push("bezeichnung fehlt");
    if (helper.isUndefined(request.body.beschreibung)) 
        errorMsgs.push("beschreibung fehlt");
    if (helper.isUndefined(request.body.bilder)) {
        errorMsgs.push("bilder fehlt")
    } else if (helper.isUndefined(request.body.bilder.id)) 
        errorMsgs.push("bilder.id fehlt");
    if (helper.isUndefined(request.body.musikrichtung)) {
        errorMsgs.push("musikrichtung fehlt")
    } else if (helper.isUndefined(request.body.musikrichtung.id)) 
        errorMsgs.push("musikrichtung.id fehlt");
   
    if (errorMsgs.length > 0) {
        helper.log("Service Kuenstler: Update not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Update nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    const kuenstlerDao = new KuenstlerDao(request.app.locals.dbConnection);
    try {
        var result = kuenstlerDao.update(request.body.id, request.body.bezeichnung, request.body.beschreibung, request.body.bilder.id, request.body.musikrichtung.id);
        helper.log("Service Kuenstler: Record updated, id=" + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Kuenstler: Error updating record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete("/kuenstler/:id", function(request, response) {
    helper.log("Service Kuenstler: Client requested deletion of record, id=" + request.params.id);

    const kuenstlerDao = new KuenstlerDao(request.app.locals.dbConnection);
    try {
        var obj = kuenstlerDao.loadById(request.params.id);
        kuenstlerDao.delete(request.params.id);
        helper.log("Service Kuenstler: Deletion of record successfull, id=" + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ "gelöscht": true, "eintrag": obj }));
    } catch (ex) {
        helper.logError("Service Kuenstler: Error deleting record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;