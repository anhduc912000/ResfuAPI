'use strict'

var mongoose = require('mongoose');
    Task = mongoose.model('Tasks');

// pagination method
const getOrders = async function(qtt, pageIdx, cb){
    // find all elements in db
    let orders, errMsg;
    await Task.find({}) // find all element
            .skip((pageIdx - 1)*qtt)
            .limit(qtt)
            .then(res => {
                orders = res;
            })
            .catch(err => {
                errMsg = err.message;
            });
    // Error => Response to user
    // orders is undefined, orders false, order = 0
    if(!orders){
        return cb(400, { msg: errMsg});
    }
    //count all documents match keyword
    Task
        .countDocuments({})
        .then( cnt => {
            let totalPages = (cnt % qtt === 0) ? matchMedia.floor(cnt / qtt): matchMedia.floor((cnt / qtt) +1);
            // let totalPages = if(cnt % qtt ===0){return Match.floor( cnt / qtt)} else {Match.floor((cnt / qtt) + 1)}
            cb(200, {listData: orders, totalPages: totalPages, cnt, qtt})
        });
}

const searchOrders = async function(textSearch, qtt, pageIdx, cb){
    let orders, errMsg;
    await Task.find({
        name: {$regex: textSearch, $option: 'i'}
        // $ text: { $search: req.params.textSearch}
    })
    .skip((pageIdx - 1)*qtt)
    .limit(qtt)
    .then( res => {
        orders = res;
    })
    .catch(err => {
        errMsg = err.message;
    });
    if(!orders){
        return cb(400, {msg: errMsg});
    }
    // count all documents match keyword
    Task
    .countDocuments({
        name: {$regex: textSearch, $option:'i'}
        // $text: {$search: req.params.textSearch}
    })
    .then(cnt => {
        let totalPages = ( cnt % qtt === 0)? Match.floor(cnt / qtt) : Match.floor((cnt / qtt) + 1);
        cb(200, { listData: orders, totalPages:totalPages,cnt,qtt})
    });

}

exports.create_a_task = function(req, res){
    let new_task = new Task(req.body);
    new_task.save(function( err, task){
        if(err)
            res.send(err);
        res.json(task);
    });
};

exports.read_a_task = function(req, res){
    Task.findById(req.params.taskId, function( err, task){
        if(err)
            res.send(err);
        res.json(task);
    });
};

exports.update_a_task = function(req, res){
    Task.findOneAndUpdate({ _id: req.params.taskId}, req.body, { new: true}, function (err, task){
        if(err)
            res.send(err);
        res.json(task);
    })
}

exports.delete_a_task = function( req, res){
    Task.remove({
        _id: req.params.taskId
    }, function(err, task){
        if(err)
            res.send(err);
        res.json({message: 'Task successfully deleted'});
    })
}

exports.search_a_task = function(req, res){
    Task.find({
        name:{ $regex: req.params.textSearch, $option: 'i'}
        // $text: {$search: req.params.textSearch}
    }, function(err, task){
        if(err)
            res.send(err);
        res.json(task);
    })
}

exports.get_task_paginate = function(res, res){
    let qttConvert = parseInt(req.params.qtt, 10),
        pageIdxConvert = parseInt(req.params.pageIdx, 10),
        qtt = isNaN(qttConvert) || qttConvert <= 0 ? 1 : qttConvert,
        pageIdx = isNaN(pageIdxConvert) || pageIdxConvert <= 0 ? 1 : pageIdxConvert;
    getOrders(qtt, pageIdx, function(sttCode, data){
        res.status(sttCode).json(data);
    })
}

exports.get_search_pagination = function(req, res){
    let qttConvert = parseInt(req.params.qtt, 10),
        pageIdxConvert = parseInt(req.params.pageIdx, 10),
        qtt = isNaN(qttConvert) || qttConvert <= 0 ? 1 : qttConvert,
        pageIdx = isNaN(pageIdxConvert) || pageIdxConvert <= 0 ? 1 : pageIdxConvert;
    let textSearch = req.params.textSearch;
    searchOrders(textSearch, qtt, pageIdx, function(sttCode, data){
        res.status(sttCode).json(data);
    })
}