var questions;
var authtoken;
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
            if(name == "personalityQuestions")
            {
              return JSON.parse(cookiePair[1]);
            }
            return decodeURIComponent(cookiePair[1]);
        }
    }
    
    // Return null if not found
    return null;
}
function eraseCookie(name) {   
    document.cookie = name + "=" + ("")  + "" + "; path=/";
}

$.ready = function() {
    authtoken = getCookie("authToken");
    if(!authtoken){
        window.location.replace("../../index.html");
    }
    questions = getCookie("personalityQuestions");
    console.log(questions[0]);
    for(i in questions) {
        console.log(questions[i]);
        var htmlstr = "<br><span class='h4 mb-3'>" + questions[i] + "</span>";
        htmlstr = htmlstr + "<div class='buttongroup' style='margin-top:5px'>" +
        "<input name='rad_ans" + i + "' type='radio'><label for='rad_ans'>&nbsp;&nbsp;Very true for me&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>" +
        "<input name='rad_ans" + i + "' type='radio'><label for='rad_ans'>&nbsp;&nbsp;Somewhat true for me&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>" +
        "<input name='rad_ans" + i + "' type='radio'><label for='rad_ans'>&nbsp;&nbsp;Somewhat false for me&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>" +
        "<input name='rad_ans" + i + "' type='radio'><label for='rad_ans'>&nbsp;&nbsp;Very false for me&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label></div>";
        $("#survey_questions").append(htmlstr);
    }
    $("#survey_questions").append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input class='btn btn-primary' id='result_bt' type='button' onclick='getresult()' value='Next'><br>");
}
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getresult() {
    var resultstr="";
    for(i in questions) {
        var ind = parseInt(i) + 1;
        if(i < 10) {
            resultstr = resultstr + '"personalityQ0' + ind + '":';
        }
        else
            resultstr = resultstr + '"personalityQ' + ind + '":';
        var ele = document.getElementsByName("rad_ans"+i);
        for(j = 0; j < ele.length; j++) { 
            if(ele[j].checked) {
                resultstr = resultstr + j + ",";
                break;
            }
        }
        if(j == ele.length) {
            alert("You have to answer all questions.");
            return;
        }
    }
    setCookie("authToken", authtoken);
    setCookie("pqAnswer", resultstr);
    window.location.replace("../../pages/final.html");
    console.log(resultstr);
}