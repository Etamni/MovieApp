const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1'
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="'

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')

// Get initial movies
getMovies(API_URL)

async function getMovies(url) {
    const res = await fetch(url);
    const data = await res.json();
    showMovies(data.results);
}

function showMovies(movies) {
    main.innerHTML = '';

    movies.forEach((movie) => {
        const { title, poster_path, vote_average, overview, id } = movie;
        const trailerURL = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=3fd2be6f0c70a2a598f084ddfb75487c`;

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        movieEl.innerHTML = `
            <button class="watch-trailer" data-trailer-url="${trailerURL}">Watch Trailer</button>
            <img src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
            </div>
        `;
        
        main.appendChild(movieEl);
    });

    // Add event listeners to "Watch Trailer" buttons
    const watchTrailerButtons = document.querySelectorAll('.watch-trailer');
    watchTrailerButtons.forEach(button => {
        button.addEventListener('click', () => {
            const trailerURL = button.getAttribute('data-trailer-url');
            openTrailer(trailerURL);
        });
    });
}

function openTrailer(trailerURL) {
    // Filter the API response to find the official trailer
    getOfficialTrailer(trailerURL).then(officialTrailer => {
        if (officialTrailer) {
            // Open the official trailer in a new tab or in an embedded video player
            window.open(`https://www.youtube.com/watch?v=${officialTrailer.key}`, '_blank');
        } else {
            // Handle the case where no official trailer is found
            alert("No official trailer found.");
        }
    }).catch(error => {
        console.error("Error fetching the trailer:", error);
    });
}

async function getOfficialTrailer(trailerURL) {
    // Parse the response and find the official trailer
    const data = await fetch(trailerURL);
    const response = await data.json();
    const officialTrailer = response.results.find(video => video.type === 'Trailer');

    return officialTrailer;
}

function getClassByRate(vote) {
    if(vote >= 8) {
        return 'green'
    } else if(vote >= 5) {
        return 'orange'
    } else {
        return 'red'
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if(searchTerm && searchTerm !== '') {
        getMovies(SEARCH_API + searchTerm);

        search.value = '';
    } else {
        window.location.reload();
    }
});
