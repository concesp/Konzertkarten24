const helper = require("../helper.js");
const VeranstaltungsortDao = require("../dao/veranstaltungsortDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.get("/veranstaltungsort/gib/:id", function(request, response) {
    helper.log("Service Veranstaltungsort: Client requested one record, id=" + request.params.id);

    const veranstaltungsortDao = new VeranstaltungsortDao(request.app.locals.dbConnection);
    try {
        var result = veranstaltungsortDao.loadById(request.params.id);
        helper.log("Service Veranstaltungsort: Record loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Veranstaltungsort: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/veranstaltungsort/alle", function(request, response) {
    helper.log("Service Veranstaltungsort: Client requested all records");

    const veranstaltungsortDao = new VeranstaltungsortDao(request.app.locals.dbConnection);
    try {
        var result = veranstaltungsortDao.loadAll();
        helper.log("Service Veranstaltungsort: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Veranstaltungsort: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/veranstaltungsort/existiert/:id", function(request, response) {
    helper.log("Service Veranstaltungsort: Client requested check, if record exists, id=" + request.params.id);

    const veranstaltungsortDao = new VeranstaltungsortDao(request.app.locals.dbConnection);
    try {
        var result = veranstaltungsortDao.exists(request.params.id);
        helper.log("Service Veranstaltungsort: Check if record exists by id=" + request.params.id + ", result=" + result);
        response.status(200).json(helper.jsonMsgOK({ "id": request.params.id, "existiert": result }));
    } catch (ex) {
        helper.logError("Service Veranstaltungsort: Error checking if record exists. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post("/veranstaltungsort", function(request, response) {
    helper.log("Service Veranstaltungsort: Client requested creation of new record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.zusatztext)) 
        errorMsgs.push("Zusatztext fehlt");
    if (helper.isUndefined(request.body.plaetze)) 
        errorMsgs.push("Plaetze fehlt");
    if (helper.isUndefined(request.body.adresse)) {
            errorMsgs.push("Adresse fehlt");
    } else if (helper.isUndefined(request.body.adresse.id)) {
        errorMsgs.push("Adresse.id fehlt");
    }
    
    if (errorMsgs.length > 0) {
        helper.log("Service Veranstaltungsort: Creation not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Hinzufügen nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    const veranstaltungsortDao = new VeranstaltungsortDao(request.app.locals.dbConnection);
    try {
        var result = veranstaltungsortDao.create(request.body.zusatztext, request.body.plaetze, request.body.adresse.id);
        helper.log("Service Veranstaltungsort Record inserted");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Veranstaltungsort: Error creating new record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.put("/veranstaltungsort", function(request, response) {
    helper.log("Service Veranstaltungsort: Client requested update of existing record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push("id fehl");
    if (helper.isUndefined(request.body.zusatztext)) 
        errorMsgs.push("zusatztext fehl");
    if (helper.isUndefined(request.body.plaetze)) 
        errorMsgs.push("plaetze fehl");
    if (helper.isUndefined(request.body.adresse)) {
            errorMsgs.push("Adresse fehl");
    } else if (helper.isUndefined(request.body.adresse.id)) {
        errorMsgs.push("adresse.id fehl");
    }

    if (errorMsgs.length > 0) {
        helper.log("Service Veranstaltungsort: Update not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Update nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    const veranstaltungsortDao = new VeranstaltungsortDao(request.app.locals.dbConnection);
    try {
        var result = veranstaltungsortDao.update(request.body.id, request.body.zusatztext, request.body.plaetze, request.body.adresse.id);
        helper.log("Service Veranstaltungsort: Record updated, id=" + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Veranstaltungsort: Error updating record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete("/veranstaltungsort/:id", function(request, response) {
    helper.log("Service Veranstaltungsort: Client requested deletion of record, id=" + request.params.id);

    const veranstaltungsortDao = new VeranstaltungsortDao(request.app.locals.dbConnection);
    try {
        var obj = veranstaltungsortDao.loadById(request.params.id);
        veranstaltungsortDao.delete(request.params.id);
        helper.log("Service Veranstaltungsort: Deletion of record successfull, id=" + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ "gelöscht": true, "eintrag": obj }));
    } catch (ex) {
        helper.logError("Service Veranstaltungsort: Error deleting record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;