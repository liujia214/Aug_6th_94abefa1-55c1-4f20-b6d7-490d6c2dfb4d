var express = require('express');
var router = express.Router();
//var imap = require('./Imap');
var uuid = require('uuid');


//console.log(imap);
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/imap',function(req,res){
  res.render('index',{title:'HighChart'});
});

router.post('/imap',function(req,res) {
  var id = uuid.v4();
  imap.obj[id] = {status:'processing'};
  res.status(202).json({message:'starting with the operation...',url:'/update/'+id});
  imap.getConnect(req.body.user, req.body.password,id);

});

router.get('/update/:id',function(req,res){
  console.log(req.params.id);
  console.log(imap.obj[req.params.id]);
  res.status(200).json(imap.obj[req.params.id]);
});

module.exports = router;
