var questions;
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
            if(name == "PokerExperienceQuestions")
            {
              return JSON.parse(cookiePair[1]);
            }
            return decodeURIComponent(cookiePair[1]);
        }
    }
    
    // Return null if not found
    return null;
  }

$.ready = function() {
    questions = getCookie("PokerExperienceQuestions");
    for(i in questions) {
        var htmlstr = "<br><span class='h4'>" + questions[i]["Number"] + " " + questions[i]["Question"] + "</span>";
        htmlstr = htmlstr + "<div class='buttongroup'> ";
        for(j = 0; j < questions[i]["Responses"].length; j ++) {
            htmlstr = htmlstr + "<input name='rad_ans" + i + "' type='radio'><label for='rad_ans'>" + questions[i]["Responses"][j] + "</label><br>";
        }
        $("#final_questions").append(htmlstr);
    }
    $("#final_questions").append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input class='btn btn-primary' id='result_bt' type='button' onclick='getresult()' value='Get Result'><br>");
}

function getresult() {
    var resultstr = getCookie('pqAnswer');
    for(i in questions) {
        if(i < 10)
            resultstr = resultstr + "\"pokerExperienceQ0" + i + "\":\"";
        else
            resultstr = resultstr + "\"pokerExperienceQ" + i + "\":\"";
        var ele = document.getElementsByName("rad_ans"+i);
        for(j = 0; j < ele.length; j++) { 
            if(ele[j].checked) {
                resultstr = resultstr + questions[i]["Responses"][j][0] + "\",";
                break;
            }
        }
        if(j == ele.length) {
            alert("You have to answer all questions.");
            return;
        }
    }
    resultstr = resultstr.substring(0, resultstr.length - 1);
    sendRequest(resultstr);
}

function sendRequest(resultstr) {
    var settings = {
        "url": "https://da987tkpjg.execute-api.us-east-1.amazonaws.com/PROD",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "body":{
                "participantID": getCookie('participantID'),
                "participantPassword": getCookie('participantPassword'),
                resultstr
            }
        }),
    };
    console.log(settings);
    $.ajax(settings).done(function (response) {
        console.log(response['result']);
        if(response['result'] == "Success")
        {
            window.alert("Success");
        }
        else
            window.alert(response['result']);
    });
}