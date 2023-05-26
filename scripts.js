
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
    function createCard(cardData) {
        let starState = "";
        let starString = "";
        let star;
        for (let i = 1; i <= 5; i++) {
            if (i <= cardData.star) {
                starState = "images/star_on.png";
            } else {
                starState = "images/star_off.png";
            }

            star = `<img src="${starState}" alt="star on" width="15px" />`;
            starString += i == 1 ? star : "\n" + star;
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
                  width="50px"
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
                    width="25px"
                    class="rounded-circle"
                  />
                  <h6 class="pl-2 m-0 main-color">${cardData.author}</h6>
                </div>
                <div class="info pt-4 d-flex justify-content-between">
                  <div class="rating">
                    ${starString}
                  </div>
                  <span class="main-color">${cardData.duration}</span>
                </div>
              </div>
            </div>
            `;

        return card;
    }
    function displayPopular(dataDisplay) {
        let classItem = "";
        for (let i in dataDisplay) {
            /*console.log(dataDisplay[i]);*/
            classItem = i === 0 ? "carousel-item active" : "carousel-item"; // if
            console.log(classItem);
            let card = createCard(dataDisplay[i]);
            let $carouselItem = $(`
              <div class="${classItem}">
                    <div class="col-12 col-sm-6 col-lg-3 d-flex justify-content-center">${card}</div>
              </div>
          `);
            $("#popular-items").append($carouselItem);
        }

        slider("popular");
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

    function requestData(url, operation, id, data = {}) {
        displayLoader(true);
        $.ajax({
            url: url,
            type: "GET",
            data: data,
            headers: { "Content-Type": "application/json" },
            success: function(response) {
                displayLoader(false, id);
                operation(response);
            },
            error: function(error) {
                alert(`Error Getting Data from ${url}`);
            },
        });
    }
    let requestsHomepage = [
        {
            url: "https://smileschool-api.hbtn.info/quotes",
            operation: displayQuotes,
            attribute: "carousel-items",
        },
        {
            url: "https://smileschool-api.hbtn.info/popular-tutorials",
            operation: displayPopular,
            attribute: "popular-items",
        }
    ];
    let $homePage = $("#homepage");
    let requestsCourses;

    if (Object.keys($homePage).length) {
        requestsCourses = requestsHomepage;
    } else {
        alert("No homepage");
    }
    for (let i of requestsCourses) {
        requestData(i.url, i.operation, i.id);
    }
});
