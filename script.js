// TODO(you): Write the JavaScript necessary to complete the assignment.

const button_start = document.querySelector('.blue');
button_start.addEventListener('click', handleStartButton);

function handleStartButton(event) {
    let body = document.body;
    // let button_submit = document.createElement('button');
    let intro = document.querySelector('#introduction');
    let author = document.querySelector('#author');
    intro.style.display = 'none';
    author.style.display = 'none';
    // button_submit.textContent = "Submit your answers >"
    // button_submit.classList.add("green");
    fetchData();
    // body.appendChild(button_submit);
}

async function fetchData() {
    const url = "https://wpr-quiz-api.herokuapp.com/attempts";
    const myResponse = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });
    //begin
    const myJson = await myResponse.json();
    const quizBody = document.querySelector(".quiz-body");
    const button_submit = document.createElement('button');
    const button_div = document.createElement('div');

    button_submit.textContent = "Submit your answers >"
    button_submit.classList.add("green");
    button_div.classList.add("green-div");
    button_div.appendChild(button_submit);
    button_submit.addEventListener('click', handleSubmit)
    function handleSubmit(event) {
        const review = document.querySelector('#review-quiz');
        const disable = document.querySelectorAll('input');
        const correctAns = myJson.correctAnswers;
        disable.forEach(e => {
            e.disabled = true;
        });
        

    }
    let qName = 0;
    let count = 1;
    myJson.questions.forEach(e => {
        const titles = document.createElement('p');
        const questions = document.createElement('p');
        titles.classList.add("title");
        titles.textContent = `Question ${count} of ${myJson.questions.length}`;

        questions.classList.add("questions");
        questions.textContent = `${e.text}`;

        quizBody.appendChild(titles);
        quizBody.appendChild(questions);
        for (let i = 0; i < e.answers.length; i++) {
            const label = document.createElement('label');
            const radio = document.createElement('input');
            const div = document.createElement('div');


            radio.type = "radio";
            radio.id = `Q${qName}`;
            radio.name = `${e._id}`;
            radio.value = `${i}`;

            label.htmlFor = `Q${qName}`;
            label.textContent = e.answers[i];
            div.classList.add('background');

            div.appendChild(radio);
            div.appendChild(label);
            quizBody.appendChild(div);
            qName++;
        }
        count += 1;
    });
    quizBody.appendChild(button_div);

}






