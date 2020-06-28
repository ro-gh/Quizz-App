//  webAPIを活用した活用「クイズアプリ」
let correctsAnswerCount = 0; // 正答数を格納していく変数
let quizNumber = 0; //何問目かを表示するための変数


/** [ arrShuffle ]
 * 
 * 選択肢をシャッフルする関数
 * 
 */
function arrShuffle(arr) { 
    let len = arr.length;   //length=問題数
    while (len > 0) {
        const rnd = Math.floor(Math.random() * len);
        const tmp = arr[len - 1];
        arr[len - 1] = arr[rnd];
        arr[rnd] = tmp;
        len -= 1;
    }
};


/** [ displayQuizNumber ］
 * n番目の問題を「問題ｎ」と表示
 * 
 *  >id=commentを取得
 *  >変数quizNumberに初期状態の１（ｎ＋１）を加算
 *  >以降、１すつ加算される
 */
function displayQuizNumber() {
    const displayNumber = document.getElementById('comment');
    displayNumber.textContent = `問題${quizNumber + 1} `;
    quizNumber++; 
};


/** [ backHome ]
 * 
 * 「ホーム」ボタンを押下後、デフォルト画面に戻る
 *  >非表示状態のbutton要素「ホーム」を表示
 *  >クリックするとリロードされる
 */
function backHome() {
    const homeButton = document.getElementById('homeButton');
    homeButton.style.visibility = 'visible';
    homeButton.addEventListener('click', function(){
        location.reload();
    });
};



/** [ finishiQuiz ]
 * クイズが終了した後の動作
 * 
 * >正解数の合計を表示する
 * >「再度チャレンジしたい場合は以下をクリック！」と表示
 * >
 */
function finishQuiz() {
    const displayCurrectAnswer = document.getElementById('comment');
    displayCurrectAnswer.textContent = `あなたの正解数は${correctsAnswerCount}です!!`;
    const challngeAgain = document.getElementById('message');
    challngeAgain.textContent = `再度チャレンジしたい場合は以下をクリック！`;
    const deleteChoiceButton = document.getElementById('choice');
    deleteChoiceButton.textContent = '';

};


/** [ displayQuiz ]
 * クイズを表示するための処理
 * 
 * >「Index−１」はｎ問目なら「n−１」のIndexの問題が格納される（つまり現在の「問題ｎ」）
 * >「Index＋１」はｎ問目から「n＋１」問目へ（つまり次の「問題ｎ」）へ進む
 */
function displayQuiz(quizzes, index) {  //対象とする引数quizzesのindex（この場合は１０問=０〜９）

    console.log(index);

    const choices = quizzes[index - 1].incorrect_answers;   //選択肢をchoicesに格納（incorrect_answers＝不正解）
    choices.push(quizzes[index - 1].correct_answer,);   //選択肢の「正解」をchoicesに追加
    arrShuffle(choices)     //choicesarrShuffle(arr))でシャッフルした選択肢を表示する

    const messageElem = document.getElementById('message');     //問題を表示させるための「Id＝message」を取得
    const choiceElem = document.getElementById('choice');       //選択肢を表示させるため「id＝choice」を取得
    messageElem.textContent = '';   //message内を一旦初期化する
    choiceElem.textContent = '';    //choices内を一旦初期化する
    messageElem.textContent = quizzes[index - 1].question; 

    const displayCategory = document.getElementById('category');    //  「ジャンル」を表示させるため「id＝category」を取得
    displayCategory.innerHTML = `[ ジャンル ] ${quizzes[index - 1].category}`;  //各問題に対応した「category」の内容を「ジャンル」として表示

    const displayDifficulty = document.getElementById('difficulty');        //  「難易度」を表示させるため「id＝difficulty」を取得
    displayDifficulty.innerHTML = `[ 難易度 ] ${quizzes[index - 1].difficulty}`;    //各問題に対応した「difficulty」の内容を「難易度」として表示
    

    choices.forEach(function (choice) {     //問題を繰り返し表示するための関数
        const choiceButton = document.createElement('button');  //選択肢を格納するためのボタンを作成
        choiceButton.textContent = choice;  
        choiceButton.style.display = "block";   //ボタンを縦に配置       

        choiceButton.addEventListener('click', function () {    

            displayQuizNumber();

            if (index < 10) {    //indexが０➔８まで達するまでの処理
                displayQuiz(quizzes, index + 1);  //次の問題を表示
                if (choice === quizzes[index - 1].correct_answer) {    //選択した回答が「正解」だったときの処理
                    correctsAnswerCount++;  //正解した数を加算していく
                   
                }
            } else {    //１０問目＝Indexが９まで達した後の処理

                finishQuiz();

                backHome();

                displayCategory.textContent = '';
                displayDifficulty.textContent = '';
            }
        });

        choiceElem.appendChild(choiceButton);  //choiceに回答ボタンを追加していく
       
    })
};

/** [   startButtoｎ    ]
 * クイズアプリの開始
 * 
 * >「開始」ボタンを押下すると、APIの取得が始まる
 * >
 */
const startButton = document.getElementById('startButton');    
startButton.addEventListener('click', function () {    

    //「ホーム」ボタンを非表示ににしておく
    const hideHomeButton = document.getElementById('homeButton');
    hideHomeButton.style.visibility = 'hideen';

    
    fetch('https://opentdb.com/api.php?amount=10')  //  API情報を取得する
        .then(function (response) {  // 「response」にAPI情報を格納

            return response.json();   //responseをJSON形式にする
        })
        .then(function (myJson) {    //
            const quizzes = myJson.results; //「 myJson.results」の内容を「quizzes」に格納
            displayQuiz(quizzes, 1);    //  一問目＝quizzesのIndex＝０からスタートする
            displayQuizNumber(); 
           
        });
    

    /** 「開始」ボタン押下後のAPI取得中の処理
     */
    const status = document.getElementById('comment');    //  API取得中に表示
    status.textContent = '取得中';

    const message = document.getElementById('message');    //  API取得中に表示
    message.textContent = '少々お待ち下さい';   

    const hideStartButton = document.getElementById('startButton');    //  「開始」ボタンを非表示にする
    hideStartButton.style.visibility = 'hidden';

  
});





