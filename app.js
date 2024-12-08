document.getElementById('search-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const query = document.getElementById('query').value;
    const response = await fetch(`/scrape?query=${encodeURIComponent(query)}`);
    const results = await response.json();

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (results.length > 0) {
        const ul = document.createElement('ul');
        results.forEach(result => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${result.link}" target="_blank">${result.title}</a>`;
            ul.appendChild(li);
        });
        resultsDiv.appendChild(ul);

        // Zobrazit tlačítko pro stažení
        document.getElementById('download-button').style.display = 'block';
    } else {
        resultsDiv.innerHTML = '<p>Žádné výsledky nenalezeny.</p>';
        document.getElementById('download-button').style.display = 'none';
    }
});

// Stahování výsledků
document.getElementById('download-button').addEventListener('click', async function() {
    const query = document.getElementById('query').value;
    console.log("query v app.js: ", query)
    window.location.href = `/download?query=${encodeURIComponent(query)}`;
});

