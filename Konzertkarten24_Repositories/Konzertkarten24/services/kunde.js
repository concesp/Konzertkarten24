const helper = require("../helper.js");
const KundeDao = require("../dao/kundeDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.get("/kunde/gib/:id", function(request, response) {
    helper.log("Service Kunde: Client requested one record, id=" + request.params.id);

    const kundeDao = new KundeDao(request.app.locals.dbConnection);
    try {
        var result = kundeDao.loadById(request.params.id);
        helper.log("Service Kunde: Record loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Kunde: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/kunde/alle", function(request, response) {
    helper.log("Service Kunde: Client requested all records");

    const kundeDao = new KundeDao(request.app.locals.dbConnection);
    try {
        var result = kundeDao.loadAll();
        helper.log("Service Kunde: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Kunde: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/kunde/existiert/:id", function(request, response) {
    helper.log("Service Kunde: Client requested check, if record exists, id=" + request.params.id);

    const kundeDao = new KundeDao(request.app.locals.dbConnection);
    try {
        var result = kundeDao.exists(request.params.id);
        helper.log("Service Kunde: Check if record exists by id=" + request.params.id + ", result=" + result);
        response.status(200).json(helper.jsonMsgOK({ "id": request.params.id, "existiert": result }));
    } catch (ex) {
        helper.logError("Service Kunde: Error checking if record exists. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post("/kunde", function(request, response) {
    helper.log("Service Kunde: Client requested creation of new record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.anrede)) 
        errorMsgs.push("andrede fehlt");
    if (helper.isUndefined(request.body.vorname)) 
        errorMsgs.push("vorname fehlt");
    if (helper.isUndefined(request.body.nachname)) 
        errorMsgs.push("vorname fehlt");
    if (helper.isUndefined(request.body.adresse.id)) 
        errorMsgs.push("adresse.id fehlt");
    if (helper.isUndefined(request.body.telefonnummer)) 
        errorMsgs.push("telefonnummer fehlt");
    if (helper.isUndefined(request.body.email))
        errorMsgs.push("email fehlt");
    
    
    if (errorMsgs.length > 0) {
        helper.log("Service Kunde: Creation not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Hinzufügen nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    const kundeDao = new KundeDao(request.app.locals.dbConnection);
    try {
        var result = kundeDao.create(request.body.anrede, request.body.vorname, request.body.nachname, request.body.adresse.id, request.body.telefonnummer, request.body.email);
        helper.log("Service Kunde: Record inserted");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Kunde: Error creating new record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.put("/kunde", function(request, response) {
    helper.log("Service Kunde: Client requested update of existing record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push("id fehlt");
    if (helper.isUndefined(request.body.anrede)) 
        errorMsgs.push("anrede fehlt");
    if (helper.isUndefined(request.body.vorname)) 
        errorMsgs.push("vorname fehlt");
    if (helper.isUndefined(request.body.nachname)) 
        errorMsgs.push("nachname fehlt");
    if (helper.isUndefined(request.body.adresse.id)) 
        errorMsgs.push("adresse fehlt");
    if (helper.isUndefined(request.body.telefonnummer)) 
        errorMsgs.push("telefonnummer fehlt");
    if (helper.isUndefined(request.body.email)) 
        errorMsgs.push("email fehlt");
        
    if (errorMsgs.length > 0) {
        helper.log("Service Kunde: Update not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Update nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    const kundeDao = new KundeDao(request.app.locals.dbConnection);
    try {
        var result = kundeDao.update(request.body.id, request.body.anrede, request.body.vorname, request.body.nachname, request.body.adresse.id, request.body.telefonnummer, request.body.email);
        helper.log("Service Kunde: Record updated, id=" + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Kunde: Error updating record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete("/kunde/:id", function(request, response) {
    helper.log("Service Kunde: Client requested deletion of record, id=" + request.params.id);

    const kundeDao = new KundeDao(request.app.locals.dbConnection);
    try {
        var obj = kundeDao.loadById(request.params.id);
        kundeDao.delete(request.params.id);
        helper.log("Service Kunde: Deletion of record successfull, id=" + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ "gelöscht": true, "eintrag": obj }));
    } catch (ex) {
        helper.logError("Service Kunde: Error deleting record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;