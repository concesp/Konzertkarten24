const helper = require("../helper.js");
const VeranstaltungDao = require("../dao/veranstaltungDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.get("/veranstaltung/gib/:id", function(request, response) {
    helper.log("Service Veranstaltung: Client requested one record, id=" + request.params.id);

    const veranstaltungDao = new VeranstaltungDao(request.app.locals.dbConnection);
    try {
        var result = veranstaltungDao.loadById(request.params.id);
        helper.log("Service Veranstaltung: Record loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Veranstaltung: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/veranstaltung/alle", function(request, response) {
    helper.log("Service Veranstaltung: Client requested all records");

    const veranstaltungDao = new VeranstaltungDao(request.app.locals.dbConnection);
    try {
        var result = veranstaltungDao.loadAll();
        helper.log("Service Veranstaltung: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Veranstaltung: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/veranstaltung/existiert/:id", function(request, response) {
    helper.log("Service Veranstaltung: Client requested check, if record exists, id=" + request.params.id);

    const veranstaltungDao = new VeranstaltungDao(request.app.locals.dbConnection);
    try {
        var result = veranstaltungDao.exists(request.params.id);
        helper.log("Service Veranstaltung: Check if record exists by id=" + request.params.id + ", result=" + result);
        response.status(200).json(helper.jsonMsgOK({ "id": request.params.id, "existiert": result }));
    } catch (ex) {
        helper.logError("Service Veranstaltung: Error checking if record exists. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post("/veranstaltung", function(request, response) {
    helper.log("Service Veranstaltung: Client requested creation of new record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.preis)) 
        errorMsgs.push("Preis fehlt");
    if (helper.isUndefined(request.body.datum)) 
        errorMsgs.push("Datum fehlt");
    if (helper.isUndefined(request.body.veranstaltungsort)) {
            errorMsgs.push("Veranstaltungsort fehlt");
    } else if (helper.isUndefined(request.body.veranstaltungsort.id)) {
        errorMsgs.push("Veranstaltungsort.id fehlt");
    }
    if (helper.isUndefined(request.body.kuenstler)) {
        errorMsgs.push("kuenstler fehlt");
    } else if (helper.isUndefined(request.body.kuenstler.id)) {
    errorMsgs.push("kuenstler.id fehlt");
    }
    
    if (errorMsgs.length > 0) {
        helper.log("Service Veranstaltung: Creation not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Hinzufügen nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    const veranstaltungDao = new veranstaltungDao(request.app.locals.dbConnection);
    try {
        var result = veranstaltungDao.create(request.body.preis, request.body.datum, request.body.veranstaltungsort.id, request.body.kuenstler.id);
        helper.log("Service Veranstaltung: Record inserted");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Veranstaltung: Error creating new record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.put("/veranstaltung", function(request, response) {
    helper.log("Service Veranstaltung: Client requested update of existing record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push("id fehlt");
    if (helper.isUndefined(request.body.preis)) 
        errorMsgs.push("preis fehlt");
    if (helper.isUndefined(request.body.datum)) 
        errorMsgs.push("datum fehlt");
    if (helper.isUndefined(request.body.veranstaltungsort)) {
        errorMsgs.push("veranstaltungsort fehlt");
    } else if (helper.isUndefined(request.body.veranstaltungsort.id)) {
        errorMsgs.push("veranstaltungsort.id fehlt");
    }
    if (helper.isUndefined(request.body.kuenstler)) {
        errorMsgs.push("kuenstler fehlt");
    } else if (helper.isUndefined(request.body.kuenstler.id)) {
        errorMsgs.push("kuenstler.id fehlt");
    }

    if (errorMsgs.length > 0) {
        helper.log("Service Veranstaltung: Update not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Update nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    const veranstaltungDao = new veranstaltungDao(request.app.locals.dbConnection);
    try {
        var result = veranstaltungDao.update(request.body.id, request.body.preis, request.body.datum, request.body.veranstaltungsort.id, request.body.kuenstler.id);
        helper.log("Service Veranstaltung: Record updated, id=" + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Veranstaltung: Error updating record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete("/veranstaltung/:id", function(request, response) {
    helper.log("Service Veranstaltung: Client requested deletion of record, id=" + request.params.id);

    const veranstaltungDao = new veranstaltungDao(request.app.locals.dbConnection);
    try {
        var obj = veranstaltungDao.loadById(request.params.id);
        veranstaltungDao.delete(request.params.id);
        helper.log("Service Veranstaltung: Deletion of record successfull, id=" + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ "gelöscht": true, "eintrag": obj }));
    } catch (ex) {
        helper.logError("Service Veranstaltung: Error deleting record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;