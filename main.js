$(document).ready(function() {
    var breakMinutes = 5;
    var sessionMinutes = 25;
    var timer = new Date();
    var intervalId = undefined;
    var secondsSpent = 0;

    timer.setMinutes(sessionMinutes);
    timer.setSeconds(0);

    $("#break-length").text(breakMinutes);
    $("#session-length").text(sessionMinutes);
    $("#timer-label").text("Session");
    $("#time-left").text(getTimeString(timer));

    function getTimeString(timer) {
        var timeMinutes = timer.getMinutes();

        if (timeMinutes == 0 && sessionMinutes == 60) {
            return "60:" + timer.getSeconds().toString().padStart(2, '0');
        } else {
            return timer.getMinutes().toString().padStart(2, '0') + ":" + timer.getSeconds().toString().padStart(2, '0');
        }
    }

    $("#reset").click(function() {
        breakMinutes = 5;
        sessionMinutes = 25;
        timer.setMinutes(sessionMinutes);
        timer.setSeconds(0);
        
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = undefined;
            secondsSpent = 0;
        }

        $("#break-length").text(breakMinutes);
        $("#session-length").text(sessionMinutes);
        $("#timer-label").text("Session");
        $("#time-left").text(getTimeString(timer));

        $("#beep").trigger('pause');
        $("#beep").prop('currentTime', 0);
    });

    $("#break-increment").click(function() {
        if (!intervalId && breakMinutes < 60) {
            ++breakMinutes;
            $("#break-length").text(breakMinutes);

            if ($("#timer-label").text() == "Break") {
                timer.setMinutes(breakMinutes);
                timer.setSeconds(0);
                $("#time-left").text(getTimeString(timer));
                spentSeconds = 0;
            }
        }     
    });

    $("#break-decrement").click(function() {
        if (!intervalId && breakMinutes > 1) {
            --breakMinutes;
            $("#break-length").text(breakMinutes);

            if ($("#timer-label").text() == "Break") {
                timer.setMinutes(breakMinutes);
                timer.setSeconds(0);
                $("#time-left").text(getTimeString(timer));
                spentSeconds = 0;
            }
        }
    });

    $("#session-increment").click(function() {
        if (!intervalId && sessionMinutes < 60) {
            ++sessionMinutes;
            $("#session-length").text(sessionMinutes);
            if ($("#timer-label").text() == "Session") {
                timer.setMinutes(sessionMinutes);
                timer.setSeconds(0);
                $("#time-left").text(getTimeString(timer));
                spentSeconds = 0;
            }
        }
    });

    $("#session-decrement").click(function() {
        if (!intervalId && sessionMinutes > 1) {
            --sessionMinutes;
            $("#session-length").text(sessionMinutes);

            if ($("#timer-label").text() == "Session") {
                timer.setMinutes(sessionMinutes);
                timer.setSeconds(0);
                $("#time-left").text(getTimeString(timer));
                spentSeconds = 0;
            }
        }
    });

    $("#start_stop").click(function() {
        var mode = $("#timer-label").text();

        if (intervalId) {
            clearInterval(intervalId);
            intervalId = undefined;
            
            if ($("#start_stop").hasClass("btn-success"))
                $("#start_stop").removeClass('btn-success').addClass('btn-warning');
            
        } else {
            if (!intervalId) {
                timer.setMinutes(timer.getMinutes());
                timer.setSeconds(timer.getSeconds());
            }

            if ($("#start_stop").hasClass("btn-primary"))
                $("#start_stop").removeClass("btn-primary").addClass("btn-success");
            else if ($("#start_stop").hasClass("btn-warning"))
                $("#start_stop").removeClass("btn-warning").addClass("btn-success");

            if (mode == "Session") {
                intervalId = setInterval(function() {
                    timer.setSeconds(timer.getSeconds() - 1);
                    $("#time-left").text(getTimeString(timer));

                    ++secondsSpent;
                    
                    if (secondsSpent == sessionMinutes * 60) {
                        clearInterval(intervalId);
                        intervalId = undefined;
                        secondsSpent = 0;

                        $("#timer-label").addClass("text-danger");
                        $("#time-left").addClass("text-danger");
                        $("#beep").trigger('play');

                        setTimeout(function() {
                            $("#beep").prop('currentTime', 0);
                            $("#timer-label").removeClass("text-danger");
                            $("#time-left").removeClass("text-danger");
                            $("#timer-label").text("Break");
                            timer.setMinutes(breakMinutes);
                            timer.setSeconds(0);
                            $("#time-left").text(getTimeString(timer));
                            $("#start_stop").click();
                        }, 3500);
                    }
                }, 1000);
            } else if (mode == "Break") {
                intervalId = setInterval(function() {
                    timer.setSeconds(timer.getSeconds() - 1);
                    $("#time-left").text(getTimeString(timer));

                    ++secondsSpent;

                    if (secondsSpent == breakMinutes * 60) {
                        clearInterval(intervalId);
                        intervalId = undefined;
                        secondsSpent = 0;

                        $("#timer-label").addClass("text-danger");
                        $("#time-left").addClass("text-danger");
                        $("#beep").trigger('play');

                        setTimeout(function() {
                            $("#beep").prop('currentTime', 0);
                            $("#timer-label").removeClass("text-danger");
                            $("#time-left").removeClass("text-danger");
                            $("#timer-label").text("Session");
                            timer.setMinutes(sessionMinutes);
                            timer.setSeconds(0);
                            $("#time-left").text(getTimeString(timer));
                            $("#start_stop").click();
                        }, 3500);
                    }
                }, 1000);
            }
        }
    });
});