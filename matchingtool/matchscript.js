//マッチングを制御

function matchcontroller() {
    let array = partlist; //マッチングが確定するまでpartlistは書き換えられないようにする

    array = shuffle(array);
    array = sortByWin(array);
    let matching = makeMatches(array);

    //マッチング結果を表示する
    document.getElementById("fileinput").style.display = "none";
    document.getElementById("match").style.display = "none";
    document.getElementById("loadresult").innerHTML = matchingToTable(matching);
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
    html += "<tr><thead>";
    html += "<th>対戦卓</th><th>ID</th><th>名前</th>";
    html += "</tr></thead>";

    //各対戦組み合わせごとのタグを作成
    html += "<tbody>";
    array.forEach(match => {

        for (let i = 0; i < 2; i++) {
            let player = match[i];
            if (i == 0) {
                html += "<tr><td rowspan='2'>" + tableno + "</td>";
                html += "<td>" + player.id + "</td><td>" + player.name + "</td></tr>";
            } else {
                html += "<tr><td>" + player.id + "</td><td>" + player.name + "</td></tr>";
            }
        };
        tableno++;

    });
    html += "</tbody>";

    html += "</table>";
    return html;
}