//参加者情報の管理、画面の管理を行う

let partlist = []; //参加者の情報を格納 構造[{id:num, name:String, win:num, lose:num, draw:num, opps: [ids]}]
let bye = { id: 0, name: "bye", win: 0, lose: 0, opps: [] }; //不戦勝作成用のダミープレイヤー
let fileReader = new FileReader();


//csvファイルを読み込んでfileReaderに格納
function loadfile(id) {
    try {
        let fileInput = document.getElementById(id);
        let file = fileInput.files[0];

        fileReader.readAsText(file, "utf-8");

    } catch (e) {
        alert("ファイルの読み込みに失敗しました");
    }
}


//参加者名の配列からpartlistを初期化
function iniArray(namearrray) { //参加者名のみの1次元配列を受け取る
    let id = 1; //参加者ID初期値

    namearrray.forEach(playername => {
        if (playername != "") { //名前欄が空の場合は登録しない
            let player = {};

            //順番に要素を追加していく
            player["id"] = id; //
            id++;

            player["name"] = playername;
            player["win"] = 0;
            player["lose"] = 0;
            player["opps"] = [];

            partlist.push(player);
        }
    });
}


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

        //参加者ID、名前、勝ち、負け、引分 までのタグ生成
        html += "<td>" + player.id + "</td><td>" + player.name + "</td><td>" + player.win + "</td><td>" + player.lose + "</td>";

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


//連想配列内の要素を探してインデックスを返す 使わない気もするのでコメントアウト
// function getIndex(value, arr, prop) {
//     for(let i = 0; i < arr.length; i++) {
//         if(arr[i][prop] == value) {
//             return i;
//         }
//     }
//     return -1; //値が存在しなかったとき
// }