const helper = require("../helper.js");
const NewsDao = require("../dao/newsDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.get("/news/gib/:id", function(request, response) {
    helper.log("Service News: Client requested one record, id=" + request.params.id);

    const newsDao = new NewsDao(request.app.locals.dbConnection);
    try {
        var result = newsDao.loadById(request.params.id);
        helper.log("Service News: Record loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service News: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/news/alle", function(request, response) {
    helper.log("Service News: Client requested all records");

    const newsDao = new NewsDao(request.app.locals.dbConnection);
    try {
        var result = newsDao.loadAll();
        helper.log("Service News: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service News: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/news/existiert/:id", function(request, response) {
    helper.log("Service News: Client requested check, if record exists, id=" + request.params.id);

    const newsDao = new NewsDao(request.app.locals.dbConnection);
    try {
        var result = newsDao.exists(request.params.id);
        helper.log("Service News: Check if record exists by id=" + request.params.id + ", result=" + result);
        response.status(200).json(helper.jsonMsgOK({ "id": request.params.id, "existiert": result }));
    } catch (ex) {
        helper.logError("Service News: Error checking if record exists. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post("/news", function(request, response) {
    helper.log("Service News: Client requested creation of new record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.zeitpunkt)) 
        errorMsgs.push("zeitpunkt fehlt");
    if (helper.isUndefined(request.body.beschreibung)) 
        errorMsgs.push("beschreibung fehlt");
    
    
    if (errorMsgs.length > 0) {
        helper.log("Service News: Creation not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Hinzufügen nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    const newsDao = new NewsDao(request.app.locals.dbConnection);
    try {
        var result = newsDao.create(request.body.zeitpunkt, request.body.beschreibung);
        helper.log("Service News: Record inserted");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service News: Error creating new record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.put("/news", function(request, response) {
    helper.log("Service News: Client requested update of existing record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push("id fehl");
    if (helper.isUndefined(request.body.zeitpunkt)) 
        errorMsgs.push("zeitpunkt fehl");
    if (helper.isUndefined(request.body.beschreibung)) 
        errorMsgs.push("beschreibung fehlt");
   
    if (errorMsgs.length > 0) {
        helper.log("Service News: Update not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Update nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    const newsDao = new NewsDao(request.app.locals.dbConnection);
    try {
        var result = newsDao.update(request.body.zeitpunkt, request.body.beschreibung);
        helper.log("Service News: Record updated, id=" + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service News: Error updating record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete("/news/:id", function(request, response) {
    helper.log("Service News: Client requested deletion of record, id=" + request.params.id);

    const newsDao = new NewsDao(request.app.locals.dbConnection);
    try {
        var obj = newsDao.loadById(request.params.id);
        newsDao.delete(request.params.id);
        helper.log("Service News: Deletion of record successfull, id=" + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ "gelöscht": true, "eintrag": obj }));
    } catch (ex) {
        helper.logError("Service News: Error deleting record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;