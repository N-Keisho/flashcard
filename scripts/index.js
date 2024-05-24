// ランダムな数の取得：関数式
// Math.randomは0~1の小数点が与えられるため、最小値からどのくらい足すかを計算している
const getRandInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// 待機処理：関数宣言
// nはミリ秒
function delay (n) {
  return new Promise (function(resolve) {
    setTimeout(resolve, n);
  });
}

class FlashCard {
  constructor() {
    this.words = [];
    this.jsonData = null;
    this.currentAnswer;
    this.correct=0;
    this.incorrects=[];
  }

  loadfile() {
    const fileSelector = document.getElementById("inputFile");
    // console.log(fileSelector)

    fileSelector.addEventListener('change', (eve) => {
        this.files = eve.target.files;
        console.log(this.files);
        if (this.files.length === 0){
            alert('ファイルが選択できていません！');
        }
        else {
            var result = this.files[0];

            var reader = new FileReader();
    
            reader.readAsText(result);
    
            reader.addEventListener('load', () => {
                this.jsonData = JSON.parse(reader.result);
            })
        }
    }
    );
  };

  async flash() {
    // console.log(this.jasonData.Wordlist)
    if (this.jsonData===null){
      alert('ファイルが選択されていません！');
    }
    else {
      this.words = [];
      const SecPerNumber = +document.getElementById("displayed-sec").value;
      const maxIndex = (this.jsonData.Wordlist.length)-1;
      const times = +document.getElementById("displayed-times").value;
      const wordDisplay = document.getElementById("display");
      const timeDisplay = document.getElementById("remainingTime");
      const problemDisplay = document.getElementById("remainingProblem");
      const answerlog = document.getElementById("answerlog")
      let remTime = SecPerNumber;
      let num;
      
      if (maxIndex+1 < times){
        alert('単語数が足りません！問題数を減らすか、単語帳に単語を追加してください。')
      }
      else {
        // ログの消去
        if (answerlog.hasChildNodes()===true){
          while (answerlog.firstChild) {
              answerlog.removeChild(answerlog.firstChild);
          }
        }

        for (let i = 0 ; i < times ; i++) {

          while(1){
            num = getRandInt(0, maxIndex);
            if (this.words.includes(num)===false) break;
          }

          this.words.push(num);
          wordDisplay.innerText = this.jsonData.Wordlist[num].word;
          problemDisplay.innerText = `${i+1}/${times}`;
          this.currentAnswer = this.jsonData.Wordlist[num].mean;

          for (remTime=SecPerNumber ; remTime > 0 ; remTime--){
            if (this.correct===1) break;
            timeDisplay.innerText = remTime.toString();
            await delay(1000);
          }

          if (this.correct === 0) {
            const logItem = document.createElement("li");
            logItem.textContent = `<答え>：${this.currentAnswer}`;
            answerlog.prepend(logItem);
            this.incorrects.push(num);
          }

          this.correct = 0;
        }
        timeDisplay.innerText = '0';
        problemDisplay.innerText = "0/0";
        wordDisplay.innerText = '';

        alert(`終了！${times}問中${times-(this.incorrects.length)}問正解だったよ！\n`)
      }
    }
  }

  answer() {
    const ansInput = document.getElementById("player-ans");
    const ans = ansInput.value.trim();
    const isCorrect = ans === this.currentAnswer;
    const answerlog = document.getElementById("answerlog")
    const logItem = document.createElement("li");
    console.log(ans, this.currentAnswer, isCorrect);
    if (ans!==''){
      if (isCorrect){
      
        logItem.textContent = `正解！：${ans}`;
        logItem.className = 'correct';
        this.correct = 1;
      }
      else {
        logItem.textContent = `不正解：${ans}`;
        logItem.className = 'incorrect';
      }
  
      answerlog.prepend(logItem);
      ansInput.value ='';
    }
  }
}

var flashcard = new FlashCard();
  window.addEventListener('load', () => {
    flashcard.loadfile();
});