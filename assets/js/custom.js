$.ready= function() {
    setCookie("survey", "0");
    // eraseCookie("authToken");
}
function validate_email() {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    var address = document.getElementById('email_address').value;
    if (reg.test(address) == false) 
    {
        alert('Invalid Email Address');
        return false;
    }
    console.log('validate_email');
    return true;
}
function validate_password() {
    var pass = document.getElementById('password2').value;
    if(pass.length < 6)
    {
        alert('Password must be more than 6 characters.');
        return false;
    }
    console.log('validate_password');
    return true;
}
function validate_accept() {
    if(document.getElementById('checkbox-signup').checked == false)
    {
        alert('Please check "I accept" box before registering.');
        return false;
    }
    return true;
}

$("#bt-signup").click(function(){
    if(validate_email() && validate_password() && validate_accept()) {
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
                    "email":document.getElementById('email_address').value,
                    "phone":document.getElementById('phone').value,
                    "agreement2SignatureName":document.getElementById('signname').value,
                    "agreement2SignatureDate":document.getElementById('signdate').value
                }
            }),
        };
        $.ajax({
            type: "POST",
            url: "https://da987tkpjg.execute-api.us-east-1.amazonaws.com/PROD",
            data: JSON.stringify({
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
                    "email":document.getElementById('email_address').value,
                    "phone":document.getElementById('phone').value,
                    "agreement2SignatureName":document.getElementById('signname').value,
                    "agreement2SignatureDate":document.getElementById('signdate').value
                }
            }),
            success: function(msg){
                console.log(msg);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
            }
          });
        $.ajax(settings).done(function (response) {
            console.log(response);
            if(response['participantID'] != 0)
            {
                setCookie('participantID', response['participantID']);
                setCookie('participantPassword', document.getElementById('password2').value);
                setCookie('firstName', response['firstName']);
                setCookie('lastName', response['lastName']);
                setCookie('StartingNumberChipsPlayer', response['StartingNumberChipsPlayer']);
                setCookie('StartingNumberChipsComputer', response['StartingNumberChipsComputer']);
                setCookie('authToken', parseInt(response['authToken']));
                localStorage.setItem('Hands', JSON.stringify(response['Hands']));
                setCookie('lastHand', parseInt(response['lastHandPlayed']) + 1);
                setCookie('personalityQuestions', JSON.stringify(response['PersonalityQuestions']));
                setCookie('PokerExperienceQuestions', JSON.stringify(response['PokerExperienceQuestions']));
                window.location.replace("survey-page.html");
            }
        });
    }
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
            setCookie('StartingNumberChipsPlayer', response['StartingNumberChipsPlayer']);
            setCookie('StartingNumberChipsComputer', response['StartingNumberChipsComputer']);
            setCookie('authToken', parseInt(response['authToken']));
            setCookie('Hands', JSON.stringify(response['Hands']));
            setCookie('lastHand', parseInt(response['lastHandPlayed']) + 1);
            setCookie('personalityQuestions', JSON.stringify(response['PersonalityQuestions']));
            setCookie('PokerExperienceQuestions', JSON.stringify(response['PokerExperienceQuestions']));
            window.location.replace("survey-page.html");
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