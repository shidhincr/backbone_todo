/**
 * TaskList is a Backbone collection for arraging the tasks
 * This uses the Backbone's localstorage adaptor to store all the task informations 
 * inside the browser itself.
 * So we don't need  a server to save the data.
 * model : Task
 */
var TaskList = Backbone.Collection.extend({
    
    /**
     * Tells the Collection about the model's structure
     * Backbone makes this as simple as possible
     */
    
    model : Task

    /**
     * Creates the new Store 
     * requies : Backbone.localStorage.js
     */

    ,localStorage: new Store("Tasks-bb")
    
    ,important : function(){
        return this.filter(function( task ){ return task.get('important'); });
    }

    ,completed : function(){
        return this.filter(function( task ){ return task.get('completed'); });
    }
    ,pending : function(){
        return this.without.apply( this , this.completed() );
    }
});

/**
 * Finally creates a new collection from our TaskList Collection
 */

window.Tasks = new TaskList;