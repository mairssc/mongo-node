console.log("script connected.")

var heart_status = 0 // 0 is empty and 1 is filled.
const nasaUrl = 'https://api.nasa.gov/planetary/apod?count=1&api_key=3mTebODv02nOLFO1jdYxdGoWFmgfrxfzVPFWVSJB';
const putUrl = "http://localhost:8080/api/db/"


const img = document.getElementById("apod-image");
const date = document.getElementById("apod-date");
const title = document.getElementById("apod-title");
const description = document.getElementById("apod-p");
let json;

function generateHome(data) {
    json = data;
    console.log(json);
    img.src = json[0].url;
    date.innerHTML = json[0].date;
    title.innerHTML = json[0].title;
    description.innerHTML = json[0].explanation;
    console.log(data[0])
}


document.getElementById("heart-button").addEventListener("click", () => {
    let heart = document.getElementById("heart-button");
    if (heart_status == 0) {
        heart.src = "static/heart-filled.png"
        heart_status = 1;
        // TODO: update the database and mark this image as a favorite image.
        (async () => {
            const rawResponse = await fetch(putUrl + "put/" + date.innerHTML + "/" + "True", {
              method: 'PUT',
            });
            const content = await rawResponse.json();
            console.log(content);
          })();
    } else {
        heart_status = 0
        heart.src = "static/heart.png";
        // TODO: update the database and un-mark this image as a favorite image.
        (async () => {
            const rawResponse = await fetch(putUrl + "put/" + date.innerHTML + "/" + "False", {
              method: 'PUT',
            });
            const content = await rawResponse.json();
            console.log(content);
          })();
    }
})

document.getElementById("next-button").addEventListener("click", () => {
    document.getElementById("heart-button").src = "static/heart.png";
    heart_status = 0
    fetch(nasaUrl)
    .then(response => response.json())
    .then((data) => {
        generateHome(data);  
        (async () => {
            const rawResponse = await fetch(putUrl + date.innerHTML + "/" + encodeURIComponent(img.src) + "/False", {
              method: 'POST',
              body: JSON.stringify(data[0])
            });
            const content = await rawResponse.json();
            console.log(content);
          })();
    })
    .catch(function(error) {
        console.log("uh oh");
        console.log(error);
    });
})