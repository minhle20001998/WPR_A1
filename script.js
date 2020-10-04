// TODO(you): Write the JavaScript necessary to complete the assignment.
//call API
fetchData();
//create an object to store user answers
let userAnswers = {};
const intro = document.querySelector('#introduction');
const author = document.querySelector('#author');
const button_start = document.querySelector('.blue');
const quizBody = document.querySelector(".quiz-body");
button_start.addEventListener('click', handleStartButton);

function handleStartButton(event) {
    let body = document.body;
    intro.style.display = 'none';
    author.style.display = 'none';
    //display the quiz
    quizBody.style.display = 'block';
}

//-------------begin of quiz section-------------//
async function fetchData() {
    const url = "https://wpr-quiz-api.herokuapp.com/attempts";
    const myResponse = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const myJson = await myResponse.json();
    const attempQuiz = document.querySelector("#attempt-quiz")
    const button_submit = document.createElement('button');
    const button_div = document.createElement('div');



    button_submit.textContent = "Submit your answers >"
    button_submit.classList.add("green");
    button_div.classList.add("box");
    button_div.appendChild(button_submit);


    let qName = 0;
    let count = 1;
    //generate questions and answers from JSON 
    myJson.questions.forEach(e => {
        const titles = document.createElement('p');
        const questions = document.createElement('p');
        const answer_box = document.createElement('div');

        answer_box.classList.add("answer_box");

        titles.classList.add("title", "with-margin");
        titles.textContent = `Question ${count} of ${myJson.questions.length}`;

        questions.classList.add("questions", "with-margin");
        questions.textContent = `${e.text}`;

        quizBody.appendChild(titles);
        quizBody.appendChild(questions);
        //loop for each answer in question 
        for (let i = 0; i < e.answers.length; i++) {
            userAnswers[e._id] = null;
            const label = document.createElement('label');
            const input = document.createElement('input');
            const div_answers = document.createElement('div');

            input.type = "radio";
            input.id = `Q${qName}`;
            input.name = `${e._id}`;
            input.value = `${i}`;
            input.addEventListener('click', handleAnsClick)

            //if radio input checked -> store the index of radio input
            function handleAnsClick(e) {
                userAnswers[e.target.name] = e.target.value;
                // console.log('-----', userAnswer)
            }

            label.htmlFor = `Q${qName}`;
            label.textContent = e.answers[i];

            div_answers.classList.add('background');

            div_answers.appendChild(input);
            div_answers.appendChild(label);

            answer_box.appendChild(div_answers);
            qName++;
        }
        count += 1;
        quizBody.appendChild(answer_box)
    });
    //append submit button
    quizBody.appendChild(button_div);
    //hide quiz
    quizBody.style.display = "none";

    //-------------end of quiz section-------------//

    //-------------begin of result section-------------//
    //handle submit button
    button_submit.addEventListener('click', handleSubmit)

    function handleSubmit(event) {
        button_div.style.display = 'none';
        const review_quiz = document.querySelector('#review-quiz');
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
        //loop for each user answers
        for (const key in userAnswers) {
            const totalInputDom = document.querySelectorAll(`input[name='${key}']`);
            const userInputDom = totalInputDom[userAnswers[key]];
            const correctInputDOM = totalInputDom[correctAns[key]];
            const statusCorrect = document.createElement('div');
            const statusWrong = document.createElement('div');

            statusCorrect.textContent = "Correct Answer";
            statusCorrect.classList.add('correct');
            statusWrong.textContent = "Wrong Answer";
            statusWrong.classList.add('wrong');
            //if user chose an answer
            if (userAnswers[key] != null) {
                //if user answer is correct
                if (userAnswers[key] == correctAns[key]) {
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
        //write score comment
        if (scores < 5) {
            result = 'Practice more to improve it :D';
        } else if (scores >= 5 && scores <= 8) {
            result = "You are doing great , keep working :D";
        } else if (scores > 8 && scores < 10) {
            result = "Good job !"
        } else {
            result = "P-P-Perfect @@ !!!"
        }

        //setup result box
        result_view.classList.add("box");

        titles.classList.add('result_title', 'with-margin');
        titles.textContent = "Result:"

        result_score.classList.add('score', 'with-margin');
        result_score.textContent = `${scores}/10`;

        result_percent.classList.add('questions', 'with-margin');
        result_percent.textContent = `${scores * 10}%`;

        result_comment.classList.add('with-margin');
        result_comment.textContent = result;

        button_again.textContent = "Try Again";
        button_again.addEventListener('click', handleTryAgain);
        button_again.classList.add('blue');


        //append result box
        result_view.appendChild(titles);
        result_view.appendChild(result_score);
        result_view.appendChild(result_percent);
        result_view.appendChild(result_comment);
        review_quiz.appendChild(result_view);
        result_view.appendChild(button_again);

        //handle try again button
        function handleTryAgain(e) {
            if (window.confirm("Are you sure want to finish this quiz")) {
                quizBody.innerHTML = "";
                review_quiz.innerHTML = "";
                intro.style.display = "block";
                fetchData();
                userAnswers = {};
                //scroll back to the begin of page
                const beginPage = document.querySelector("#course-name");
                beginPage.scrollIntoView();
            }
        }
    }
    //-------------end of result section-------------//
}