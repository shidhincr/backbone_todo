(function($){
    window.AppView = Backbone.View.extend({

        el : "body"

        ,initialize : function( options ) {
            this.textinput =  $("#taskText");
            this.main = $("#main");
            this.impomain = $("#priority");

            Tasks.on("add",this.addSingleTask , this);
            Tasks.on("change:important",this.changePosition , this);


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

            var taskdesc = this.textinput.val();
            this.textinput.removeClass("error");

            if( $.trim( taskdesc ) === "") {
                this.textinput.addClass("error").val("");
                return;
            }

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
            _.each(Tasks.completed(), this.addSingleTask ,this )
        }
        ,showImportant : function(){
            this.clearView();
            _.each(Tasks.important(), this.addSingleTask ,this )   
        }
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
        ,changePosition : function( task ){
            ( task.get("important") ) ? this.impomain.append( task.view.el ) : this.main.append( task.view.el );
        }
        ,clearView : function(){
            this.main.html("");
            this.impomain.html("");
        } 

    });

}(jQuery));

var AppRouter = Backbone.Router.extend({
    routes: {
        "" :"showAll"
        ,"completed": "showCompleted"
        ,"important":"showImportant"
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
    ,showAll : function(){
        this.view.showAll();
    }
});

jQuery(function(){
    window.myTodoApp = new AppView;
    window.myTodoRouter = new AppRouter({view : myTodoApp});
    Backbone.history.start();
});
