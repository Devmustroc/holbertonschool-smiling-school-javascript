
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
    function slider() {
        $(".carousel").each(function() {
            let $carousel = $(this);
            $carousel.find(".carousel-item").each(function(index) {
                $(this).attr("data-id", index);
            });
            $carousel.find(".carousel-inner").each(function() {
                $(this).children(".carousel-item").first().addClass("active");
            });
            $carousel.find(".carousel-item").each(function() {
                let next = $(this).next();
                if (!next.length) {
                    next = $(this).siblings(":first");
                }
                next.children(":first-child").clone().appendTo($(this));

                if (next.next().length > 0) {
                    next
                        .next()
                        .children(":first-child")
                        .clone()
                        .appendTo($(this));
                } else {
                    $(this)
                        .siblings(":first")
                        .children(":first-child")
                        .clone()
                        .appendTo($(this));
                }
            });
        });
    }
    /**
     * Creates the string equivalent of a card element in bootstrap
     * @cardData  {object} An object containing data for creating the card
     * @return {string}  string equivalent of a card element in bootstrap
     */
    function creatCard(cardData) {
        let statStars = "";
        let stringStar = "";
        let star;
        for (let i = 0; i < 5; i++) {
            if (i < cardData.star) {
                statStars = "./images/star_on.png";
            } else {
                statStars = "./images/star_off.png";
            }
            star = `<img src="${statStars}" alt="star on" width="15px"/>`;
            stringStar += i === 0 ? star : "\n" + star;
        }
        let card = `
    <div class="card">
      <img
        src="${cardData.thumb_url}"
        class="card-img-top"
        alt="Video thumbnail"
      />
      <div class="card-img-overlay text-center">
        <img
          src="images/play.png"
          alt="Play"
          width="64px"
          class="align-self-center play-overlay"
        />
      </div>
      <div class="card-body">
        <h5 class="card-title font-weight-bold">${cardData.title}</h5>
        <p class="card-text text-muted">
            ${cardData["sub-title"]}
        </p>
        <div class="creator d-flex align-items-center">
          <img
            src="${cardData.author_pic_url}"
            alt="Creator of Video"
            width="30px"
            class="rounded-circle"
          />
          <h6 class="pl-3 m-0 main-color">${cardData.author}</h6>
        </div>
        <div class="info pt-3 d-flex justify-content-between">
          <div class="rating">
            ${stringStar}
          </div>
          <span class="main-color">${cardData.duration}</span>
        </div>
      </div>
    </div>
    `;
        return card;
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

    requestData("https://smileschool-api.hbtn.info/quotes", displayQuotes, "#carousel-items");
    requestData("https://smileschool-api.hbtn.info/popular-tutorials", displayPopularTutorials, "#popular-tutorials");
});
