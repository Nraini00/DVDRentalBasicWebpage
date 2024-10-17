document.addEventListener('DOMContentLoaded', () => {
    const movieSelect = document.getElementById('movieSelect');
    const rentStartDate = document.getElementById('rentStartDate');
    const rentEndDate = document.getElementById('rentEndDate');
    const totalPrice = document.getElementById('totalPrice');
    const modalRate = document.getElementById('modal-rate');
    let moviePrice = 0;

    // Load movie data from JSON file
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Check if data is loaded correctly
            const movieContainer = document.getElementById('movie-container');

            // Populate movie cards
            data.forEach((movie, index) => {
                const card = document.createElement('div');
                card.className = 'card';
                
                const img = document.createElement('img');
                img.src = movie.image;
                img.alt = movie.movie_Name;
                
                const cardContent = document.createElement('div');
                cardContent.className = 'card-content';
                
                const title = document.createElement('h2');
                title.textContent = movie.movie_Name;
                
                const releaseDate = document.createElement('p');
                releaseDate.innerHTML = `<strong>Release Date:</strong> ${movie.release_Date}`;
                
                const director = document.createElement('p');
                director.innerHTML = `<strong>Director:</strong> ${movie.director}`;
                
                const location = document.createElement('p');
                location.innerHTML = `<strong>Location:</strong> ${movie.location}`;
                
                const genre = document.createElement('p');
                genre.innerHTML = `<strong>Genre:</strong> ${movie.genre}`;
            
                const rate = document.createElement('p');
                // Parse rate and check if it's a valid number
                const movieRate = parseFloat(movie.rate);
                
                if (!isNaN(movieRate)) {
                    rate.innerHTML = `<strong>Rate:</strong> RM ${movieRate.toFixed(2)}`;
                } else {
                    rate.innerHTML = `<strong>Rate:</strong> RM N/A`; // Fallback if rate is invalid
                }
                
                const button = document.createElement('button');
                button.textContent = 'Rent Now';
                button.className = 'rent-button';
                button.setAttribute('data-bs-toggle', 'modal');
                button.setAttribute('data-bs-target', '#rentModal');
                button.setAttribute('data-movie-index', index);
                
                button.addEventListener('click', () => {
                    document.getElementById('modal-movie-name').textContent = movie.movie_Name;
                    document.getElementById('modal-release-date').textContent = movie.release_Date;
                    document.getElementById('modal-director').textContent = movie.director;
                    document.getElementById('modal-location').textContent = movie.location;
                    document.getElementById('modal-genre').textContent = movie.genre;
                    
                    // Check and display rate in the modal
                    if (!isNaN(movieRate)) {
                        document.getElementById('modal-rate').textContent = `RM ${movieRate.toFixed(2)}`;
                    } else {
                        document.getElementById('modal-rate').textContent = 'RM N/A';
                    }
                    
                    calculateTotalPrice(); // Ensure total price is calculated
                });
            
                cardContent.appendChild(title);
                cardContent.appendChild(releaseDate);
                cardContent.appendChild(director);
                cardContent.appendChild(location);
                cardContent.appendChild(genre);
                cardContent.appendChild(rate);
                cardContent.appendChild(button);
                
                card.appendChild(img);
                card.appendChild(cardContent);
                
                movieContainer.appendChild(card);
            });
            
            

            // Populate movie select dropdown in the modal
            data.forEach((movie, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = movie.movie_Name;
                movieSelect.appendChild(option);
            });

            // Event listeners for date changes
            rentStartDate.addEventListener('change', calculateTotalPrice);
            rentEndDate.addEventListener('change', calculateTotalPrice);

            const rentModal = document.getElementById('rentModal');
            rentModal.addEventListener('show.bs.modal', () => {
                const selectedIndex = movieSelect.value;
                const selectedMovie = data[selectedIndex];

                if (selectedMovie) {
                    moviePrice = parseFloat(selectedMovie.rate) || 0;
                    document.getElementById('modal-movie-name').textContent = selectedMovie.movie_Name;
                    document.getElementById('modal-release-date').textContent = selectedMovie.release_Date;
                    document.getElementById('modal-director').textContent = selectedMovie.director;
                    document.getElementById('modal-location').textContent = selectedMovie.location;
                    document.getElementById('modal-genre').textContent = selectedMovie.genre;
                    modalRate.textContent = `RM ${moviePrice.toFixed(2)}`;
                    
                    calculateTotalPrice();
                }
            });
        })
        .catch(error => console.error('Error fetching the JSON file:', error));
});
