// TODO(you): Write the JavaScript necessary to complete the assignment.

const button_start = document.querySelector('.blue');
button_start.addEventListener('click', handleStartButton);
const userAnswer = {};

function handleStartButton(event) {
    let body = document.body;
    let intro = document.querySelector('#introduction');
    let author = document.querySelector('#author');
    intro.style.display = 'none';
    author.style.display = 'none';
    fetchData();
}

function handleAnsClick(e) {
    userAnswer[e.target.name] = e.target.value;
    console.log('-----', userAnswer)
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
    button_div.classList.add("box");
    button_div.appendChild(button_submit);
    button_submit.addEventListener('click', handleSubmit)

    //submit button
    function handleSubmit(event) {
        event.currentTarget.style.display = 'none';
        const review_quiz = document.querySelector('#review-quiz');
        console.log(review_quiz);
        const disable = document.querySelectorAll('input');
        const correctAns = myJson.correctAnswers;
        const result_view = document.createElement('div');
        const titles = document.createElement('p')
        const result_score = document.createElement('p');
        const result_percent = document.createElement('p');
        const button_again = document.createElement('button');
        const result_comment = document.createElement('p')
        let scores = 0;
        let result = '';

        //disable input
        disable.forEach(e => {
            e.disabled = true;
        });
        for (const key in userAnswer) {
            const totalInputDom = document.querySelectorAll(`input[name='${key}']`);
            const userInputDom = totalInputDom[userAnswer[key]];
            const correctInputDOM = totalInputDom[correctAns[key]];
            const statusCorrect = document.createElement('div');
            const statusWrong = document.createElement('div');
            statusCorrect.textContent = "Correct Answer";
            statusCorrect.classList.add('correct');
            statusWrong.textContent = "Wrong Answer";
            statusWrong.classList.add('wrong');

            //if user chose an answer
            if (userAnswer[key] != null) {
                //if user answer is correct
                if (userAnswer[key] == correctAns[key]) {
                    correctInputDOM.nextElementSibling.style.backgroundColor = '#d4edda'
                    correctInputDOM.nextElementSibling.appendChild(statusCorrect);
                    scores++;
                }
                //if user answer is wrong
                else {
                    correctInputDOM.nextElementSibling.style.backgroundColor = '#ddd'
                    userInputDom.nextElementSibling.style.backgroundColor = '#f8d7da'
                    correctInputDOM.nextElementSibling.appendChild(statusCorrect);
                    userInputDom.nextElementSibling.appendChild(statusWrong);
                }
            }
            //if user did not choose an answer
            else {
                correctInputDOM.nextElementSibling.style.backgroundColor = '#ddd'
                correctInputDOM.nextElementSibling.appendChild(statusCorrect);
            }
        }
        //write comment
        if (scores < 5) {
            result = 'Practice more to improve it :D';
        }
        else if (scores >= 5 && scores <= 8) {
            result = "You are doing great , keep working :D";
        }
        else if (scores > 8 && scores < 10) {
            result = "Great job !"
        }
        else {
            result = "Perfect @@ !!!"
        }

        //setup result box
        result_view.classList.add("box");
        titles.classList.add('title');
        titles.textContent = "Result:"
        result_score.classList.add('score');
        result_score.textContent = `${scores}/10`;
        result_percent.classList.add('questions');
        result_percent.textContent = `${scores * 10}%`;
        button_again.textContent = "Try Again";
        button_again.addEventListener('click', function () {
            location.reload();
        })
        button_again.classList.add('blue');
        result_comment.textContent = result;
        //append result box
        result_view.appendChild(titles);
        result_view.appendChild(result_score);
        result_view.appendChild(result_percent);
        result_view.appendChild(result_comment);
        result_view.appendChild(button_again);
        review_quiz.appendChild(result_view);





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
            userAnswer[e._id] = null;
            const label = document.createElement('label');
            const input = document.createElement('input');
            const div = document.createElement('div');

            input.type = "radio";
            input.id = `Q${qName}`;
            input.name = `${e._id}`;
            input.value = `${i}`;
            input.addEventListener('click', handleAnsClick)

            label.htmlFor = `Q${qName}`;
            label.textContent = e.answers[i];
            div.classList.add('background');

            div.appendChild(input);
            div.appendChild(label);
            quizBody.appendChild(div);
            qName++;
        }
        count += 1;
    });
    quizBody.appendChild(button_div);

}






