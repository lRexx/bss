$(document).ready(function() {

  $('body').tooltip({ selector: '[data-toggle="tooltip"]', trigger : 'hover' });

  //$('body').popover({ selector: '[data-toggle="popover"]', trigger : 'hover' });

  $('body').popover({ 
  			selector: '.qrcode', 
  			html: true,
            trigger: 'hover',
            animation: true,
            placement: 'top',
            content: function(){return '<img src="'+$(this).data('img') + '" />';}
          });	
});