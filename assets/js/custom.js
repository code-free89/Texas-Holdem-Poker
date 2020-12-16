$.ready= function() {
    setCookie("survey", "0");
}
$("#bt-signup").click(function(){
    var settings = {
        "url": "https://da987tkpjg.execute-api.us-east-1.amazonaws.com/PROD",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "body":{
                "participantID":0,
                "participantPassword":document.getElementById('password2').value,
                "ipAddress":"207.71.14.151",
                "firstName":document.getElementById('firstname').value,
                "lastName":document.getElementById('lastname').value,
                "address":document.getElementById('address').value,
                "city":document.getElementById('city').value,
                "state":document.getElementById('state').value,
                "zip":document.getElementById('zipcode').value,
                "agreement2SignatureName":document.getElementById('signname').value,
                "agreement2SignatureDate":document.getElementById('signdate').value,
            }
        }),
    };
    
    $.ajax(settings).done(function (response) {
        if(response['participantID'] != 0)
        {
            setCookie('participantID', response['participantID']);
            setCookie('participantPassword', document.getElementById('password2').value);
            setCookie('firstName', response['firstName']);
            setCookie('lastName', response['lastName']);
            setCookie('StartingNumberChips', response['StartingNumberChips']);
            setCookie('authToken', response['authToken']);
            setCookie('Hands', JSON.stringify(response['Hands']));
            setCookie('lastHand', response['lastHandPlayed']);
            setCookie('personalityQuestions', JSON.stringify(response['PersonalityQuestions']));
            setCookie('PokerExperienceQuestions', JSON.stringify(response['PokerExperienceQuestions']));
            window.location.replace("pages/poker.html");
        }
    });
});
$("#bt-login").click(function(){
    var settings = {
        "url": "https://da987tkpjg.execute-api.us-east-1.amazonaws.com/PROD",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "body":{
                "participantID": document.getElementById('pID').value,
                "participantPassword": document.getElementById('password').value,
            }
        }),
    };
      
    $.ajax(settings).done(function (response) {
        console.log(response['result']);
        if(response['result'] == "Success")
        {
            setCookie('participantID', response['participantID']);
            setCookie('participantPassword', document.getElementById('password').value);
            setCookie('firstName', response['firstName']);
            setCookie('lastName', response['lastName']);
            setCookie('StartingNumberChips', response['StartingNumberChips']);
            setCookie('authToken', response['authToken']);
            setCookie('Hands', JSON.stringify(response['Hands']));
            setCookie('lastHand', response['lastHandPlayed']);
            window.location.replace("pages/poker.html");
        }
        else
            window.alert(response['result']);
    });
});
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function eraseCookie(name) {   
    document.cookie = name + "=" + ("")  + "" + "; path=/";
}