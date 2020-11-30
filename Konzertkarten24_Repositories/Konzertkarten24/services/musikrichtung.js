const helper = require("../helper.js");
const MusikrichtungDao = require("../dao/musikrichtungDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.get("/musikrichtung/gib/:id", function(request, response) {
    helper.log("Service Musikrichtung: Client requested one record, id=" + request.params.id);

    const musikrichtungDao = new MusikrichtungDao(request.app.locals.dbConnection);
    try {
        var result = musikrichtungDao.loadById(request.params.id);
        helper.log("Service Musikrichtung: Record loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Musikrichtung: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/musikrichtung/alle", function(request, response) {
    helper.log("Service Musikrichtung: Client requested all records");

    const musikrichtungDao = new MusikrichtungDao(request.app.locals.dbConnection);
    try {
        var result = musikrichtungDao.loadAll();
        helper.log("Service Musikrichtung: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Musikrichtung: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/musikrichtung/existiert/:id", function(request, response) {
    helper.log("Service Musikrichtung: Client requested check, if record exists, id=" + request.params.id);

    const musikrichtungDao = new MusikrichtungDao(request.app.locals.dbConnection);
    try {
        var result = musikrichtungDao.exists(request.params.id);
        helper.log("Service Musikrichtung: Check if record exists by id=" + request.params.id + ", result=" + result);
        response.status(200).json(helper.jsonMsgOK({ "id": request.params.id, "existiert": result }));
    } catch (ex) {
        helper.logError("Service Musikrichtung: Error checking if record exists. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post("/musikrichtung", function(request, response) {
    helper.log("Service Musikrichtung: Client requested creation of new record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.bezeichnung)) 
       //errorMsgs.push("bezeichnung fehlt");
        request.body.bezeichnung = "";
    
    if (errorMsgs.length > 0) {
        helper.log("Service Musikrichtung: Creation not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Hinzufügen nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    const musikrichtungDao = new MusikrichtungDao(request.app.locals.dbConnection);
    try {
        var result = musikrichtungDao.create(request.body.bezeichnung);
        helper.log("Service Musikrichtung: Record inserted");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Musikrichtung: Error creating new record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.put("/musikrichtung", function(request, response) {
    helper.log("Service Musikrichtung: Client requested update of existing record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push("id fehlt");
    if (helper.isUndefined(request.body.bezeichnung)) 
        errorMsgs.push("bezeichnung fehlt");

    if (errorMsgs.length > 0) {
        helper.log("Service Musikrichtung: Update not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Update nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    const musikrichtungDao = new MusikrichtungDao(request.app.locals.dbConnection);
    try {
        var result = musikrichtungDao.update(request.body.id, request.body.bezeichnung);
        helper.log("Service Musikrichtung: Record updated, id=" + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Musikrichtung: Error updating record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete("/musikrichutung/:id", function(request, response) {
    helper.log("Service Musikrichtung: Client requested deletion of record, id=" + request.params.id);

    const musikrichtungDao = new MusikrichtungDao(request.app.locals.dbConnection);
    try {
        var obj = musikrichtungDao.loadById(request.params.id);
        musikrichtungDao.delete(request.params.id);
        helper.log("Service Musikrichtung: Deletion of record successfull, id=" + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ "gelöscht": true, "eintrag": obj }));
    } catch (ex) {
        helper.logError("Service Musikrichtung: Error deleting record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;