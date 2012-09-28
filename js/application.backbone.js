/**
 * App View is the skeleton of our code which controlls all the sub views
 * By default the App View events are attached to the body
 * This can be easily changed by overriding the 'el' property of the view.
 */
(function($){
    window.AppView = Backbone.View.extend({

        el : "body"
        /*
         * Created two 'DIV' for holding the important tasks and normal tasks
         * Caching the jQuery objects to the view so that we can use them later.
         */
        ,initialize : function( options ) {
            this.textinput =  $("#taskText");
            this.main = $("#main");
            this.impomain = $("#priority");

            /**
             * Listens to any changes in the global Tasks collection
             * TODO :  make it more modular and remove the dependency from here
             * Namespace the view 
             */

            Tasks.on("add",this.addSingleTask , this);
            Tasks.on("change:important",this.changePosition , this);

            /**
             * Calls the collections Fetch method to load all the tasks
             * finally - render the Main View
             */

            Tasks.fetch();
            this.render();
        }
        ,render : function(){
            this.showAll();
        }
        ,events : {
            "click #addTask" : "addTask"
            ,"keyup #taskText": "keyEnter"
        }
        ,keyEnter: function(e){
            if(e.keyCode === 13){
                this.addTask();
            }
        }
        ,addTask : function(){

            /**
             * Get the value from the text box and creates a task.
             * Do the basic validations before creating the task - which can be done in task level also
             * but i preferred it to be done here first.
             */
            var taskdesc = this.textinput.val();
            this.textinput.removeClass("error");

            if( $.trim( taskdesc ) === "") {
                this.textinput.addClass("error").val("");
                return;
            }
            /**
             * This is the easiest way of creating a new task - as our collection
             * knows the structure of the model.
             */
            Tasks.create({
                text : taskdesc
            });

            this.textinput.val("").focus();

        }
        ,showAll : function(){
            this.clearView();
            Tasks.each( this.addSingleTask ,this);
        }
        ,showCompleted : function(){
            this.clearView();
            _.each(Tasks.completed(), this.addSingleTask ,this );
        }
        ,showImportant : function(){
            this.clearView();
            _.each(Tasks.important(), this.addSingleTask ,this ); 
        }
        ,showPending : function(){
            this.clearView();
            _.each(Tasks.pending(), this.addSingleTask ,this );
        }
        /**
         * Adds a single View - by calling the TaskView 
         * @param  task [ raw JSON representation of the data]
         */
        ,addSingleTask : function( task ) {
            var tview = new TaskView({
                model: task
            });
            task.view = tview;
            if(task.get("important")){
                tview.$el.appendTo( this.impomain ).fadeIn();
            }else{
                tview.$el.appendTo( this.main  ).fadeIn();
            }
        }
        /**
         * Check for the taks type , if its important then push it to the important DIV , else to the normal
         * @param  {Task} task [currespoing task object]
         * @return void
         */
        ,changePosition : function( task ){
            ( task.get("important") ) ? this.impomain.append( task.view.el ) : this.main.append( task.view.el );
        }
        /**
         * Clear the view only ( no changes in the model )
         * @return void
         */
        ,clearView : function(){
            this.main.html("");
            this.impomain.html("");
        } 

    });

}(jQuery));

/**
 * Different routers for showing different views in the page
 * Yet to be impletemented completely.
 * But the method names describes them very well, i guess.
 */

var AppRouter = Backbone.Router.extend({
    routes: {
        "" :"showAll"
        ,"completed": "showCompleted"
        ,"important":"showImportant"
        ,"pending" : "showPending"
    }
    ,initialize : function(op){
        this.view = op.view;
    }
    ,showCompleted : function(){
        this.view.showCompleted();
    }
    ,showImportant : function(){
        this.view.showImportant()
    }
    ,showPending : function(){
        this.view.showPending();
    }
    ,showAll : function(){
        this.view.showAll();
    }
});


/**
 * The final code : 
 * Initialise all the views and router when the DOM is ready.
 * TODO :  the routers are functional now , add the curresponding buttons to use them.
 */

jQuery(function(){
    window.myTodoApp = new AppView;
    window.myTodoRouter = new AppRouter({view : myTodoApp});
    Backbone.history.start();
});
