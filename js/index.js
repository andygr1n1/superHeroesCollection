/* eslint-disable arrow-parens */
document.addEventListener("DOMContentLoaded", () => {
  // eslint-disable-next-line strict
  ("use strict");
  const collectionWrapper = document.querySelector(".collection-wrapper");
  const movieNameContainer = document.querySelector(".movie-name-container");

  //! f
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
        birthDay = "неизвестно";
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
          <div class="card-style hero-card-status"> Status: ${status}</div>`
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

  //?CORE?CORE?CORE?CORE?CORE?CORE?CORE?CORE?CORE?CORE?CORE
  const core = response => {
    //movieList
    const selectMovie = document.getElementById("movie-board"),
      selectMovieRow = document.querySelector(".movie-board-row");
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

    const movieBtn = document.getElementById("movie-select-button"),
      movieBoard = document.getElementById("movie-board"),
      shadowBoard = document.querySelector(".shadow-board"),
      movieNameContainer = document.querySelector(".movie-name-container");

    addCards(response);
    document.addEventListener("click", event => {
      const target = event.target;
      console.log(target);

      if (target.closest("#movie-select-button")) {
        console.log("sdfwefwef");
        shadowBoard.style.display = "block";
        document.body.style.overflow = "hidden";
      }

      if (
        target.closest(".close-button") ||
        target.classList.contains("shadow-board") ||
        target.closest(".menu-movie")
      ) {
        shadowBoard.style.display = "none";
        document.body.style.overflow = "auto";
      }

      if (target.closest(".all-heroes-filter")) {
        addCards(response);
        addMovie("All Movies");
      }

      if (target.closest(".alive-filter")) {
        addCards(response.filter(obj => obj.status === "alive"));
        addMovie("All Movies");
      }

      if (target.closest(".menu-movie")) {
        console.log(target.textContent);
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
    window.addEventListener("resize", () => {
      // if (window.innerWidth < 800) {
      // }
    });
  };

  fetch("../database/dbHeroes.json")
    .then(response => {
      if (response.status !== 200) {
        throw new Error("status network not 200");
      }
      return response.json();
    })
    .then(response => core(response));
});
