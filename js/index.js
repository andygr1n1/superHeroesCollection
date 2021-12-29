document.addEventListener("DOMContentLoaded", () => {
  "use strict";
  const collectionWrapper = document.querySelector(".collection-wrapper");
  const movieNameContainer = document.querySelector(".movie-name-container");

  const addCards = collection => {
    collectionWrapper.textContent = "";
    collection.forEach(element => {
      let {
        name,
        species,
        gender,
        birthDay,
        deathDay,
        status,
        actors,
        photo,
        movies,
      } = element;

      if (birthDay === undefined) {
        birthDay = "unknown";
      }

      if (species === undefined) {
        species = "unknown";
      }

      const heroCard = document.createElement("div");
      heroCard.classList.add("hero-card");
      heroCard.insertAdjacentHTML(
        "beforeend",
        `
          <img class="hero-card-img" src="database/${photo}" alt="${name}">
          <div class="card-style hero-card-name"> Name: <span class="name-focus">${name}</span></div>         
          <div class="card-style hero-card-species"> Race: ${species}</div>
          <div class="card-style hero-card-gender"> Gender: ${gender}</div>
          <div class="card-style hero-card-birthday"> Date of birth: ${birthDay}</div>
          <div class="card-style hero-card-status"> Status: ${status}</div>
        `
      );

      if (deathDay !== undefined) {
        heroCard.insertAdjacentHTML(
          "beforeend",
          `
          <div class="card-style hero-card-name"> Date of death: ${deathDay}</div>`
        );
      }

      heroCard.insertAdjacentHTML(
        "beforeend",
        `<div class="card-style hero-card-actors"> Real Name: ${actors}</div>`
      );

      if (movies !== undefined) {
        heroCard.insertAdjacentHTML(
          "beforeend",
          `<div class="card-style hero-card-movies"><span class="card-style-movie">Movies: </span>${movies.join(
            ", "
          )}</div>`
        );
      }

      collectionWrapper.append(heroCard);
      let opacityCounter = 0,
        animation;
      const timer = () => {
        animation = requestAnimationFrame(timer);
        opacityCounter += 0.008;
        heroCard.style.opacity = `${opacityCounter}`;
        if (opacityCounter >= 1) {
          cancelAnimationFrame(animation);
        }
      };
      timer();
    });

    const nameFocus = document.querySelectorAll(".name-focus"),
      heroCard = document.querySelectorAll(".hero-card"),
      heroGender = document.querySelectorAll(".hero-card-gender");
    for (let x = 0; x < heroGender.length; x++) {
      if (heroGender[x].textContent.toLowerCase().includes("female")) {
        nameFocus[x].style.color = "rgb(255, 0, 106)";
        heroCard[x].style.boxShadow =
          "10px 7px 12px rgba(255, 255, 255, 0.200)";
      } else {
        nameFocus[x].style.color = "rgb(44, 143, 255)";
      }
    }
  };

  const addMovie = name => {
    movieNameContainer.textContent = `Movie: ${name}`;
  };

  const showBoard = selector => {
    if (selector.style.opacity <= 0) {
      let opacityCounter = 0,
        animation;
      const timer = () => {
        animation = requestAnimationFrame(timer);
        selector.style.display = "block";
        opacityCounter += 0.05;
        selector.style.opacity = `${opacityCounter}`;
        if (opacityCounter >= 1) {
          cancelAnimationFrame(animation);
        }
      };
      timer();
    } else {
      let opacityCounter = 1,
        animation;
      const timer = () => {
        animation = requestAnimationFrame(timer);
        opacityCounter -= 0.05;
        selector.style.opacity = `${opacityCounter}`;
        if (opacityCounter <= 0) {
          document.querySelector(".shadow-board").style.display = "none";
          document.body.style.overflow = "auto";
          cancelAnimationFrame(animation);
        }
      };
      timer();
    }
  };

  //main function
  const core = response => {
    const selectMovieRow = document.querySelector(".movie-board-row"),
      menuCloseBtn = document.querySelector(".close-button");
    let movieList = new Set();
    response.forEach(allElements => {
      if (allElements.movies !== undefined) {
        allElements.movies.forEach(arrayElement => {
          movieList.add(arrayElement);
        });
      }
    });

    movieList = Array.from(movieList).sort();

    movieList.forEach(movie => {
      const addMovie = document.createElement("button");
      addMovie.classList.add("menu-movie");
      addMovie.textContent = movie;
      selectMovieRow.insertAdjacentElement("beforeend", addMovie);
    });

    const shadowBoard = document.querySelector(".shadow-board");

    addCards(response);

    document.addEventListener("click", event => {
      const target = event.target;

      if (target.closest("#movie-select-button")) {
        shadowBoard.style.display = "block";
        showBoard(shadowBoard);
        document.body.style.overflow = "hidden";
      }

      if (
        target.closest(".close-button") ||
        target.classList.contains("shadow-board") ||
        target.closest(".menu-movie")
      ) {
        showBoard(shadowBoard);
      }

      if (target.closest(".all-heroes-filter")) {
        addCards(response);
        addMovie("All Movies");
      }

      if (target.closest(".menu-movie")) {
        addCards(
          response.filter(obj => {
            if (obj.movies !== undefined) {
              return obj.movies.join(",").includes(target.textContent);
            }
          })
        );
        addMovie(target.textContent);
      }
    });

    menuCloseBtn.addEventListener("mouseover", event => {
      const target = event.target;
      console.log(target);
      let deg = 0,
        animation;
      const rotateMe = () => {
        animation = requestAnimationFrame(rotateMe);
        deg += 15;

        target.style.transform = `rotate(${deg}deg)`;

        if (deg >= 340) {
          cancelAnimationFrame(animation);
        }
      };
      rotateMe();
    });
  };

  fetch("../database/dbHeroes.json", {
    
  })
    .then(response => {
      if (response.status !== 200) {
        throw new Error("status network not 200");
      }
      return response.json();
    })
    .then(response => core(response));
});
