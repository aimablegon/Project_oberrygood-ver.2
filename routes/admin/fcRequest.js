var express = require('express');
var exRouter = express.Router();
var router = express.Router();  

var async = require('async');
var models = require('service/models');

exRouter.use("/admin/api", router);

router.all("/fcRequest", function(req, res, next){


	var page = req.body.page ? parseInt(req.body.page) : 1;
	var pageSize = req.body.pageSize ? parseInt(req.body.pageSize) : 10;

	async.series([
	    function(callback) {

			var where = [];
			if(req.body.searchText) {
				where = ['name like ?','%'+req.body.searchText+'%'];
			}
			models.FcRequest.count({
				where : where
			})
	    	.then(function (result) {
	    		callback(null, result);
	    	})
	    	.catch(function (err) {
	    		process.nextTick(function () {throw err});
	    	});
	    },
	    function(callback) {


			var where = [];
			if(req.body.searchText) {
				where = ['name like ?','%'+req.body.searchText+'%'];
			}

		    models.FcRequest.findAll({
		    	where : where ,
		    	order : "requestId Desc",
		    	offset : (page-1)*pageSize,
		    	limit : pageSize
			})
	    	.then(function (result) {
	    		callback(null, result);
	    	})
	    	.catch(function (err) {
	    		process.nextTick(function () {throw err});
	    	});


	    }
	], function (err, result) {
		if(err) next(err);
		res.send({
			totalCount : result[0],
			list : result[1],
			currentPage : page
		});
	});


});


router.all("/fcRequest/:requestId", function(req, res, next){

    models.FcRequest.find({
    	where : {requestId : req.params.requestId}
    })
	.then(function (result) {
		res.send(result);
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});


});

router.all("/fcRequest/:requestId/update", function(req, res, next){
	
	var data = req.body;
	if(data.replyContent && data.replyContent != '') {
		data.replyDate = new Date();
		data.replyYn = 'Y';
	}

    models.FcRequest.update(data, {
    	where : {requestId : req.params.requestId}
    })
	.then(function (result) {
		res.end();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});



});


router.all("/fcRequest/:requestId/delete", function(req, res, next){
    models.FcRequest.destory({
    	where : {requestId : req.params.requestId}
    })
	.then(function (result) {
		res.end();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});

router.use(function (err, req, res, next) {
	console.log(err);
	res.status(500).send("error");
});

module.exports = exRouter;