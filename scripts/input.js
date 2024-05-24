class FileMagnager{

    constructor() {
        this.jsonData = {"Wordlist":[], "Highscore":0}
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
                    this.display();
                })
            }
        }
        );
    };

    // outputに出力する
    display() {
        const output = document.getElementById("output");

        // 更新するために子ノードを削除する
        if (output.hasChildNodes()===true){
            while (output.firstChild) {
                output.removeChild(output.firstChild);
            }
        }
        //console.log(output.hasChildNodes());

        // 追加していく
        for (let _ = 0 ; _ < this.jsonData.Wordlist.length ; _++){
            const wordset = document.createElement("li");
            const word = this.jsonData.Wordlist[_].word;
            const mean = this.jsonData.Wordlist[_].mean;
            wordset.textContent = `${word} ... ${mean}`
            output.appendChild(wordset);
        }
    }

    //　dataをjsonに追加する
    inputdata() {
        const inputword = document.getElementById("entryword");
        const inputmean = document.getElementById("entrymean");
        const entrylog = document.getElementById("entrylog");
        const word = inputword.value.trim();
        const mean = inputmean.value.trim();

        if( word === "" || mean === "" ){
            alert('空白を登録することはできません！')
        }
        else {

            // データが登録済みか調べる
            const len = this.jsonData.Wordlist.length;
            let found = 0;
            for (let i = 0 ; i < len ; i++){
                if (this.jsonData.Wordlist[i].word === word){
                    found = 1;
                    break;
                }
            }

            if (found === 1){
                alert('この単語は登録済みです！')
            }
            else {
                this.jsonData.Wordlist[len]= {"word":word, "mean":mean};
                inputword.value = "";
                inputmean.value = "";
                this.display();
                entrylog.innerText = `entered: ${word} ... ${mean}`;
            }
        }
    }

    // データを削除する
    async deletedata() {
        const deleteselect = document.getElementById("deleteSelect").value;
        const deleteinput = document.getElementById('deleteInput');
        const deleted = deleteinput.value.trim();
        const deletelog = document.getElementById("deletelog");
        let found = 0;
        var deletedword;
        var deletedmean;

        if (deleteselect==="") {
            alert('カテゴリーが選択されていません！');
        }
        else if (deleted==="") {
            alert('空白を削除することはできません！');
        }
        else {
            const len = this.jsonData.Wordlist.length;
            if (deleteselect==="単語"){
                for (let i = 0 ; i < len ; i++){
                    if (this.jsonData.Wordlist[i].word === deleted){
                        deletedword = this.jsonData.Wordlist[i].word;
                        deletedmean = this.jsonData.Wordlist[i].mean;
                        this.jsonData.Wordlist.splice(i,1)
                        found = 1;
                        break;
                    }
                }

            }
            else if (deleteselect==="意味"){
                for (let i = 0 ; i < len ; i++){
                    if (this.jsonData.Wordlist[i].mean === deleted){
                        deletedword = this.jsonData.Wordlist[i].word;
                        deletedmean = this.jsonData.Wordlist[i].mean;
                        this.jsonData.Wordlist.splice(i,1)
                        found = 1;
                        break;
                    }
                }
            }
            else if (deleteselect==="番号"){
                if (deleted <= len && deleted >= 0){
                    this.jsonData.Wordlist.splice(deleted-1, 1);
                    found = 1;
                }
            }
            
            if (found === 0){
                alert("対象単語が見つかりませんでした。")
            }
            else {
                deleteinput.value = "";
                this.display()
                deletelog.innerText = `deleted: ${deletedword} ... ${deletedmean}`;
            }

        }
    }

    // データをダウンロードする
    download() {
        document.getElementById("downloadBtn").addEventListener('click', (event) => {
            var today = new Date();
            var year = today.getFullYear();
            var month = today.getMonth() + 1;
            var date = today.getDate();

            // JSON ファイルを表す Blob オブジェクトを生成
            const json = JSON.stringify(this.jsonData);
            const blob = new Blob([json], {type: 'application/json'});

            // ダミーの a 要素を生成して body 要素の最後に追加
            let dummy_a_el = document.createElement('a');
            document.body.appendChild(dummy_a_el);

            // a 要素の href 属性に Object URL をセット
            dummy_a_el.href = window.URL.createObjectURL(blob);

            // a 要素の download 属性にファイル名をセット
            dummy_a_el.download = `flashcard_${year}_${month}_${date}.json`;

            // 疑似的に a 要素をクリックさせる
            dummy_a_el.click();

            // a 要素を body 要素から削除
            document.body.removeChild(dummy_a_el);
        });
    }
};



var filemanager = new FileMagnager();

window.addEventListener('load', () => {
    filemanager.loadfile();
    filemanager.download();
});