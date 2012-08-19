var TaskList = Backbone.Collection.extend({
    
    model : Task

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

window.Tasks = new TaskList;