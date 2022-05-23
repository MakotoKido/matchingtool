//マッチングを制御

let round = 0; //ラウンド数管理
let escpartlist = []; //マッチングが確定するまでpartlistは書き換えられないようにする 
let matchids = [];
let matching = [];

function matchcontroller() {
    round++;

    escpartlist = partlist.slice(0, partlist.length); //実体をコピー
    escpartlist = shuffle(escpartlist);
    escpartlist = sortByWin(escpartlist);
    matching = makeMatches(escpartlist.slice(0, escpartlist.length));

    //マッチング結果を表示する
    document.getElementById("fileinput").style.display = "none";
    document.getElementById("match").style.display = "none";
    document.getElementById("table").innerHTML = matchingToTable(matching);

    addELToBtn();
}

//配列をwin降順に並べて返す
function sortByWin(array) {
    array.sort(function (a, b) {
        if (a.win > b.win) {
            return 1;
        } else if (a.win < b.win) {
            return -1;
        } else {
            return 0;
        }
    });
    return array;
}


//配列の上から順に2つずつ取って対戦組み合わせの配列[[{}, {}], ...]を返す
function makeMatches(array) {
    let matching = []; //対戦組み合わせ格納

    while (array[0] != undefined) {//arrayが空になるまでやる
        let index = 1;//組み合わせ対象のインデックス

        //組み合わせ対象の存在チェック
        if (array[index] != undefined) {

            //隣り合うindexで対戦したことがあるかで分岐
            if (checkForeMatching(array[0].id, array[index].id)) {
                //次のインデックスに移る
                index++;
                continue;
            } else {
                matching.push([array[0], array[index]]);

                //マッチング済みの要素を削除
                array.splice(index, 1);
                array.shift();
            }
        } else {
            //組み合わせられる相手がいない場合、不戦勝(id=0)と組み合わせる
            matching.push([array[0], bye]);
            array.shift();
        }
    }

    return matching;
}


//第一引数の対戦IDが、第二引数の対戦相手idを持つ人の今までの対戦相手(配列opps)に存在するか(=対戦したことがあるか)のbooleanを返す
function checkForeMatching(id, checked) {
    let boolean = false;

    partlist.forEach(element => {
        if (element.id == checked) {
            if (element.opps.indexOf(id) != -1) {
                boolean = true;
            }
        }
    });

    return boolean;
}


//マッチング用配列からマッチング表用innerHTML作成
function matchingToTable(array) {
    let tableno = 1; //対戦卓番号（1からカウントアップ）
    let html = "<table><caption>" + round + "回戦対戦組み合わせ</caption>";

    // ヘッダー
    html += "<tr><thead>";
    html += "<th>対戦卓</th><th>ID</th><th>名前</th><th>勝ち負け</th><th></th>";//最後のヘッダーは送信ボタン用
    html += "</tr></thead>";

    //各対戦組み合わせごとのタグを作成
    html += "<tbody>";
    array.forEach(match => {

        for (let i = 0; i < 2; i++) {
            let player = match[i];
            if (i == 0) {
                let matchid = tableno + "_" + player.id + "_" + match[i + 1].id;

                html += "<tr><td rowspan='2'>" + tableno + "</td>";
                html += "<td>" + player.id + "</td><td>" + player.name + "</td>";
                html += "<td><label><input type='radio' name='res" + player.id + "' value='win'>勝ち</label><label><input type='radio' name='res" + player.id + "' value='lose'>負け</label></td>";
                html += "<td rowspan='2'><input type='button' id='" + matchid + "' value='送信'></td></tr>";

                matchids.push(matchid);
            } else {
                html += "<tr><td>" + player.id + "</td><td>" + player.name + "</td>";
                html += "<td><label><input type='radio' name='res" + player.id + "' value='win'>勝ち</label><label><input type='radio' name='res" + player.id + "' value='lose'>負け</label></td></tr>";
            }
        };
        tableno++;

    });
    html += "</tbody>";

    html += "</table>";
    return html;
}

//作成した送信ボタンにイベントを追加
function addELToBtn() {
    matchids.forEach(matchid => {
        let element = document.getElementById(matchid)
        element.addEventListener("click", acceptResult, false);
    });
}


//tableに入力された結果を受け取る
function acceptResult(e) {
    let ids = this.id.split("_"); //[tableno, 対戦者1のid, 対戦者2のid]
    let results = [];//対戦者1, 対戦者2の結果を格納

    //入力をresultsに格納
    for (let i = 1; i < ids.length; i++) {
        let element = document.getElementsByName("res" + ids[i]);
        for (let j = 0; j < 2; j++) {
            if (element[j].checked) {
                results.push(element[j].value);
            }
        }
    }

    //入力の制御
    if (results[0] == "win" && results[1] == "win") {
        //両者勝ちは受け付けない
        alert("両者勝ちになっています。結果を入力しなおしてください。");
    } else if (results[1] == undefined) {
        //どちらかに空欄がある場合も受け付けない
        alert("対戦者両者の結果を入力してください。");
    } else if (ids[2] == 0 && results[1] == "win") {
        //bye(id=0)に勝利の結果を与える入力も受け付けない
        alert("byeを勝ちにすることはできません。");
    } else {
        //上記をクリアした結果入力と対戦相手の番号oppsをmatchingに格納(この時点では結果を確定しないので上書き可)
        for (let i = 0; i < results.length; i++) {
            matching[ids[0] - 1][i].result = results[i];
        }
        //このままだと上書き時無限にoppsが追加されていくのでround数で判定を作る
        matching[ids[0] - 1][0].opps.push(ids[2].slice(0, ids[2]));
        matching[ids[0] - 1][1].opps.push(ids[1].slice(0, ids[1]));
    }

    alert("")
}


//確定した結果をグローバル関数partlistに反映
function registerResult() {

}