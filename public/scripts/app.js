/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
 function findDifference(date){
  let difference_milliseconds = new Date(Date.now()) - new Date(date);
  let difference_seconds = difference_milliseconds / 1000;
  let difference_minutes = difference_seconds / 60;
  let difference_hours;
  let difference_days;
  let difference_years;
  if (difference_minutes < 1)
    return `few seconds ago`;
  else
    difference_hours = difference_minutes / 60;
  if (difference_hours < 1)
    return (Math.floor(difference_minutes) === 1) ? '1 minute ago' : `${Math.floor(difference_minutes)} minutes ago`;
  else
    difference_days = difference_hours / 24;
  if (difference_days < 1)
    return Math.floor(difference_hours) === 1 ? '1 hour ago' : `${Math.floor(difference_hours)} hours ago`;
  else
    difference_years = difference_days / 365;
  if (difference_years < 1)
    return Math.floor(difference_days) === 1 ? '1 day ago' : `${Math.floor(difference_days)} days ago`;
  else
    return Math.floor(difference_years) === 1 ? '1 year ago' : `${Math.floor(difference_years)} year ago`;

  return 0;
}

$(document).ready(function(){

  //takes care of POST Method / form submission using AJAX

  $( ".new-tweet" ).find("form").submit(function( event ) {
    event.preventDefault();
    if($(this).find("textarea").val() === ""){
      fadeInOut("p.error","Tweet cannot be empty");
    } else if($(this).find("textarea").val().length > 140){
      fadeInOut("p.error","Tweet exceeds the maximum length");
    } else {
      $.ajax({
        type: "POST",
        url:`/tweets/`,
        data: $(this).serialize(),
        success: updateTweets
      });
      $(this).find("textarea").val("");
    }
  });

  function fadeInOut(element, message){
    $(`${element}`).text(message);
    $(`${element}`).css("opacity",1);
    setTimeout(() => {
        $(`${element}`).fadeTo("slow",0);
      }, 1500);
  }

  function updateTweets(){
    $.ajax({
      type:"GET",
      url:'/tweets',
      success:(response)=>{
        const tweets = [];
        tweets.push(response[response.length-1]);
        renderTweets(tweets);
      }
    });
  }

  //responsible for fetching tweets from the http://localhost:8080/tweets page.
  //GET Method

  function loadTweets(){
    $.ajax({
      type:`GET`,
      url:`/tweets`,
      success: renderTweets
    });
  }
  loadTweets();

  //rendering the tweets in HTML Page

  function renderTweets(tweets) {
    var $tweetsContainer = $(".tweets-container");
    for (var tweet of tweets){
      //$tweetsContainer.prepend(createTweetElement(tweet)[0])
      createTweetElement(tweet).prependTo($tweetsContainer);
      $("<br>").prependTo($tweetsContainer);
    }
  }

  //creates each tweetr in HTML and returns the html article element

  function createTweetElement(tweet) {
    var $tweet = $('<article>').addClass('tweet');
    var $header = $("<header>");
    $header.append($("<img>").attr("src",tweet.user.avatars.regular));
    $header.append($("<h3>").text(tweet.user.name));
    $header.append($("<span>").text(tweet.user.handle));
    $tweet.append($header);

    $tweet.append($("<p>").text(tweet.content.text));

    var $footer = $("<footer>");
    $footer.append($("<span>").text(findDifference(tweet.created_at)));

    var $icons = $("<div>").addClass("footer-icons");
    $icons.append($("<i class=\"fa fa-heart\" aria-hidden=\"true\"></i>"));
    $icons.append($("<i class=\"fa fa-retweet\" aria-hidden=\"true\"></i>"));
    $icons.append($("<i class=\"fa fa-flag\" aria-hidden=\"true\"></i>"));

    $footer.append($icons);

    $tweet.append($footer);
    return $tweet;
  }

  //Toggle Form
  //based on compose button click
  $("#nav-bar").find("button").click(function(){
    $(this).toggleClass("selected");
    $(".new-tweet").toggle().find("textarea").focus();
  });


  //takes care of character counting functionality in textarea

  var textArea = $(".new-tweet").find("form").find("textarea");
  textArea.on("keyup", function(event){
    var counter = $(this).parent().find(".counter");
    var remainingChars = 140 - ($(this).val().length);
    counter.text(remainingChars);
    if(remainingChars <= 0)
      counter.css("color","red");
    else
      counter.css("color", "");
  });

  //takes care of hover features

  $(document).on('mouseenter','article.tweet', function(event){
    $(this).find(".footer-icons").css("display","block");
    $(this).css("opacity","1")
  });

  $(document).on('mouseleave', 'article.tweet', function(event){
    $(this).find(".footer-icons").css("display","none");
    $(this).css("opacity","0.8");
  });

});