const helper = require("../helper.js");
const BilderDao = require("../dao/bilderDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.get("/bilder/gib/:id", function(request, response) {
    helper.log("Service Bilder: Client requested one record, id=" + request.params.id);

    const bilderDao = new BilderDao(request.app.locals.dbConnection);
    try {
        var result = bilderDao.loadById(request.params.id);
        helper.log("Service Bilder: Record loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Bilder: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/bilder/alle", function(request, response) {
    helper.log("Service Bilder: Client requested all records");

    const bilderDao = new BilderDao(request.app.locals.dbConnection);
    try {
        var result = bilderDao.loadAll();
        helper.log("Service Bilder: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Bilder: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/bilder/existiert/:id", function(request, response) {
    helper.log("Service Bilder: Client requested check, if record exists, id=" + request.params.id);

    const bilderDao = new BilderDao(request.app.locals.dbConnection);
    try {
        var result = bilderDao.exists(request.params.id);
        helper.log("Service Bilder: Check if record exists by id=" + request.params.id + ", result=" + result);
        response.status(200).json(helper.jsonMsgOK({ "id": request.params.id, "existiert": result }));
    } catch (ex) {
        helper.logError("Service Bilder: Error checking if record exists. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post("/bilder", function(request, response) {
    helper.log("Service Bilder: Client requested creation of new record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.werbebannerPfad)) 
        request.body.werbebannerPfad = "";
    if (helper.isUndefined(request.body.kartePfad)) 
        errorMsgs.push("kartepfad fehlt");
    if (helper.isUndefined(request.body.kuenstlerPfad)) 
        errorMsgs.push("kuenstlerpfad fehlt");
    if (helper.isUndefined(request.body.reviewPfad)) 
        request.body.reviewPfad = "";
    
    if (errorMsgs.length > 0) {
        helper.log("Service Bilder: Creation not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Hinzufügen nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    const bilderDao = new BilderDao(request.app.locals.dbConnection);
    try {
        var result = bilderDao.create(request.body.werbebannerPfad, request.body.kartePfad, request.body.kuenstlerPfad, request.body.reviewPfad);
        helper.log("Service Bilder: Record inserted");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Bilder: Error creating new record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.put("/bilder", function(request, response) {
    helper.log("Service Bilder: Client requested update of existing record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push("id fehlt");
    if (helper.isUndefined(request.body.werbebannerPfad)) 
        request.body.werbebannerPfad = "";
    if (helper.isUndefined(request.body.kartePfad)) 
        errorMsgs.push("kartepfad fehlt");
    if (helper.isUndefined(request.body.kuenstlerPfad)) 
        errorMsgs.push("kuenstlerpfad fehlt");
    if (helper.isUndefined(request.body.reviewPfad)) 
        request.body.reviewPfad = "";

    if (errorMsgs.length > 0) {
        helper.log("Service Bilder: Update not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Update nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    const bilderDao = new BilderDao(request.app.locals.dbConnection);
    try {
        var result = bilderDao.update(request.body.id, request.body.werbebannerPfad, request.body.kartePfad, request.body.kuenstlerPfad, request.body.reviewPfad);
        helper.log("Service Bilder: Record updated, id=" + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Bilder: Error updating record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete("/bilder/:id", function(request, response) {
    helper.log("Service Bilder: Client requested deletion of record, id=" + request.params.id);

    const bilderDao = new BilderDao(request.app.locals.dbConnection);
    try {
        var obj = bilderDao.loadById(request.params.id);
        bilderDao.delete(request.params.id);
        helper.log("Service Bilder: Deletion of record successfull, id=" + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ "gelöscht": true, "eintrag": obj }));
    } catch (ex) {
        helper.logError("Service Bilder: Error deleting record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;