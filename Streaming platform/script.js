
document.addEventListener("DOMContentLoaded", () => {
  // 1) Scroll-to-top button (only if present)
  const scrollBtn = document.getElementById("scrollToTopBtn");
  if (scrollBtn) {
    window.addEventListener("scroll", () => {
      scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
    });
    scrollBtn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
  }

  // 2) Registration form: prevent submit & validate passwords
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => e.preventDefault());

    const pwdField = document.getElementById("password");
    const confirmField = document.getElementById("confirmPassword");

    function validatePasswords() {
      if (!confirmField.value) {
        pwdField.classList.remove("valid", "invalid");
        confirmField.classList.remove("valid", "invalid");
        return;
      }
      const match = pwdField.value === confirmField.value;
      pwdField.classList.toggle("valid", match);
      pwdField.classList.toggle("invalid", !match);
      confirmField.classList.toggle("valid", match);
      confirmField.classList.toggle("invalid", !match);
    }

    pwdField.addEventListener("input", validatePasswords);
    confirmField.addEventListener("input", validatePasswords);
  }

  // 3) Search page logic: dropdown → API → render
  const searchForm = document.getElementById("searchForm");
  const select     = document.getElementById("categorySelect");
  const resultsDiv = document.getElementById("results");

  if (searchForm && select && resultsDiv) {
    searchForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const query = select.value;
      if (!query) return;

      // clear previous results
      resultsDiv.innerHTML = "";

      try {
        const response = await fetch(
          `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`
        );
        const data = await response.json();

        if (!data.length) {
          resultsDiv.innerHTML = "<p>No shows found.</p>";
          return;
        }

        data.forEach(({ show }) => {
          const imgSrc = show.image?.medium || "img/placeholder.png";
          const card = document.createElement("div");
          card.className = "movie-card";
          card.innerHTML = `
            <img src="${imgSrc}" alt="${show.name} Poster" />
            <div class="movie-title">${show.name}</div>
          `;
          resultsDiv.append(card);
        });
      } catch (error) {
        console.error(error);
        resultsDiv.innerHTML = "<p>Error loading shows.</p>";
      }
    });
  }
});