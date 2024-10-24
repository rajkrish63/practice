document.getElementById('scrapeForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const url = document.getElementById('urlInput').value;
    const contentTypes = Array.from(document.querySelectorAll('input[name="content"]:checked'))
                              .map(el => el.value);

    if (!url) {
        alert('Please enter a valid URL');
        return;
    }

    if (contentTypes.length === 0) {
        alert('Please select at least one content type');
        return;
    }

    try {
        const response = await fetch('/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url, contentTypes })
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('output').textContent = data.message;
        } else {
            document.getElementById('output').textContent = `Error: ${data.error}`;
        }
    } catch (error) {
        document.getElementById('output').textContent = 'Error occurred: ' + error.message;
    }
});
