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

class MentalMath {
  constructor() {
    this.numbers = [];
  }

  async flash() {
    this.numbers = [];
    const milliSecPerNumber = (+document.getElementById('displayed-sec').value) * 1000;
    const maxNumber = 10 ** (+document.getElementById('displayed-maxDig').value) - 1;
    const numNumvers = +document.getElementById('displayed-nums').value;
    const display = document.getElementById('display');

    for (let i = 0 ; i < numNumvers ; i++) {
      const num = getRandInt(1, maxNumber);
      this.numbers.push(num);
      display.innerText = num.toString();
      await delay(milliSecPerNumber);
    }
    
    display.innerText = '';
  }

  answer () {
    const ans = +document.getElementById('player-ans').value;
    const TrueSum = this.numbers.reduce((sum, elemnt) => sum + elemnt, 0);
    const isCorrect = ans === TrueSum;
    console.log(isCorrect);
    
    if (isCorrect){
      alert ('大正解！');
    }
    else {
      alert (`不正解。正解は ${this.numbers.join(' + ')} = ${TrueSum} でした！`)
    }
  }
}

mentalMath = new MentalMath();