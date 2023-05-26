
$(document).ready(function() {

    function displayLoader(show) {
        if (show) {
            $(".loader").show();
        } else {
            $(".loader").hide();
        }
    }

    function displayQuotes(data) {
        let carouselItems = $("#carousel-items");
        carouselItems.empty();

        for (let i = 0; i < data.length; i++) {
            let classItem = i === 0 ? "carousel-item active" : "carousel-item";
            let $carouselItem = $(`
        <blockquote class="${classItem}">
          <div class="row mx-auto align-items-center">
            <div class="col-12 col-sm-2 col-lg-2 offset-lg-1 text-center">
              <img src="${data[i].pic_url}" class="d-block align-self-center" alt="Carousel Pic ${i}" />
            </div>
            <div class="col-12 col-sm-7 offset-sm-2 col-lg-9 offset-lg-0">
              <div class="quote-text">
                <p class="text-white pr-md-4 pr-lg-5">${data[i].text}</p>
                <h4 class="text-white font-weight-bold">${data[i].name}</h4>
                <span class="text-white">${data[i].title}</span>
              </div>
            </div>
          </div>
        </blockquote>
      `);

            carouselItems.append($carouselItem);
        }
    }
    function creatCard() {

    }

    function slider() {
        $(".carousel").carousel({
            interval: 5000,
        });
    }

    function displayPopularTutorials(data) {
        let classItem = "";
        for (let i in data) {
            classItem = i === "0" ? "carousel-item active" : "carousel-item";
            let card = creatCard(data[i]);
            let $carouselItem = $(`
                <div class="${classItem}">
                <div class="col-12 col-sm-6 col-lg-3 d-flex justify-content-center">
                ${card}
                </div>
                 </div>
          `);
            $("#popular-tutorials").append($carouselItem);
        }
        slider();
    }

    function requestData(url, callback, id, data ={}) {
        displayLoader(true);
        $.ajax({
            url: url,
            type: "GET",
            data: data,
            headers: { "Content-Type": "application/json" },
            success: function(response) {
                displayLoader(false, id);
                callback(response);
            },
            error: function(error) {
                alert(`Error Getting Data from ${url}`);
            },
        });
    }
    let requestsHome = [
        {
            url: "https://smileschool-api.hbtn.info/quotes",
            callback: displayQuotes,
            id: "#carousel-items",
        },
        {
            url: "https://smileschool-api.hbtn.info/popular-tutorials",
            callback: displayPopularTutorials,
            id: "#popular-tutorials",
        }
    ]

    let url = "https://smileschool-api.hbtn.info/quotes";

    requestData(url, displayQuotes);
});
