//マッチングを制御


//マッチング作成、表示を制御
function matchcontroller() {
    let escpartlist = []; //マッチングが確定するまでpartlistは書き換えられないようにする 
    round++;

    if (matchmode == 1 && round >= 2) {
        //トーナメントの2回戦目以降は山を崩さないため、前のラウンドの順番(≒matchids)から配列を作成
        escpartlist = pickupArray();
    } else {
        escpartlist = JSON.parse(JSON.stringify(partlist)); //参加者リストのディープコピーを作成
    }
    matching = makeMatches(JSON.parse(JSON.stringify(escpartlist))); //配列要素の消去が伴うのでここでもディープコピー

    //マッチング結果、結果入力画面を表示する
    hideButton("fileinput", true);
    hideButton("match", true);
    hideButton("matchmode", true);
    hideButton("ranking", false);
    changeTable(matchingToTable(matching));
    addELToBtn();

    //結果確認ボタンを表示、無効化（結果入力の段階で全対戦分集まったら有効になる）
    hideCheckBtn(false);
    disableCheckBtn(true);
    resultaccepted = 0;
}


// 結果表示を制御
function checkResult() {
    hideCheckBtn(true);

    //結果確認画面を表示
    changeTable(resultToTable(matching));
    hideButton("commitresult", false);
}


//配列の上から順に2つずつ取って対戦組み合わせの配列[[{}, {}], ...]を返す
function makeMatches(array) {
    let match = []; //対戦組み合わせ格納
    let index = 1;

    //トーナメント1回戦のみ参加者をランダムにし、プレイヤー数を4の倍数にしてマッチング
    if (round == 1 && matchmode == 1) {
        shuffle(array);

        let numbye = 4 - (array.length % 4) //4の倍数にするためのbyeの数
        let byeid = 0; //byeでもidをユニークにしないと不具合が生じるので変更する(負の数に広げていく)
        for (let i = 0; i < numbye; i++) {
            //最大3つなので 先頭、末尾、大体真ん中にそれぞれbyeを足す（bye同士のマッチングを防ぐ）
            if (i == 0) {
                array.unshift(JSON.parse(JSON.stringify(bye)));
                array[0].id = byeid;
                byeid--;
            } else if (i == 1) {
                array.push(JSON.parse(JSON.stringify(bye)));
                array[array.length - 1].id = byeid;
                byeid--;
            } else {
                array.splice((array.length / 2), 0, JSON.parse(JSON.stringify(bye)));
                array[array.length - 1].id = byeid;
                byeid--;
            }
        }
    }

    while (array[0] != undefined) {//arrayが空になるまでやる

        //組み合わせ対象の存在チェック
        if (array[index] != undefined) {
            //matchmodeで形式の判断
            if (matchmode == 0) {
                //スイスの場合
                shuffle(array);
                sortByWin(array);

                //隣り合うindexで対戦したことがあるかで分岐
                if (checkForeMatching(array[0].id, array[index].id)) {
                    //次のインデックスに移る
                    index++;
                    continue;
                } else {
                    match.push([array[0], array[index]]);

                    //マッチング済みの要素を削除
                    array.splice(index, 1);
                    array.shift();
                    index = 1;
                }

            } else {
                //トーナメントの場合
                //lose=0(無敗)のプレイヤーのみマッチング
                if (array[0].lose == 0) {
                    if (array[index].lose == 0) {
                        //マッチング成立
                        match.push([array[0], array[index]]);

                        //マッチング済みの要素を削除
                        array.splice(index, 1);
                        array.shift();

                    } else {
                        //以下負け
                        array.splice(index, 1);
                        continue;
                    }
                } else {
                    array.shift();
                    continue;
                }
            }


        } else {
            //組み合わせられる相手がいない場合、不戦勝(id=0)と組み合わせる
            match.push([array[0], bye]);
            array.shift();
        }
    }

    return match;
}


//第一引数の対戦IDが、第二引数の対戦相手idを持つ人の今までの対戦相手(配列opps)に存在するか(=対戦したことがあるか)のbooleanを返す
function checkForeMatching(id, checked) {
    let boolean = false;

    partlist.forEach(element => {
        if (element.id == checked) {
            if (element.opps.indexOf(String(id)) != -1) {
                boolean = true;
            }
        }
    });

    return boolean;
}


//マッチング用配列からマッチング表用HTML作成
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
                html += "<td><label><input type='radio' name='res" + player.id + "' value='勝ち'>勝ち</label><label><input type='radio' name='res" + player.id + "' value='負け'>負け</label></td>";
                html += "<td rowspan='2'><input type='button' id='" + matchid + "' value='送信'></td></tr>";

                matchids.push(matchid);
            } else {
                html += "<tr><td>" + player.id + "</td><td>" + player.name + "</td>";
                html += "<td><label><input type='radio' name='res" + player.id + "' value='勝ち'>勝ち</label><label><input type='radio' name='res" + player.id + "' value='負け'>負け</label></td></tr>";
            }
        };
        tableno++;

    });
    html += "</tbody>";

    html += "</table>";
    return html;
}

//作成した送信ボタンにacceptResultのイベントを追加
function addELToBtn() {
    matchids.forEach(matchid => {
        let element = document.getElementById(matchid)
        element.addEventListener("click", acceptResult, false);
    });
}


//tableに入力された結果を受け取ってmatchingに格納
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
    if (results[0] == "勝ち" && results[1] == "勝ち") {
        //両者勝ちは受け付けない
        alert("両者勝ちになっています。結果を入力しなおしてください。");
    } else if (results[1] == undefined) {
        //どちらかに空欄がある場合も受け付けない(0がなければ1もないので1だけでチェックは十分)
        alert("対戦者両者の結果を入力してください。");
    } else if (ids[1] <= 0 || ids[2] <= 0) {
        if (results[0] == "勝ち" || results[1] == "勝ち") {
            //bye(id<=0)に勝利の結果を与える入力も受け付けない
            alert("byeを勝ちにすることはできません。");
        }
    } else {
        //上記をクリアした結果入力と対戦相手の番号oppsをmatchingに格納(この時点では結果を確定しないので上書き可)
        for (let i = 0; i < results.length; i++) {
            matching[ids[0] - 1][i].result = results[i];
        }

        //oppsはそのラウンドで登録されていない場合のみ追加（上書き時に相手が変更になることは想定しない）
        if (matching[ids[0] - 1][0].opps.length < round) {
            matching[ids[0] - 1][0].opps.push(ids[2].slice(0, ids[2].length));
            matching[ids[0] - 1][1].opps.push(ids[1].slice(0, ids[1].length));
            resultaccepted++;
        }
        alert("結果入力を受け付けました。");

        //全対戦結果が出そろったら確認画面へ
        if (resultaccepted >= matching.length) {
            disableCheckBtn(false);
        }

    }
}


//結果確認ボタンの有効無効を操作
function disableCheckBtn(boolean) {
    let commitbuttons = document.getElementsByClassName("checkresult");
    commitbuttons[0][0].disabled = boolean;
    commitbuttons[1][0].disabled = boolean;
}


//結果入力後のmatchingから結果のみを反映した表のHTML作成
function resultToTable(array) {
    let tableno = 1; //対戦卓番号（1からカウントアップ）
    let html = "<table><caption>" + round + "回戦 対戦結果</caption>";

    // ヘッダー
    html += "<tr><thead>";
    html += "<th>対戦卓</th><th>ID</th><th>名前</th><th>結果</th>";
    html += "</tr></thead>";

    //各対戦組み合わせごとのタグを作成
    html += "<tbody>";
    array.forEach(match => {

        for (let i = 0; i < 2; i++) {
            let player = match[i];
            if (player.result == undefined) {
                alert("結果読み込み時にエラーが発生しました");
                break;
            } else {
                if (i == 0) {
                    html += "<tr><td rowspan='2'>" + tableno + "</td>";
                    html += "<td>" + player.id + "</td><td>" + player.name + "</td>";
                    html += "<td>" + player.result + "</td></tr>";
                } else {
                    html += "<tr><td>" + player.id + "</td><td>" + player.name + "</td>";
                    html += "<td>" + player.result + "</td></tr>";
                };

            }
        };
        tableno++;
    });
    html += "</tbody>";

    html += "</table>";
    return html;
}


//確定した対戦結果(matching内resultとopps)をグローバル関数partlistに反映 
function registerResult() {
    //不戦勝以外のマッチングリストにある参加者すべてについて個別に結果を反映
    matching.forEach(array => {
        array.forEach(player => {
            if (player.id != 0) {
                partlist[player.id - 1].opps = JSON.parse(JSON.stringify(player.opps));
                if (player.result == "勝ち") {
                    partlist[player.id - 1].win += 1;
                } else if (player.result == "負け") {
                    partlist[player.id - 1].lose += 1;
                }
            }
        })
    });
    alert(round + "回戦の結果を確定しました。");
    hideButton("proceed", false);
    hideButton("ranking", false);
    hideButton("commitresult", true);
}


//ラウンドで作成したmatchids, matching, resultacceptedを初期化して次ラウンドのマッチング
function proceedToNext() {
    //トナメの場合は山保存のため残しておく
    if (matchmode == 0) {
        matchids = [];
    }
    matching = [];
    resultaccepted = 0;
    hideButton("proceed", true);
    matchcontroller();
}


//マッチモードの変更を反映する
function changeMatchMode(value) {
    matchmode = value;
}

//トナメ山保存用にmatchidsからpartlistをピックアップして同じ形式の配列を生成
function pickupArray() {
    let newarray = [];
    matchids.forEach(match => {
        let ids = match.split("_");
        for (let i = 1; i < ids.length; i++) {
            if (ids[i] != 0) {
                newarray.push(JSON.parse(JSON.stringify(partlist[ids[i] - 1])));
            }
        }
    });
    matchids = [];
    return newarray
}