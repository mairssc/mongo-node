(() => {
    // makeAPOD is used to create a APOD node in the following format:
    // <div class="apod">
    //     <small id="apod-date"> 02-21-2021 </small>
    //     <img id="apod-image" width="200px" src="https://apod.nasa.gov/apod/image/2102/rosette_goldman_960.jpg" alt="">
    // </div>
    let i = 0;

    const makeAPOD = (url, date) => {
        var div = document.createElement("div");
        div.className = "apod";
        var small = document.createElement("small");
        small.id = "apod-date" + String(i);
        small.innerText = date;
        var img = document.createElement("img");
        img.src = url;
        img.style.width = "200px"
        div.appendChild(small);
        div.appendChild(img);
        i += 1;
        return div
    }

    // TODO: Fetch a list of APODs from the database.
    const putUrl = "http://localhost:8080/api/";

    fetch(putUrl + "favorite", {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        })
        .then((r) => r.json())
        .then((data) => {
            content = data;
            console.log(content);

            let apods = [];
            let cur = []
            for (doc of content) {
                cur.push(doc.imgUrl);
                cur.push(doc.date);
                apods.push(cur);
                cur = [];
            }
            var al = document.getElementById("apod-list");
            for (apod of apods) {
                console.log(apod)
                al.appendChild(makeAPOD(apod[0], apod[1]))
            }
            var apodsClass = document.getElementsByClassName("apod");
            console.log(apodsClass)

            for (var i = 0; i < apodsClass.length; i++) {
                let curDate = apodsClass[i].innerText;
                console.log(curDate)

                apodsClass[i].addEventListener("click", () => {
                    fetch(putUrl + "put/" + String(curDate)  + "/" + "False", {
                        method: 'PUT', 
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8'
                        }
                    })
                        .then((r) => r.json())
                        .then((data) => console.log(data))
                })
                apodsClass[i].addEventListener("mouseover", () => {
                    document.body.style.cursor = "pointer";
                })
                apodsClass[i].addEventListener("mouseout", () => {
                    document.body.style.cursor = "default";
                })
            }
        })  
})()

