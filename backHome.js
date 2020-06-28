//全問解答後に行う動作
const displayQuiz = () => {
    const choices = quizzes[index-1].incorrect_answers;//ダミーの回答を取得
    choices.push(quizzes[index-1].correct_answer);//上記で作成したダミーの回答に正解を一つ追加
    
    //問題を表示する

    const messageElem = document.getElementById('message');
    const choiceElem = document.getElementById('choice');
    messageElem.textContent = '';
    choiceElem.textContent = '';

    //「message」に問題文を表示
    messageElem.textContent = quizzes[index-1].question;

}