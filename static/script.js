document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('scrapeForm');
    const urlInput = document.getElementById('url');
    const resultContainer = document.getElementById('scrapedContent');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const url = urlInput.value.trim();
        if (url === '') {
            alert('Please enter a valid URL.');
            return;
        }

        // Clear previous results
        resultContainer.innerHTML = '';

        // Fetch the webpage and scrape content
        fetch('/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: url })
        })
        .then(response => response.json())
        .then(data => {
            // Display scraped text
            const textParagraph = document.createElement('p');
            textParagraph.textContent = data.text;
            resultContainer.appendChild(textParagraph);

            // Display scraped images
            data.images.forEach(image => {
                const imgElement = document.createElement('img');
                imgElement.src = image.src;
                imgElement.alt = 'Image';
                resultContainer.appendChild(imgElement);
            });

            // Display scraped videos
            data.videos.forEach(video => {
                const videoElement = document.createElement('video');
                videoElement.src = video.src;
                videoElement.controls = true;
                resultContainer.appendChild(videoElement);
            });
        })
        .catch(error => {
            console.error('Error fetching webpage:', error);
            alert('Error fetching webpage. Please try again.');
        });
    });
});
