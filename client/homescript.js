console.log("script connected.")

var heart_status = 0 // 0 is empty and 1 is filled.
const nasaUrl = 'https://api.nasa.gov/planetary/apod?api_key=3mTebODv02nOLFO1jdYxdGoWFmgfrxfzVPFWVSJB&date=';
const putUrl = "http://localhost:8080/api/"

var heart_status = 0; // 0 is empty and 1 is filled
var date = new Date();
let year = date.getFullYear();
let month = date.getMonth();
let day = date.getDate();

function previousDate() {
  if (day - 1 < 1) {
    if (month - 1 < 1) {
      year -= 1; 
    } else {
      month -= 1;
    }
  } else {
    day -= 1;
  }
  return [year, month, day];
};

const dateToString = (year, month, day) =>
  String(year) + "-" + String(month) + "-" + String(day);


document.getElementById("heart-button").addEventListener("click", () => {
    let heart = document.getElementById("heart-button");
    if (heart_status == 0) {
        heart.src = "static/heart-filled.png"
        heart_status = 1;
        // TODO: update the database and mark this image as a favorite image.
        (async () => {
            const rawResponse = await fetch(putUrl + "put/" + document.getElementById("apod-date").innerHTML + "/" + "True", {
              method: 'PUT',
              headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
            });
            const content = await rawResponse.json();
            console.log(content);
          })();
    } else {
        heart_status = 0
        heart.src = "static/heart.png";
        // TODO: update the database and un-mark this image as a favorite image.
        (async () => {
            const rawResponse = await fetch(putUrl + "put/" + document.getElementById("apod-date").innerHTML + "/" + "False", {
              method: 'PUT',
              headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
            });
            const content = await rawResponse.json();
            console.log(content);
          })();
    }
})

document.getElementById("next-button").addEventListener("click", () => {
    document.getElementById("heart-button").src = "static/heart.png";
    heart_status = 0
    previousDate(year, month, day);
    fetch(
    nasaUrl + dateToString(year, month, day)
    )
    .then((r) => r.json())
    .then((r) => {
      console.log("current APOD data:");
      document.getElementById("apod-date").innerHTML = r.date;
      document.getElementById("apod-image").src = r.url;
      document.getElementById("apod-title").innerHTML = r.title;
      document.getElementById("apod-p").innerHTML = r.explanation;
      data = {
        date: r.date,
        isFavorite: "False",
        imgUrl: r.url
      }
      console.log(data);
      (async () => {
        const rawResponse = await fetch(putUrl + "add", {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
        });
        const content = await rawResponse.json();
        console.log(content);
      })();
    })
    .catch(function(error) {
          console.log("uh oh");
          console.log(error);
    })


    // fetch(nasaUrl)
    // .then(response => response.json())
    // .then((data) => {
    //     generateHome(data);  
    //     (async () => {
    //         const rawResponse = await fetch(putUrl + date.innerHTML + "/" + encodeURIComponent(img.src) + "/False", {
    //           method: 'POST',
    //           body: JSON.stringify(data[0])
    //         });
    //         const content = await rawResponse.json();
    //         console.log(content);
    //       })();
    // })
    // .catch(function(error) {
    //     console.log("uh oh");
    //     console.log(error);
    // });
})