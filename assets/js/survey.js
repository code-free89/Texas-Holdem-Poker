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

$.ready = function() {
    questions = getCookie("personalityQuestions");
    console.log(questions[0]);
    for(i in questions) {
        console.log(questions[i]);
        var htmlstr = "<br><span class='h4'>" + questions[i] + "</span>";
        htmlstr = htmlstr + "<div class='buttongroup'> " +
        "<input name='rad_ans" + i + "' type='radio'><label for='rad_ans'>Very true for me</label>" +
        "<input name='rad_ans" + i + "' type='radio'><label for='rad_ans'>Somewhat true for me</label>" +
        "<input name='rad_ans" + i + "' type='radio'><label for='rad_ans'>Somewhat false for me</label>" +
        "<input name='rad_ans" + i + "' type='radio'><label for='rad_ans'>Very false for me</label></div>";
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
        if(i < 10)
            resultstr = resultstr + "\"personalityQ0" + i + "\":";
        else
            resultstr = resultstr + "\"personalityQ" + i + "\":";
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
    setCookie("pqAnswer", resultstr);
    window.location.replace("../../pages/final.html");
    console.log(resultstr);
}