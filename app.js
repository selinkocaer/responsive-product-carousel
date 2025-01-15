(function () {
    const PRODUCTS_URL = Your API;
    const CAROUSEL_TITLE = "You Might Also Like";

    const fetchProducts = async () => {
        const localProducts = localStorage.getItem("productsData");
        if (localProducts) return JSON.parse(localProducts);

        try {
            const response = await fetch(PRODUCTS_URL);
            const products = await response.json();
            localStorage.setItem("productsData", JSON.stringify(products));
            return products;
        } catch (error) {
            console.error("Failed to fetch products:", error);
            return [];
        }
    };

    const createCarousel = async () => {
        const products = await fetchProducts();
        const favorites = JSON.parse(localStorage.getItem("favoriteProducts")) || [];

        const carouselContainer = $('<div class="carousel-container"></div>');
        const title = $('<p class="carousel-title"></p>').text(CAROUSEL_TITLE);
        const carouselWrapper = $('<div class="carousel-wrapper"></div>');
        const carouselTrack = $('<div class="carousel-track"></div>');
        const leftArrow = $('<button class="carousel-arrow left-arrow"><svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg></button>');
        const rightArrow = $('<button class="carousel-arrow right-arrow"><svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg></button>');

        carouselWrapper.append(carouselTrack);
        carouselContainer.append(title, leftArrow, carouselWrapper, rightArrow);
        $(".product-detail").after(carouselContainer);

        products.forEach((product) => {
            const isFavorited = favorites.includes(product.id);
            const productCard = $(
                `<div class="product-card" data-id="${product.id}">
          <img src="${product.img}" alt="${product.name}" class="product-image" />
          <div class="product-info">
            <p class="product-name">${product.name}</p>
            <span class="product-price">${product.price} TL</span>
            <button class="heart ${
                isFavorited ? "favorited" : ""
            }"><svg xmlns="http://www.w3.org/2000/svg" width="20.576" height="19.483" viewBox="0 0 20.576 19.483"><path fill="none" stroke="#555" stroke-width="1.5px" d="M19.032 7.111c-.278-3.063-2.446-5.285-5.159-5.285a5.128 5.128 0 0 0-4.394 2.532 4.942 4.942 0 0 0-4.288-2.532C2.478 1.826.31 4.048.032 7.111a5.449 5.449 0 0 0 .162 2.008 8.614 8.614 0 0 0 2.639 4.4l6.642 6.031 6.755-6.027a8.615 8.615 0 0 0 2.639-4.4 5.461 5.461 0 0 0 .163-2.012z" transform="translate(.756 -1.076)"></path></svg></button>
          </div>
        </div>`
            );

            productCard.find(".heart").on("click", (event) => {
                event.stopPropagation();
                const button = $(event.target).closest(".heart");
                const productId = product.id;
                const favorites = JSON.parse(localStorage.getItem("favoriteProducts")) || [];

                if (button.hasClass("favorited")) {
                    button.removeClass("favorited");
                    localStorage.setItem("favoriteProducts", JSON.stringify(favorites.filter((id) => id !== productId)));
                } else {
                    button.addClass("favorited");
                    favorites.push(productId);
                    localStorage.setItem("favoriteProducts", JSON.stringify(favorites));
                }
            });

            productCard.on("click", () => window.open(product.url, "_blank"));
            carouselTrack.append(productCard);
        });

        const style = `
      <style>
       .carousel-container {
        margin: 20px auto;
        width: 90%;
        position: relative;
        overflow: hidden;        
        border-radius: 8px;
        padding: 20px 10px;
      }

      .carousel-title {
        font-size: 24px;
    color: #29323b;
    line-height: 33px;
    font-weight: lighter;
    padding: 15px 0;
    margin: 0;
    margin-left : 5%
      }

      .carousel-wrapper {
        overflow: hidden;
        position: relative;
        padding: 0 5%;
      }

      .carousel-track {
        display: flex;
        transition: transform 0.3s ease;
      }

      .product-card {
        flex: 0 0 auto;
        width: 200px;
        margin: 0 10px;
        
        border-radius: 8px;
       
        text-align: center;
        position: relative;
      }

      .product-image {
        width: 100%;
        
        object-fit: cover;
        border-radius: 8px 8px 0 0;
      }

      .product-info {
        padding: 10px;
        text-align:left
      }
      .product-name {
        font-size: 1.5rem;
        font-weight: bold;
        color: #333;
        margin-bottom: 5px;    
        overflow: hidden;
        white-space: normal; 
        overflow-wrap: break-word; 
        text-overflow: ellipsis;
      }

      .product-price {
        font-size: 1.5rem;
        color: blue;
        font-weight: bold;
      }

      .heart {
       cursor: pointer;
    position: absolute;
    top: 9px;
    right: 15px;
    width: 34px;
    height: 34px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, .16);
    border: solid .5px #b6b7b9;
    display: flex
;
    justify-content: center;
    align-items: center;
      }

      .heart.favorited svg path {

   fill: blue; 
  stroke: none; 
}
    .carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  color: #fff;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 20; /* Increase z-index here */
}

.left-arrow {
  left: 10px;
}

.right-arrow {
  right: 10px;
  transform: rotate(180deg);
}

/* Add a more specific selector for other arrows on the page */
.other-arrow-class {
  z-index: 1; /* Ensure other arrows are behind */
}

      @media (max-width: 768px) {
        .product-card {
          width: 150px;
        }
      }

      @media (max-width: 480px) {
        .product-card {
          width: 120px;
        }
      }
      </style>
    `;
        $("head").append(style);

        let currentIndex = 0;
        const cardWidth = $(".product-card").outerWidth(true);
        const updateCarousel = () => {
            let maxVisible;

            const carouselWrapperWidth = $(".carousel-wrapper").width();

            if (carouselWrapperWidth <= 480) {
                maxVisible = 1.5;
            } else if (carouselWrapperWidth <= 768) {
                maxVisible = 3.5;
            } else {
                maxVisible = 6.5;
            }

            const cardWidth = carouselWrapperWidth / maxVisible;
            $(".product-card").css("width", `${cardWidth}px`);

            const maxIndex = products.length - Math.ceil(carouselWrapperWidth / cardWidth);
            currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));

            const offset = -currentIndex * cardWidth;
            $(".carousel-track").css("transform", `translateX(${offset}px)`);
        };

        leftArrow.on("click", () => {
            currentIndex--;
            updateCarousel();
        });

        rightArrow.on("click", () => {
            currentIndex++;
            updateCarousel();
        });

        $(window).on("resize", updateCarousel);
        updateCarousel();
    };

    if ($(".product-detail").length) {
        createCarousel();
    }
})();
