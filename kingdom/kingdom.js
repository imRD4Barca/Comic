// SLIDESHOW
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides((slideIndex += n));
}

function currentSlide(n) {
    showSlides((slideIndex = n));
}

function showSlides(n) {
    const slides = document.getElementsByClassName("slide");
    const dots = document.getElementsByClassName("dot");
    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;
    for (let slide of slides) slide.style.display = "none";
    for (let dot of dots) dot.className = dot.className.replace(" active", "");
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}

// RATING STARS GENERATION
function createStars(container, interactive = true) {
    container.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement("span");
        star.classList.add("star");
        star.textContent = "★";
        if (!interactive) star.style.cursor = "default";

        if (interactive) {
            star.addEventListener("mouseover", () => highlightStars(container, i));
            star.addEventListener("mouseout", () => highlightStars(container, container.dataset.current || 0));
            star.addEventListener("click", () => setRating(container, i));
        }
        container.appendChild(star);
    }
}

function highlightStars(container, count) {
    const stars = container.querySelectorAll(".star");
    stars.forEach((star, i) => {
        star.classList.toggle("filled", i < count);
    });
}

function setRating(container, rating) {
    container.dataset.current = rating;
    highlightStars(container, rating);
}

// Initialize interactive stars for user input
document.querySelectorAll(".user-review .stars").forEach((container) => {
    createStars(container, true);
    container.dataset.current = 0;
    highlightStars(container, 0);
});

// Generate stars for static average ratings
function setStaticStars(container, score) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(score)) stars.push("★");
        else if (i === Math.ceil(score) && score % 1 >= 0.5) stars.push("⯪");
        else stars.push("☆");
    }
    container.textContent = stars.join("");
}

// Set initial average rating stars
document.querySelectorAll(".average-ratings .stars.static").forEach((container) => {
    const score = parseFloat(container.dataset.score) || 0;
    setStaticStars(container, score);
});

// STORE REVIEWS
const allReviews = [];

// On form submit
document.getElementById("review-form").addEventListener("submit", (e) => {
    e.preventDefault();

    // Grab user ratings from stars
    const ratings = {};
    let valid = true;
    document.querySelectorAll(".user-review .stars").forEach((container) => {
        const cat = container.dataset.category;
        const val = parseInt(container.dataset.current);
        if (!val || val < 1 || val > 5) {
            alert(`Please rate the ${cat} category!`);
            valid = false;
            return;
        }
        ratings[cat] = val;
    });
    if (!valid) return;

    const comment = document.getElementById("comment").value.trim();
    if (!comment) {
        alert("Write your review before submitting!");
        return;
    }

    // Save review
    const review = {
        id: Date.now(),
        ratings,
        comment,
    };
    allReviews.push(review);

    // Render review
    renderReview(review);

    // Reset form stars and comment
    document.querySelectorAll(".user-review .stars").forEach((container) => {
        container.dataset.current = 0;
        highlightStars(container, 0);
    });
    document.getElementById("comment").value = "";

    // Update average ratings
    updateAverageRatings();
});

function renderReview(review) {
    const list = document.getElementById("comments-list");
    const div = document.createElement("div");
    div.className = "single-review";

    let html = `<div class="review-ratings">`;
    for (const cat in review.ratings) {
        html += `<div><strong>${capitalize(cat)}:</strong> ${starString(review.ratings[cat])}</div>`;
    }
    html += `</div>`;
    html += `<p>${review.comment}</p>`;
    div.innerHTML = html;

    list.prepend(div);
}

function starString(count) {
    return "★".repeat(count) + "☆".repeat(5 - count);
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Calculate and update average rating stars
function updateAverageRatings() {
    const totals = { story: 0, art: 0, characters: 0, overall: 0 };
    const count = allReviews.length;
    if (count === 0) return;

    allReviews.forEach((r) => {
        totals.story += r.ratings.story;
        totals.art += r.ratings.art;
        totals.characters += r.ratings.characters;
        totals.overall += r.ratings.overall;
    });

    const averages = {};
    for (const key in totals) {
        averages[key] = totals[key] / count;
    }

    document.getElementById("avg-story").dataset.score = averages.story.toFixed(1);
    document.getElementById("avg-art").dataset.score = averages.art.toFixed(1);
    document.getElementById("avg-characters").dataset.score = averages.characters.toFixed(1);
    document.getElementById("avg-overall").dataset.score = averages.overall.toFixed(1);

    document.querySelectorAll(".average-ratings .stars.static").forEach((container) => {
        const score = parseFloat(container.dataset.score) || 0;
        setStaticStars(container, score);
    });
}
document.querySelector('a[href="#reviews"]').addEventListener('click', function (e) {
    e.preventDefault();
    const navbarHeight = document.querySelector('nav').offsetHeight;
    const target = document.querySelector('#reviews');
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
});




