//画面の管理、配列操作を行う

let partlist = []; //参加者の情報を格納 構造[{id:num, name:String, win:num, lose:num, draw:num, opps: [ids]}]
let bye = { id: 0, name: "bye", win: 0, lose: 0, opps: [] }; //不戦勝作成用のダミープレイヤー
let fileReader = new FileReader();

//マッチング関係グローバル変数
let round = 0; //ラウンド数管理
let matchids = [];
let matching = [];
let resultaccepted = 0;



//参加者リストを表にするinnerHTML文字列生成
function partlistToTable() {
    let html = "<table>";

    //ヘッダー
    html += "<tr><thead>";
    html += "<th>ID</th><th>名前</th><th>勝ち</th><th>負け</th><th>対戦相手</th>";
    html += "</tr></thead>";

    html += "<tbody>";

    //一人ずつ要素を作成    
    partlist.forEach(player => {
        html += "<tr>";

        //参加者ID、名前、勝ち、負け までのタグ生成
        html += "<td>" + player.id + "</td><td>" + player.name + "</td><td>" + player.win + "</td><td>" + player.lose + "</td>";

        //これまでの対戦相手の表示 カンマで切り分けて順番に表示する
        if (player.opps.length == 0) {
            html += "<td>未</td>"
        } else {
            let str = "";
            player.opps.forEach(opps => {
                str += opps + ", ";
            });
            str = str.substring(0, str.length - 2);
            html += "<td>" + str + "</td>";
        }

        html += "</tr>";
    });

    html += "</tbody>"

    html += "</table>";
    return html;
}


//配列をwin降順に並べて返す
function sortByWin(array) {
    array.sort(function (a, b) {
        if (a.win > b.win) {
            return -1;
        } else if (a.win < b.win) {
            return 1;
        } else {
            return 0;
        }
    });
    return array;
}


//プレイヤーidからpartlist内を参照してそのプレイヤーのOMW%を算出して返す
function calcOMW(id) {
    let player = partlist[id - 1];
    let opps = player.opps;
    let omws = 0;

    if (opps.length > 0) {
        opps.forEach(opponent => {
            if (opponent != 0) { //id=0は不戦勝なので加算の必要なし
                omws += partlist[opponent - 1].win;
            }
        });

        return Math.round(omws * 1000 / (opps.length * opps.length)) / 10; //小数点第一位で四捨五入して返す

    } else {
        return 0;
    }
}


//OMW%降順で並べ替える
function sortByOMW(array) {
    array.sort(function (a, b) {
        if (calcOMW(a.id) > calcOMW(b.id)) {
            return -1;
        } else if (calcOMW(a.id) < calcOMW(b.id)) {
            return 1;
        } else {
            return 0;
        }
    });
    return array;
}

//配列を完全ランダムにシャッフルして返す
function shuffle(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


//idが振られているボタン表示非表示を操作
function hideButton(id, boolean) {
    document.getElementById(id).hidden = boolean;
}


//結果確認ボタン(2つあるためclassを振っている)の表示を操作
function hideCheckBtn(boolean) {
    let commitbuttons = document.getElementsByClassName("checkresult");
    commitbuttons[0].hidden = boolean;
    commitbuttons[1].hidden = boolean;
}


//ファイル選択に戻る
function backToFileChoice() {
    // 各種ボタンの有効無効を元に戻す
    document.getElementById("inputcsv").disabled = false;
    document.getElementById("load").disabled = false;
    hideButton("match", true);
    hideButton("backtomatch", true);

    //入力したグローバル関数をリセット
    partlist = [];
    fileReader = new FileReader();

    document.getElementById("table").innerHTML = "";
}


// 結果確認画面、ランキング画面から結果入力に戻る
function backToInput() {
    hideButton("commitresult", true);

    //マッチング表を作成しなおす
    document.getElementById("table").innerHTML = matchingToTable(matching);
    addELToBtn();
    hideCheckBtn(false);
    hideButton("ranking", false);
    hideButton("backtomatch", true);
}

//初期状態に戻る（リロード）
function initialize() {
    if (window.confirm("初めの状態に戻ります。よろしいですか？\n(現在の参加者情報は消去されます)")) {
        location.reload();
    }
}


//バックアップ作成
function createBackUp(e) {
    // let array = [];
    // let str = arrayToCsvString(array);
    // 文字列は場合分けして作る
    let str = "";
    if (document.activeElement.id == "buplayer") {
        //round, partlistをバックアップ
        str += "0\r\n"; //バックアップのモードを1行目に
        str += round + "\r\n";
        str += partlistToCsvString(partlist);
    } else if (document.activeElement.id == "buround") {
        //round, partlist, matchids, matchingをバックアップ
    }
    writeCsv(str);
}


//文字列をcsvに書きだす
function writeCsv(string) {
    let blob = new Blob([string], { type: "text/csv" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "r" + round + "backup.csv"; //何ラウンド目のバックアップなのかでタイトルをつける
    link.click();
}


//partlistをcsvに書き込める文字列に変換
function partlistToCsvString(array) {
    let str = "id,name,win,lose,opps\r\n"; //1行目ヘッダー部分
    array.forEach(inarray => {
        //2次元目の要素を取り出してカンマで区切る
        str+=inarray.id+","+inarray.name+","+inarray.win+","+inarray.lose+",";
        inarray.opps.forEach(element => {
            str+=element+"_"; //oppsの内容は_で区切る
        });

        str += "\r\n"; // 1次元目の区切りで改行を入れる
    });

    if (str.endsWith("\r\n")) {
        str = str.slice(0, -2); //最後の要素で改行は必要ないので取り除く
    }

    return str;
}


//バックアップ読み込み画面に遷移
function goToBackup(){
    hideButton("backupin", false);
}