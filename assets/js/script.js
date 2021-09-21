const API_KEY = 'PwgGa8Cy4NbgHIaZqcHCI7E8FtI';
const API_URL = 'https://ci-jshint.herokuapp.com/api';
const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));

document.getElementById('status').addEventListener('click', e => getStatus(e));
document.getElementById('submit').addEventListener('click', e => postForm(e));

async function getStatus(e){
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if(response.ok){
        displayStatus(data);
    } else {
        displayExceptions(data);
        throw new Error(data.error);
    }
}


function displayStatus(data){
    document.getElementById('resultsModalTitle').innerHTML = 'API key status';
    document.getElementById('results-content').innerHTML = `<p>Your key is valid until <br> ${data.expiry}</p>`;

    resultsModal.show();

}

function processOptions(form) {
    let optArray = [];

    for (let entry of form.entries()) {
        if (entry[0] === 'options') {
            optArray.push(entry[1]);
        }
    }

    form.delete('options');
    form.append('options', optArray.join());

    return form;
}

async function postForm(e){
    const form = processOptions (new FormData(document.getElementById('checksform')));

    for(let entry of form.entries()) {
        console.log(entry);
    }

    const response = await fetch(API_URL, {
                        method: "POST",
                        headers: {
                                    "Authorization": API_KEY,
                                 },
                        body: form
                        });

    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        displayExceptions(data);
        throw new Error(data.error);
    }
}

function displayErrors (data){
    let heading = `JSHint Results for ${data.file}`;

    if(data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.tottal_errors}</span></div>`;
        for(let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    document.getElementById('resultsModalTitle').innerHTML = heading;
    document.getElementById('results-content').innerHTML = results;

    resultsModal.show();
}

function displayExceptions(e){
    let heading = 'An Exception Occurred';
    let content =  `<p>Status code: ${e.status_code}<br>Error number: ${e.error_no}<br>${e.error}</p>`

    document.getElementById('resultsModalTitle').innerHTML = heading;
    document.getElementById('results-content').innerHTML = content;

    resultsModal.show();
}