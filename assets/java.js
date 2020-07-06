$(document).ready(function () {
    //search button 
    $("#search").on("click", function () {
        var townsearch = $("#town").val();
        $("#town").val("");
        weather(townsearch);
        Forecast(townsearch);
    });


    var history = JSON.parse(localStorage.getItem("history")) || []



    for (var i = 0; i < history.length; i++) {
        createRow(history[i]);
    }

    function createRow(text) {
        var townlist = $("<li>").addClass("list-group-item").text(text);
        $(".history").append(townlist);
    }

    $(".history").on("click", "li", function () {
        weather($(this).text());
        Forecast($(this).text());
    });

    function weather(townsearch) {

        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + townsearch + "&appid=74be9cd9c32bfd399b3705045cdd3b26&units=imperial",


        }).then(function (data) {
            if (history.indexOf(townsearch) === -1) {
                history.push(townsearch);
                localStorage.setItem("history", JSON.stringify(history));
                createRow(townsearch);
            }
            $("#today").empty();


            var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
            var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");

            var card = $("<div>").addClass("card");
            var cardBody = $("<div>").addClass("card-body");
            var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
            var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
            var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " °F");
            var feels = $("<p>").addClass("card-text").text("Feels Like: " + data.main.feels_like + " °F");

            var lon = data.coord.lon;
            var lat = data.coord.lat;

            $.ajax({
                type: "GET",
                url: "https://api.openweathermap.org/data/2.5/uvi?appid=74be9cd9c32bfd399b3705045cdd3b26" + "&lat=" + lat + "&lon=" + lon,
               

            }).then(function (response) {
                console.log(response);

                var localresponse = response.value;
                var uvIndex = $("<p>").addClass("card-text").text("UV Index: ");
                var btn = $("<span>").addClass("btn btn-sm").text(localresponse);


                if (localresponse < 3) {
                    btn.addClass("btn-success");
                } else if (localresponse < 7) {
                    btn.addClass("btn-warning");
                } else {
                    btn.addClass("btn-danger");
                }

                cardBody.append(uvIndex);
                $("#today .card-body").append(uvIndex.append(btn));

            });


            title.append(img);
            cardBody.append(title, temp, humid, wind,feels );
            card.append(cardBody);
            $("#today").append(card);
            console.log(data);
        });
    }

    function Forecast(townsearch) {
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + townsearch + "&appid=9bbe868aa95e2e05ff8a18fa3fab1fc7&units=imperial",

        }).then(function (data) {
            console.log(data);
            $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");

            for (var i = 0; i < data.list.length; i++) {

                if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {

                    var ftitle = $("<h3>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
                    var imgweath = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");

                    var five = $("<div>").addClass("col-md-2");
                    var cardFive = $("<div>").addClass("card bg-primary text-white");
                    var cardBodyFive = $("<div>").addClass("card-body");
                    var humidf = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
                    var tempf = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp + " °F");

                    five.append(cardFive.append(cardBodyFive.append(ftitle, imgweath, tempf, humidf)));
                    $("#forecast .row").append(five);


                }
            }
        });
    }

});
window.onload = window.localStorage.clear();