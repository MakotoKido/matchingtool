//マッチングを制御するスクリプト

let escpartlist = []; //対戦結果が確定するまでpartlistではなくこちらを書き換える ラウンドごとに書き換える
let round = 0; //ラウンド数管理
let matchids = []; //対戦卓番号と対戦者のid(卓番号_対戦者1のid_対戦者2のid)を格納 結果送信のイベントリスナ付与で使う



function matchcontroller() {
    round++;
    escpartlist = partlist.slice(0, partlist.length); //sliceで実体のみをコピー

    //対戦組み合わせの作成
    escpartlist = sortByWin(shuffle(escpartlist));
    let matching = makeMatches(escpartlist); //ここで一度escpartlistが空になる
    escpartlist = partlist.slice(0, partlist.length);

    //マッチング結果を表示
    document.getElementById("fileinput").style.display = "none";
    document.getElementById("match").style.display = "none";
    document.getElementById("table").innerHTML = matchingToTable(matching);
    addELToSendBtn();
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

    let html = "<table>";

    // ヘッダー
    html += "<tr><thead><caption>" + round + "回戦 対戦組み合わせ</caption>";
    html += "<th>対戦卓</th><th>ID</th><th>名前</th><th>結果入力</th><th></th>"; //最後の空ヘッダーは送信ボタン用の列
    html += "</tr></thead>";

    //各対戦組み合わせごとのタグを作成
    html += "<tbody>";
    array.forEach(match => {

        for (let i = 0; i < match.length; i++) {
            let player = match[i];
            //対戦表の上の行に対戦卓番号、結果送信ボタンを2行分設定
            //上下共通して参加者ID、名前、結果入力フォームを設定

            if (i == 0) {
                //上の行
                let matchid = tableno + "_" + player.id + "_" + match[i + 1].id; //送信ボタンに付与するidから対戦組み合わせを識別可能
                matchids.push(matchid);

                html += "<tr><td rowspan='2'>" + tableno + "</td>"; //対戦卓番号
                html += "<td>" + player.id + "</td><td>" + player.name + "</td>"; //参加者データ
                html += "<td><label><input type='radio' name='result" + player.id + "' value='win" + player.id + "'>勝</label><label><input type='radio' name='result" + player.id + "' value='lse" + player.id + "'>負</label></td>" //結果入力ボタン valueから勝敗と参加者idを判別可能
                html += "<td rowspan='2'><button type='button' id='" + matchid + "'>送信</button></td></tr>";
            } else {
                //下の行
                html += "<tr>";
                html += "<td>" + player.id + "</td><td>" + player.name + "</td>";
                html += "<td><label><input type='radio' name='result" + player.id + "' value='win" + player.id + "'>勝</label><label><input type='radio' name='result" + player.id + "' value='lse" + player.id + "'>負</label></td>"
                html += "</tr>";
            };
        };

        tableno++;
    });
    html += "</tbody>";
    html += "</table>";

    return html;
}


//送信ボタンにイベントリスナをそれぞれ追加
function addELToSendBtn() {
    console.log(escpartlist);
    for (let i = 0; i < matchids.length; i++) {
        document.getElementById(matchids[i]).addEventListener("click", getMatchResults, false);
    }
}

//送信ボタンの結果を受け取る
function getMatchResults(e) {
    console.log(escpartlist);
    let elements = this.id.split("_"); //送信ボタンを押した対戦の卓番号、参加者id2つを要素数3の配列に分ける

    //双方の結果を取得
    let result1 = document.getElementsByName("result" + elements[1]);
    let result2 = document.getElementsByName("result" + elements[2]);

    //両者勝ちになっていないかチェック
    if (result1[0].checked && result2[0].checked) {
        alert("両者勝ちになっています。結果を入力しなおしてください。");
        result1[0].checked = false;
        result2[0].checked = false;
    } else {
        //結果を受け取る→escpartlistの配列にこのラウンドの勝敗を付け足す
        
        alert(elements[0] + "番卓の結果を受け付けました。");
    }
}