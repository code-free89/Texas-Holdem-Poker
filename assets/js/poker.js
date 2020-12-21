"use strict";
var STARTING_CHIPS;
var hands;
var hand_index = 0;
var LAST_NUMBER_OF_HANDS;
var comcardsrc1, comcardsrc2;
var com_bet_chips, player_bet_chips;
var com_end_chips, player_end_chips;
var com_start_chips, player_start_chips;
var bet_amout = 1000;
var total_pot;
var showcount = 0;
function getCookie(name) {
  // Split cookie string and get all individual name=value pairs in an array
  var cookieArr = document.cookie.split(";");
  
  // Loop through the array elements
  for(var i = 0; i < cookieArr.length; i++) {
      var cookiePair = cookieArr[i].split("=");
      
      /* Removing whitespace at the beginning of the cookie name
      and compare it with the given string */
      if(name == cookiePair[0].trim()) {
          // Decode the cookie value and return
          if(name == "Hands")
          {
            return JSON.parse(cookiePair[1]);
          }
          return decodeURIComponent(cookiePair[1]);
      }
  }
  
  // Return null if not found
  return null;
}

$.ready= function() {
  if(getCookie("survey") != "0")
    window.location.replace("../index.html");
  console.log("init()");
  $("#boardcard1").hide();
  $("#boardcard2").hide();
  $("#boardcard3").hide();
  $("#boardcard4").hide();
  $("#boardcard5").hide();
  $("#bt_nexthand").hide();
  $("#partID").text(getCookie("participantID"));
  $("#playername").text(getCookie("firstName") + " " + getCookie("lastName"));
  hands = getCookie('Hands');
  com_start_chips = parseInt(getCookie('StartingNumberChipsComputer'));
  player_start_chips = parseInt(getCookie('StartingNumberChipsPlayer'));
  com_end_chips = com_start_chips;
  player_end_chips = player_start_chips;
  hand_index = parseInt(getCookie('lastHand')) - 1;
  if(hand_index >= hands.length)
    window.location.replace("../pages/survey-page.html");
  initialize_bet();
  new_round();
}

function initialize_bet() {
  $("bt_call").disabled = false;
  $("bt_raise").disabled = false;
  com_bet_chips = parseInt(hands[hand_index]['computerBet']);
  player_bet_chips = 0;
  total_pot = parseInt(hands[hand_index]['chipsInPot']);
  com_end_chips = com_end_chips - total_pot / 2;
  if(com_end_chips < 0) {
    total_pot = total_pot - com_end_chips * 2;
    com_bet_chips = 0;
  }
  com_end_chips = com_end_chips - com_bet_chips;
  if(com_end_chips < 0) {
    com_bet_chips = com_bet_chips + com_end_chips;
    com_end_chips = 0;
  }  
  player_end_chips = player_end_chips - total_pot / 2;
  if(player_end_chips < 0) {
    total_pot = total_pot - player_end_chips * 2;
    com_end_chips -= player_end_chips;
    player_end_chips = 0;
  }
  if(player_end_chips == 0) {
    $("bt_call").disabled = true;
    $("bt_raise").disabled = true;    
  }

  $("#comchips").text("$" + com_end_chips);
  $("#playerchips").text("$" + player_end_chips);
  $("#total-pot").text(total_pot);
  $("#combet").text("Bet:$" + com_bet_chips);
  $("#playerbet").text("Bet:$" + player_bet_chips);
}

function show_decision()
{
  if(player_end_chips == 0 || com_end_chips == 0) {
    if(hands[hand_index]["winner"] == "computer") {
      $("#winpanel").text("You are busted!");
      $("boardcard5").show(100);
      $("#winpanel").show(200);
      $("#bt_nexthand").show(100);
      com_end_chips = com_end_chips + total_pot;
    } else {
      $("#winpanel").text("You won the game!");
      $("boardcard5").show(100);
      $("#winpanel").show(200);
      $("#bt_nexthand").show(100);
      player_end_chips += total_pot;
    }
  } else {
    $("#decisiongroup").show(100);
  }
}

function show_comcards() {
  $("#comcard1").attr("src", comcardsrc1);
  $("#comcard2").attr("src", comcardsrc2);
}

function new_round()
{
  console.log('new_round()');
  $("#decisiongroup").hide();
  $("#winpanel").hide();
  $("#total-pot").show();
  $("#combet").show();
  $("#playerbet").show();
  $("#boardcard5").hide();
  $("#playercard1").attr("src", "../assets/images/" + hands[hand_index]['playerHoleCards'][0] + "1.png");
  $("#playercard2").attr("src", "../assets/images/" + hands[hand_index]['playerHoleCards'][1] + "1.png");
  $("#comcard1").attr("src", "../assets/images/cardback.png");
  $("#comcard2").attr("src", "../assets/images/cardback.png");
  comcardsrc1 = "../assets/images/" + hands[hand_index]['computerHoleCards'][0] + "1.png"
  comcardsrc2 = "../assets/images/" + hands[hand_index]['computerHoleCards'][1] + "1.png"
  $("#boardcard1").attr("src", "../assets/images/" + hands[hand_index]['flopCards'][0] + "1.png");
  $("#boardcard2").attr("src", "../assets/images/" + hands[hand_index]['flopCards'][1] + "1.png");
  $("#boardcard3").attr("src", "../assets/images/" + hands[hand_index]['flopCards'][2] + "1.png");
  $("#boardcard4").attr("src", "../assets/images/" + hands[hand_index]['turnCard'] + "1.png");
  $("#boardcard5").attr("src", "../assets/images/" + hands[hand_index]['riverCard'] + "1.png");
  $("#boardcard1").show(1000);
  $("#boardcard2").show(1000);
  $("#boardcard3").show(1000);
  $("#boardcard4").show(1000, show_decision);
}

function call_bt_click() {
  $("#boardcard5").show(100);
  if(com_bet_chips > player_end_chips) {
    player_bet_chips = player_end_chips;
    com_end_chips = com_end_chips + com_bet_chips - player_bet_chips;
    com_bet_chips = player_bet_chips;
    player_end_chips = 0;
    total_pot = total_pot + com_bet_chips + player_end_chips;
  }
  else
  {
    player_end_chips = player_end_chips - com_bet_chips + player_bet_chips;
    player_bet_chips = com_bet_chips;
    total_pot = total_pot + com_bet_chips + player_bet_chips;
  }
  $("#total-pot").text(total_pot);
  if(player_end_chips == 0)
    $("#playerchips").text("All in");
  else
    $("#playerchips").text("$" + player_end_chips);
  $("#combet").text("Bet:$" + com_bet_chips);
  $("#playerbet").text("Bet:$" + player_bet_chips);
  if(hands[hand_index]["winner"] == "computer") {
    $("#winpanel").text("Opponent won pot of $" + total_pot);
    if(player_end_chips == 0)
      $("#winpanel").text("You are busted!");
    com_end_chips = com_end_chips + total_pot;
  }
  else {
    $("#winpanel").text(getCookie("firstName") + " " + getCookie("lastName") + " won pot of $" + total_pot);
    if(com_end_chips == 0)
      $("#winpanel").text("You won the game!");
    player_end_chips = player_end_chips + total_pot;
  }
  var settings = {
    "url": "https://zui46hi6gj.execute-api.us-east-1.amazonaws.com/PROD",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Content-Type": "application/json"
    },
    "data": JSON.stringify({
        "body":{
          "participantID":parseInt(getCookie("participantID")),
          "participantPassword":getCookie("participantPassword"),
          "handNumber": hand_index,
          "playersChipsAtStartOfHand": player_start_chips,
          "playersChipsAtEndOfHand": player_end_chips,
          "playersWager": player_bet_chips,
          "playersAction": "Call",
          "computersChipsAtStartOfHand": com_start_chips,
          "computersChipsAtEndOfHand": com_end_chips,
          "authToken": getCookie("authToken"),
        }
    }),
  };
  $.ajax(settings).done(function (response) {
    if(response['result'] == "Success") {
      show_comcards();
      $("#decisiongroup").hide();
      $("#winpanel").show();
      $("#total-pot").hide();
      $("#combet").hide();
      $("#playerbet").hide();
      $("#comchips").text("$" + com_end_chips);
      $("#playerchips").text("$" + player_end_chips);
      $("#total-pot").text("0");
      $("#combet").text("Bet:$0");
      $("#playerbet").text("Bet:$0");
      com_start_chips = com_end_chips;
      player_start_chips = player_end_chips;
      $("#bt_nexthand").show(100);
    } else {
      alert(response['result']);
    }
  });
}
function raise_bt_click() {
  if(com_bet_chips >= player_end_chips) {
    alert("You can't raise!");
    return;
  }
  $("#boardcard5").show(100);
  if(player_end_chips < com_bet_chips * 2) {
    com_end_chips = com_end_chips - player_end_chips + com_bet_chips;
    com_bet_chips = player_end_chips;
    total_pot += com_bet_chips * 2;
    player_end_chips = 0;
    player_bet_chips = com_bet_chips;
  } else if(com_end_chips < com_bet_chips) {
    player_end_chips = player_end_chips - com_end_chips;
    com_bet_chips = com_bet_chips + com_end_chips;
    player_bet_chips = com_bet_chips;
    total_pot = total_pot + com_bet_chips + player_bet_chips;
    com_end_chips = 0;
  } else {
    player_end_chips = player_end_chips - (com_bet_chips - player_bet_chips) * 2;
    player_bet_chips = com_bet_chips + com_bet_chips - player_bet_chips;
    com_end_chips = com_end_chips - player_bet_chips + com_bet_chips;
    com_bet_chips = player_bet_chips;
    total_pot = total_pot + com_bet_chips + player_bet_chips;
  }
  $("#total-pot").text(total_pot);
  if(player_bet_chips == 0)
    $("#playerchips").text("All in");
  else
    $("#playerchips").text("$" + player_end_chips);
  $("#combet").text("Bet:$" + com_bet_chips);
  $("#playerbet").text("Bet:$" + player_bet_chips);
  if(com_end_chips == 0)
    $("#comchips").text("All in");
  else
    $("#comchips").text("$" + com_end_chips);
  if(hands[hand_index]["winner"] == "computer") {
    $("#winpanel").text("Opponent won pot of $" + total_pot);
    com_end_chips = com_end_chips + total_pot;
    if(player_end_chips == 0)
      $("#winpanel").text("You are busted!");
  }
  else {
    $("#winpanel").text(getCookie("firstName") + " " + getCookie("lastName") + " won pot of $" + total_pot);
    if(com_end_chips == 0)
      $("#winpanel").text("You won the game!");
    player_end_chips = player_end_chips + total_pot;
  }
  var settings = {
    "url": "https://zui46hi6gj.execute-api.us-east-1.amazonaws.com/PROD",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Content-Type": "application/json"
    },
    "data": JSON.stringify({
        "body":{
            "participantID":parseInt(getCookie("participantID")),
            "participantPassword":getCookie("participantPassword"),
            "handNumber": hand_index,
            "playersChipsAtStartOfHand": player_start_chips,
            "playersChipsAtEndOfHand": player_end_chips,
            "playersWager": player_bet_chips,
            "playersAction": "Raise",
            "computersChipsAtStartOfHand": com_start_chips,
            "computersChipsAtEndOfHand": com_end_chips,
            "authToken": getCookie("authToken"),
        }
    }),
  };

  $.ajax(settings).done(function (response) {
    if(response['result'] == "Success") {
      show_comcards();
      $("#decisiongroup").hide();
      $("#winpanel").show();
      $("#total-pot").hide();
      $("#combet").hide();
      $("#playerbet").hide();
      $("#comchips").text("$" + com_end_chips);
      $("#playerchips").text("$" + player_end_chips);
      $("#total-pot").text("0");
      $("#combet").text("Bet:$0");
      $("#playerbet").text("Bet:$0");
      com_start_chips = com_end_chips;
      player_start_chips = player_end_chips;
      $("#bt_nexthand").show(100);
    } else {
      alert(response['result']);
    }
  });
}
function fold_bt_click()
{
  $("#boardcard5").show(100);
  total_pot = total_pot + com_bet_chips + player_bet_chips;
  com_end_chips = com_end_chips + total_pot;
  $("#comchips").text("$" + com_end_chips);
  $("#total-pot").text(total_pot);
  $("#combet").text("Bet:$" + com_bet_chips);
  $("#playerbet").text("Bet:$" + player_bet_chips);
  $("#winpanel").text("Opponent won pot of $" + total_pot);
  var settings = {
      "url": "https://zui46hi6gj.execute-api.us-east-1.amazonaws.com/PROD",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({
          "body":{
              "participantID":parseInt(getCookie("participantID")),
              "participantPassword":getCookie("participantPassword"),
              "handNumber": hand_index,
              "playersChipsAtStartOfHand": player_start_chips,
              "playersChipsAtEndOfHand": player_end_chips,
              "playersWager": player_bet_chips,
              "playersAction": "Fold",
              "computersChipsAtStartOfHand": com_start_chips,
              "computersChipsAtEndOfHand": com_end_chips,
              "authToken": getCookie("authToken"),
          }
      }),
  };
  
  $.ajax(settings).done(function (response) {
    show_comcards();
    if(response['result'] == "Success") {
      $("#decisiongroup").hide();
      $("#winpanel").show();
      $("#total-pot").hide();
      $("#combet").hide();
      $("#playerbet").hide();
      $("#comchips").text("$" + com_end_chips);
      $("#playerchips").text("$" + player_end_chips);
      $("#total-pot").text("0");
      $("#combet").text("Bet:$0");
      $("#playerbet").text("Bet:$0");
      com_start_chips = com_end_chips;
      player_start_chips = player_end_chips;
      $("#bt_nexthand").show(100);
    } else {
      alert(response['result']);
    }
  });
}
function nexthand_bt_click() {
  if(player_end_chips == 0 || com_end_chips == 0) {
    window.location.replace("../pages/survey-page.html");
  } else {
    $("#bt_nexthand").hide();
    $("boardcard5").hide();
    $("#winpanel").hide();
    hand_index ++;
    if(hand_index < hands.length) {
      initialize_bet();
      new_round();
    } else {
      window.location.replace("../pages/survey-page.html");
    }
  }
}