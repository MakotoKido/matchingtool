//汎用的なスクリプト、グローバル関数、イベント管理を記載


//グローバル関数
let partlist = []; //参加者の情報を格納 構造[{id:num, name:String, win:num, lose:num, draw:num, opps: [ids]}]
let bye = { id: 0, name: "bye", win: 0, lose: 0, draw: 0, opps: [] }; //不戦勝作成用のデータ
let fileReader = new FileReader();

//イベント管理用のオブジェクト


//csvファイルを読み込んでfileReaderに格納
function loadfile(id) {
    try {
        let fileInput = document.getElementById(id);
        let file = fileInput.files[0];

        fileReader.readAsText(file, "shift-jis");

    } catch (e) {
        alert("ファイルの読み込みに失敗しました");
    }
}


//参加者リストを表にするinnerHTML文字列生成
function partlistToTable() {
    let html = "<table>";

    //ヘッダー
    html += "<tr><thead>";
    html += "<th>ID</th><th>名前</th><th>勝ち</th><th>負け</th><th>引分</th><th>対戦相手</th>";
    html += "</tr></thead>";

    html += "<tbody>";

    //一人ずつ要素を作成    
    partlist.forEach(player => {
        html += "<tr>";

        //参加者ID、名前、勝ち、負け、引分 までのタグ生成
        html += "<td>" + player.id + "</td><td>" + player.name + "</td><td>" + player.win + "</td><td>" + player.lose + "</td><td>" + player.draw + "</td>";

        //これまでの対戦相手の表示 カンマで切り分けて順番に表示する
        if (player.opps.length == 0) {
            html += "<td>未</td>"
        } else {
            let str = "";
            player.opps.forEach(opps => {
                str += opps + ", ";
            });
            str.substring(str.length - 2, str.length);
            html += "<td>" + str + "</td>";
        }

        html += "</tr>";
    });

    html += "</tbody>"

    html += "</table>";
    return html;
}


//配列を完全ランダムにシャッフルして返す
function shuffle(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


let output = document.getElementById("fileoutput");
output.onclick = writeCsv;


//配列をcsvに書きだす
function writeCsv() {
    let array = [["参加者名"]];
    let str = arrayToCsvString(array);
    let blob = new Blob([str], {type:"text/csv"});
    let link = document.createElement("a");
    link.href= URL.createObjectURL(blob);
    link.download="template.csv";
    link.click();
}

//2次元配列をcsvに書き込める文字列に変換
function arrayToCsvString(array) {
    let str = "";
    array.forEach(inarray => {
        //2次元目の要素を取り出してカンマで区切る
        inarray.forEach(element => {
            str += element + ","
        });

        if(str.endsWith(",")){
            str = str.slice(0, -1); //2次元目の要素の最後についた,を取り除く
        }
                
        str += "\r\n"; // 1次元目の区切りで改行を入れる
    });

    if(str.endsWith("\r\n")){
        str = str.slice(0, -2); //最後の要素で改行は必要ないので取り除く
    }
    
    return str;
}