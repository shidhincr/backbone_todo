(function($){

    window.Task = Backbone.Model.extend({
        defaults : {
             text:'Blank task !'
            ,completed : false
            ,important: false
        }
     });

    window.TaskView = Backbone.View.extend({

        className: "task"

        ,initialize : function(){
            this.template = _.template( $("#taskTemplate").html() );
            this.model.on("change" , this.render , this );
            this.model.on("destroy" , this.remove , this );
            this.render();
        }

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

        ,remove : function(){
            this.$el.remove();
        }

        ,editTask : function(){
            this.$el.find(".text.open").hide();
            this.$el.find(".text-edit").show();
        }

        ,onkeyEnter :function( e ){
            if(e.keyCode === 13){
                this.updateTask();
            }
        }

        ,updateTask: function(){
            var newdesc = this.$el.find(".text-edit").val();
            if( newdesc ){
                this.model.save({ text: newdesc });
            }
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
