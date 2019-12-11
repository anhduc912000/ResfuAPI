'use strict';

module.exports = function(app){
    let todoList = require('../controllers/todoList.controller');

    // todoList Routes
    app.route('/tasks')
        .get(todoList.list_all_tasks)
        .post(todoList.create_a_task);
    
    app.route('/tasks/:taskId')
        .get(todoList.read_a_task)
        .put(todoList.update_a_task)
        .delete(todoList.delete_a_task)
    //search
    app.route('/search/:searchText').get(todoList.search_a_task);
    //paginate
    app.route('/tasks-paginate/:qtt/:pageIdx').get(todoList.get_task)
    //search pagination
    app.route('/search-paginate/:textSearch/:qtt/:pageIdx').get(todoList.search_pagination)
    
};