if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
    window.mobile = true;
} else {
    window.mobile = false;
}

$(document).ready(function() {

  // Replace SVG for PNG
  if(!Modernizr.svg){
    $('img[src$=".svg"]').each(function(index,element) {
      element.src = element.src.replace('.svg','.png');
    });
  }

  // Open Edit profile
  $('.mobile-menu').on('click touchend', function(event){
    $('.header-main--nav').toggleClass('mobile--is-open');
    $('.mobile-menu').toggleClass('mobile--is-open');
    correctMenu();
    event.preventDefault();
  });
  
  // Open Edit profile
  $('.profile--do-edit, .profile--do-close').on('click touchend', function(event){
    $('.header-main').toggleClass('profile--is-edit');

    event.preventDefault();
  });

  // Open Filters in results page mobile
  $('.button--do-open-filters').click(function(event){
    $('.results--filters').toggleClass('filters-are-open');

    if($('.results--filters').hasClass('filters-are-open')){
      $(this).text('Close');
    } else {
      $(this).text('Filter by');
    }

    event.preventDefault();
  });

  // Handle Step 2 home
  $('.step-button--add-spouse').on('click touchend', function(event){
    $('.step-2--spouse').addClass('fieldset--is-open');
    $(this).css('opacity', '0');
    setTimeout(function() {$('.step-button--add-spouse').css('display', 'none')}, 500);

    event.preventDefault();
  });

  $('.step-button--add-dependant').on('click touchend',  function(event){
    $('.step-2--dependent').addClass('fieldset--is-open');

    event.preventDefault();
  });

  $('.button--remove-row').on('click touchend', function(event){
    if ($(this).parents('fieldset').hasClass('step-2--spouse')) {
      $(this).parents('fieldset').removeClass('fieldset--is-open');
      $('.step-button--add-spouse').css({ 
                                          'display': 'block',
                                          'opacity': '1'
                                        });
    } else {
      $(this).parents('fieldset').removeClass('fieldset--is-open');
    }

    event.preventDefault();
  })


  $('.header--steps.step--1 .button--go-step-2').on('click touchend', function(event){
    $('.header--steps.step--1').fadeOut('500', function(){
      $('.header--steps.step--2').fadeIn('500');
      setTimeout(function() {$('.profile-holder').removeClass('is-closed')}, 300);

      
    });

    $('.header--plan-categories nav').fadeOut('500', function(){
      $('.header--plan-categories .plans--start').fadeIn('500');
    });

    event.preventDefault();
  });

  $('.button--do-search-plans').on('click touchend', function(event){
    window.location = "./results.html";

    event.preventDefault();
  })


  // Back button.
  $('.button--do-back').on('click touchend', function(event){
    window.history.back();
    event.preventDefault();
  });


  // Random header backgrounds @ homepage.
  var headerClasses = ['image--random-1', 'image--random-2', 'image--random-3', 'image--random-4'];

  $('.header--hero').each(function(){
      $(this).addClass(headerClasses[~~(Math.random()*headerClasses.length)]);
  });


  // Remove interactions @ IE8.
  if(!($.browser.msie && parseInt($.browser.version) < 9) && !window.mobile && $(window).width() > 1020) {

    // Fixed table <thead>
    if(jQuery().floatThead) {
      $table = $('table');
      $table.floatThead({
        scrollingTop: 49,
        zIndex: 900
      });
    }

    // Fixed blocks
    if(jQuery().scrollToFixed) {
      $('.profile-holder').scrollToFixed({
        preFixed: function() {
          $('.header-main').removeClass('profile--is-edit');
        }
      });


      $('.page--plan-detail .grid--cost').scrollToFixed({
        marginTop: 49,
        zIndex: 900,
        limit: $('.grid--details').outerHeight(true) - $('.grid--cost').outerHeight(false) + 90,
      });

      //Fixed plan comparison in results page
      $('.results-plan-comparison-holder').scrollToFixed({
          marginTop: 49,
          zIndex: 900,
          spacerClass: 'results--compare-plans-spacer'
      });
    }
  }
  
  controlComparisonPlans();


  // Remove interactions @ Mobile devices.
  if(!window.mobile) {

    //Modal dialogs
    if(jQuery().fancybox) {
      // Open "Recommend Plan" modal
      $('a.plans--do-recommend, a.filters--do-find-doctor').fancybox({
        padding: 0,
        iframe: true,
        fitToView: true,
        autoSize: true,
        maxWidth: 660,
        iframe: {
          preload: false // fixes issue with iframe and IE
        },
        helpers:  {
          title : {
              type : 'inside'
          },
          overlay : {
              css : {
                  'background' : 'rgba(255,255,255,0.9)'
              }
          }
        }
      });
    }

    // Tooltips
    if(jQuery().tooltipster) {
      $('.icon--do-tooltip').tooltipster({
        position: 'bottom',
        maxWidth: 300
      });

      $('.plan-tooltip').tooltipster({
        position: 'bottom',
        offsetY: 5,
        contentAsHTML: true,
        
        maxWidth: 300,
        content: $('<strong>zxc</strong><p></p>'),
        functionInit: function(origin, content) {
          var tooltipTitle = origin.data('tooltip-header');
          var tooltipContent = origin.data('tooltip-content');

          // Tooltip header
          content[0].innerHTML = tooltipTitle;

          // Tooltip content
          content[1].innerHTML = tooltipContent;
        }
      });
    }
  }

  // Filters behavior
  $('.results--filters .filters--block a.filters--block-do-toggle').on('click touchend', function(event){
  	$(this).parent('.filters--block').toggleClass('filter--is-expanded');

  	event.preventDefault();
  })


  //Tabs behavior @ Plan Details.
  $('.module--tabs-holder').each(function () {

    $('.module--tabs-menu a', '.module--tabs-holder').on('click touchend', function (event) {

        closeMenu();

        var tabindex = $(this).index() + 1;

        $('.module--tabs-menu a').removeClass('tab--is-link-active');
        $(this).addClass('tab--is-link-active');
        
        if($.browser.msie && parseInt($.browser.version) == 8) {
          $(this).parents('.module--tabs-holder').find('.module--tabs-tab').hide()
          $(this).parents('.module--tabs-holder').find('.module--tabs-tab:nth-of-type('+tabindex+')').show();
        } else {
          $(this).parents('.module--tabs-holder').attr('data-tabs-active', tabindex);
        }
        
        if(!($.browser.msie && parseInt($.browser.version) < 9) && !window.mobile) {
          var scrollLimit = $('.grid--details').outerHeight(false) - $('.grid--cost').outerHeight(true) + 145;

          $('.page--plan-detail .grid--cost').trigger('detach.ScrollToFixed');

          $('.page--plan-detail .grid--cost').scrollToFixed({
            marginTop: 49,
            zIndex: 900,
            limit: scrollLimit,
          });
        }

        event.preventDefault();
    });
  });


  // Custom messages
  $('.custom--messages').addClass(function(){

      $(this).addClass('custom--messages--is-open'),

      setTimeout(function() {$('.custom--messages').removeClass('custom--messages--is-open')}, 5000);

  });

  $('.icon--do-close').on('click touchend', function(){
      $('.custom--messages').removeClass('custom--messages--is-open');
  });




  // show more @ plan comparison.
  var showMore = false;
  var heightTable = $('.features-table').height() + 40;
  $(".features-table").css('max-height', heightTable);
  $('#show-more').on('click touchend', function() {

    closeMenu();

  	var heightDivs = $('.more-details').height();
  	var MaxDivs = 8;
    if (!showMore) {
    	$(".comparison-column").addClass('show-more-details-column');
    	$(".more-details").addClass("show-more-details");
     	$(this).text('Show less information'); 
      var newMaxHeight = heightDivs * MaxDivs;
     	$(".features-table").css('max-height', newMaxHeight);
     	showMore = true;
    }
    else{
      $(".comparison-column").removeClass("show-more-details-column");
      $(".more-details").removeClass("show-more-details");
      $(".features-table").css('max-height', heightTable);
      $(this).text('Show more information');
      showMore = false;
    }
  });

// show more @ Results.
  $('#show-more-results').on('click touchend', function() {
    var heightTable = $(".module--results").height();
    $(".module-results--holder").css('max-height', heightTable);
    closeMenu()
      $(".module-results--holder").addClass("show-more-details-column");
      var heightTable = $(".module--results").height();
      $(".module-results--holder").css('max-height', heightTable);
      showMoreResults = true;
  });


  // Scroll-to-top behavior.
  $('.button--scroll-top').on('click touchend', function(event){
    $('body, html').animate({
      scrollTop: 0
    }, 500)


    event.preventDefault();
  })

  //Search
  $(".button--do-search").on('click touchend', function(event) {
    
    $(".form-search").addClass('form-search--is-open');
    event.preventDefault();
  });

  // Close Search
  $(".close-search").on('click touchend', function(event) {
    
    $(".form-search").removeClass('form-search--is-open');
    event.preventDefault();
  });

});


function controlSpouseDependent () {

  
  // Add Spouse


  $('.button--remove-row').on('click touchend', function(){
    $(this).parents('fieldset').remove();
  });

}

function controlComparisonPlans() {
    
    var 
      img,
      title,
      price;

    function removePlan(planID) {

      $('.compare-plans--plan[data-planid=' + planID + ']').remove();
      $('.module--results').find('input[data-planid=' + planID + ']').prop('checked', false);

      if($(".plan-comparison-tool:checked").length == 0) {
        $('.results--compare-plans').removeClass('compare--is-open');

        $('.results--compare-plans-spacer').animate({
          'height': '2px'
        }, 500, function(){
          $table.floatThead('destroy');
          $table.floatThead({
            scrollingTop: 49,
            zIndex: 900
          });
        });
        
      } else {
        $('.plan-comparison-tool').removeAttr('disabled');
      }

    }

    function addPlan(img, title, price, planID) {

      $('.compare-plans--do-compare').before('<div style="display:none" class="compare-plans--block compare-plans--plan" data-planid=' +planID+ '><figure><img src="' +img+ '" alt=""></figure><p class="plan-description">' +title+ '</p><p class="plan-value">' +price+'</p><button class="button--clean compare-plans--remove-plan"></button></div>');
      $('.compare-plans--plan').fadeIn(500);
    }


    $('.plan-comparison-tool').off().on().live('click', function() {      
      img = $(this).parents('td').find('img').attr('src');
      title = $(this).parents('td').find('.result-text').text();
      price = $(this).parents('tr').find('.result-monthly-cost').text();
      planID = $(this).attr('data-planid');

      if($(this).is(':checked')) {
        $('.results--compare-plans').addClass('compare--is-open');
        $('.header-main--nav').removeClass('mobile--is-open');
        $('.icon-mobile-menu').removeClass('mobile--is-open');
        $('.results--compare-plans-spacer').animate({
          'height': '112px'
        }, 500, function(){
          $table.floatThead('destroy');
          $table.floatThead({
            scrollingTop: 159,
            zIndex: 900
          });
        });
      
        addPlan(img, title, price, planID);
      } else {
        removePlan(planID);
      }

      if($(".plan-comparison-tool:checked").length == 0) {
        $('.results--compare-plans ').removeClass('compare--is-open');
        $('.header-main--nav').removeClass('mobile--is-open');
        $('.icon-mobile-menu').removeClass('mobile--is-open');
      }
        
      if($(window).width() < 1024) {
        if($(".plan-comparison-tool:checked").length >= 3) {
          $('.plan-comparison-tool:not(":checked")').attr('disabled', true);
        }
      } else {
        if($(".plan-comparison-tool:checked").length >= 5) {
          $('.plan-comparison-tool:not(":checked")').attr('disabled', true);
        }
      }

    });

    $('.compare-plans--remove-plan').live('click', function() {
      var getPlanId= $(this).parent('.compare-plans--plan').data('planid');
      removePlan(getPlanId);
    });

    $("#login").on('click touchend', function(event) {
      $(".header-img").addClass('header--is-logged-user');
    });

}


function correctMenu() {
  var docHeight = $(document).height();
  $('.header-main--nav').css("height",docHeight);
}

$(window).resize(function(){
  $('.header-main--nav').css("height", 'auto');
});

function closeMenu() {
  $('.header-main--nav').removeClass('mobile--is-open');
  $('.mobile-menu').removeClass('mobile--is-open');
}
