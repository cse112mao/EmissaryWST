$(document).ready(function($) {

  $('.my-form:last .add-box').click(function() {
    var label;
    var n = $('.text-box').length;
    // Create html text short answer text question
    var html = `
    <p class="text-box">
    <input type="text" name="boxes[]" value="" placeholder="Enter Question" id="box" required/>
    <button type="button" class="btn btn-danger remove-box">Remove</button>
    <br> 
    <label id = "added_label" for="optional_` + n + `"> 
    <span class="box-number">Short Answer Text</span>
    </label>
    </p>
    `
    var box_html = $(html);
    box_html.hide();  // Hide it for now until so effect can be used
    $('.my-form .addField:last').before(box_html);  // Add the box to addField in my-form
    box_html.fadeIn('slow');  // Fade in effect
    return false;
  });

  var curUser = JSON.parse(localStorage.getItem('currentUser'));
  $('#user-name').text(curUser.first_name + ' ' + curUser.last_name);

    var companyData = JSON.parse(localStorage.getItem("currentCompany"));
    companyData.company_id = companyData._id;

    //Custom Form Template
    var extraFields = $('#extra-fields-template').html();
    var extraFieldsTemplate = Handlebars.compile(extraFields);
    console.log("compiled handlebars");
    $.ajax({
      dataType: 'json',
      type: 'GET',
      url: '/api/form/template/company/' + companyData.company_id,
      success: function(response) {
    console.log("successful get template");
        var compiledHtml = extraFieldsTemplate(response.template);
        $('#extra-fields').html(compiledHtml);
        $('#colorPicker').val(response.color);
        document.getElementById('colorPicker').style.backgroundColor = '#' + response.color;
      }
    });
});

$('.my-form').on('click', '.remove-box', function() {
  $(this).parent().css('background-color', '#FF6C6C');
  $(this).parent().fadeOut("slow", function() {
    $(this).remove();
    $('.box-number').each(function(index) {
      $("#box2").attr("id", "box1");
      $("#added_label").attr("for", "optional_1");
    });
  });
  return false;
});



$('.my-form').on('click', '.save-form', function() {
  var companyData = JSON.parse(localStorage.getItem("currentCompany"));
  var arrayOfForms = document.getElementsByClassName("text-box");  
  var objToPost = {
    _id: companyData._id,
    _admin_id: companyData._id,
    template: [],
    color: document.getElementById('colorPicker').value
  }
  for(var i = 3; i<arrayOfForms.length; i++){
    var stringInTextBox = arrayOfForms[i].children[0].value;
    if(stringInTextBox == ""){
      window.alert("enter value for every field!");
      return;
    }

    objToPost.template.push({
      type: String,
      value: stringInTextBox
    });
  }
  $.ajax({
    dataType: 'json',
    type: 'POST',
    data: objToPost,
    url: '/api/form/template/',
    success: function(response) {
      console.log("submitted form!");
    }
  });

});
