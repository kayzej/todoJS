(function(){
var
host = "http://192.168.1.8:3030",
ToDo = {

  listElement: {
    textarea: "<textarea type='text' class='form-control' placeholder='Description' rows='4'></textarea>",
    label: "<span class='labelholder pull-left'><div class='customtext labeldisp'>Task</div><input type='hidden' class='labeledit' onfocus='this.value = this.value;'></span>",
    status: "<span class='labelholder pull-right'><div class='customtext labeldisp'>Status: Not Started</div><input type='hidden' class='labeledit' onfocus='this.value = this.value;'></span>",
    complete: "<button type='button' class='btn btn btn-success'><span class='glyphicon glyphicon-ok' aria-hidden='true'></span></button>",
    delete: "<button type='button' class='btn btn-danger'><span class='glyphicon glyphicon-minus' aria-hidden='true'></span></button>",
    btngroup: "<div class='input-group-addon btn-group-vertical' role='group'>"
  },

  init: function() {
    console.log('Initializing Application..');
    note = "<div class='custom-col col-xs-12'>" + this.listElement.label + this.listElement.status + "</div><div class='input-group'>" + this.listElement.textarea  + this.listElement.btngroup + this.listElement.complete + this.listElement.delete + "</div>";
    this.loadData();
    this.bindUIActions();
  },

  loadData: function(){
    console.log("Loading Data");

    $('#NotesContainer').empty();
    
    $.get( host + "/init", function( data ) {  
      data.map(function(entry) {
        $('#NotesContainer').append('<h1>' + entry.task + " - " + entry.description + '</h1>' );
      });
    });
  },

  bindUIActions: function() {
    console.log("binding ui actions");

    var self = this;

    $('#deleteall').click(function(){
      $.get( host + '/deleteall', function(){
         self.loadData();
      });
    });

    $('#form').submit(function(event){
      event.preventDefault();
      newMessage = {
        task: $('#label1').text(),
        description: $('#description1').val(),
        //status: $('#status').val()
      };

      console.log(newMessage);

      $.ajax({
        type: 'POST',
        url: host + '/newmessage',
        data: newMessage,
        success: function(msg){
          console.log('Post Success');
          self.loadData();
        },
        error: function(){
          alert('Post failed');
        }
      });
    });

    $(document).on('click', 'textarea', function(){
      $(this).css("background-color", "white");
    })
    .on('focusout', 'textarea', function(){
      $(this).css("background-color", "transparent");
    })
    .on('keypress', 'textarea', function(e){
      if(e.which == 13){
        e.preventDefault();
        $(this).focusout();
        $(this).parent().find('submit-button').focus();
        $('#submit').focus();
      }
    });
    
    $(document).on('click', '.labelholder', function(){
      var labeledit = $(this).find('.labeledit');
      var labeldisp = $(this).find('.labeldisp');
      
      labeledit.attr('type', 'text');
      labeledit.attr('value', labeldisp.text());
      labeledit.focus();

      labeldisp.hide();
    })
    .on('focusout', '.labelholder', function(){
      var labeledit = $(this).find('.labeledit');
      var labeldisp = $(this).find('.labeldisp');
      
      labeledit.attr('type', 'hidden');

      labeldisp.text(labeledit.val());
      labeldisp.show();
    })
    .on('keypress', '.labelholder', function(e){
      if(e.which == 13){
        e.preventDefault();
        $(this).focusout();
      }
    });

    $("button.dropdown-toggle").click(function(ev) {
        $("button.dropdown-toggle").dropdown("toggle");
        //console.log(ev);
        return false;
    });

    $("ul.dropdown-menu a").click(function(ev) {
        $("button.dropdown-toggle").dropdown("toggle");
        console.log(ev);
        return false;
    });

    $('.newnotetop').click(function(){
      $('#noteslist').prepend(note);
      //self.bindUIActions();
    });

    $('.newnotebot').click(function(){
      $('#noteslist').append(note);
      //self.bindUIActions();
    });
  }
};

$(document).ready(function() {
    ToDo.init();
});
}());