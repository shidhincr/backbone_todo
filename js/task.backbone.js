/**
 * Task model is the default model by extending the backbone model
 * by default we neeed to have text , completed and important properties for our Task model.
 */
(function($){

    window.Task = Backbone.Model.extend({
        defaults : {
             text:'Blank task !'
            ,completed : false
            ,important: false
        }
     });
    /*
     * Create and make the TaskView object as global.
     * The TaskView is responsible for rendering a single task model. All the buttons
     * for marking important/completed/delete will be part of this view.
     * TODO : editing should be done as a different view. As of now it's implemented in TaskView only.
     * TODO : put this under a namespace
     */
    window.TaskView = Backbone.View.extend({

        /*
         * We need a div element to be returned with className "task".
         * By default Backbone will return a 'div' tag unless the tagName is provided. 
         */
        className: "task"

        /*
         * This method will get called whenever the view is instantiated.
         * cache the template to a property , so that we can  use it later.
         * attach the event handlers for the models.
         * finally --  we need to call the render method explicitly 
         */
        ,initialize : function(){
            this.template = _.template( $("#taskTemplate").html() );
            this.model.on("change" , this.render , this );
            this.model.on("destroy" , this.remove , this );
            this.render();
        }
        /*
         * Backbone's beautiful way of attaching the events to the dom.
         * Backbone uses its underlying framework's delegate method to attach the events. The 
         * framework can be anything like jQuery/Zepto or Underscore itself.
         * Good thing is that -- events will be attached if there is a selector provided. Else the events will be
         * attached to the parent DIV which Backbone return when the view is created.
         */
        ,events : {
             "click .delete" : "deleteTask"
            ,"click .imp" : "toggleImportant"
            ,"click .mark" : "toggleDone"
            ,"blur .text-edit" : "updateTask"
            ,"keyup .text-edit" : "onkeyEnter"
            ,"dblclick" : "editTask"
        }

        ,render : function(){
            this.$el.fadeOut("fast").html( this.template(this.model.toJSON() )).fadeIn();
            return this;
        }
        /*
         * convenient function to remove the element from the DOM.
         * Should not call directly.
         */
        ,remove : function(){
            this.$el.remove();
        }
        /*
         * TODO :  This should go to a separate view
         * something like "EditTaskView" ,  which should get called 
         * when the start editing the task details
         */
        ,editTask : function( e ){
            this.$el.find(".text.open").hide();
            this.$el.find(".text-edit").show().focus();
            e.preventDefault();
        }
        /*
         * Basic keyboard support 
         * When ENTER key is pressed when editing  the task, it should get updated.
         */
        ,onkeyEnter :function( e ){
            if(e.keyCode === 13){
                this.updateTask();
            }
        }
        /*
         * validate and update the task
         * Backbone  provides an excellent way of validating the model data.
         * 
         */
        ,updateTask: function(){
            var newdesc = this.$el.find(".text-edit").val();
            if( $.trim( newdesc ) !== "" ){
                this.model.save({ text: newdesc });
            }
            this.render();
        }

        ,deleteTask : function(e){
            this.model.destroy();
            e.preventDefault();
        }

        ,toggleImportant : function(e){
            var imp = this.model.get("important");
            this.model.save("important", !imp);
            e.preventDefault();
        }

        ,toggleDone : function(e){
            var done = this.model.get("completed");
            this.model.save("completed", !done);
            e.preventDefault();
        }
    });


}(jQuery));
