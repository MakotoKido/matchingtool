//ランキング表示を制御

function rankingController() {
    let ranking = listToRanking();
    changeTable(rankingToTable(ranking));

    hideCheckBtn(true);
    hideButton("ranking", true);

    //ラウンド間で表示する場合、proceedのボタンが見えている(hidden=falseのとき)
    //ラウンド中はproceedではなくマッチングを再度表示させて戻る(hidden=trueのとき)
    if(document.getElementById("proceed").hidden){
        hideButton("backtomatch", false);
    }
}


//partlistのデータから勝ち数順→OMW%順の優先度で並べ替えて配列を返す
function listToRanking() {
    let list = JSON.parse(JSON.stringify(partlist));
    sortByOMW(list);
    sortByWin(list);

    return list;
}


//ランキング順にした配列をHTMLの表にする
function rankingToTable(ranking) {
    let html = "<table><caption>ランキング</caption>";
    let rank = 1;

    //ヘッダー
    html += "<tr><thead>";
    html += "<th>順位</th><th>ID</th><th>名前</th><th>勝ち</th><th>負け</th><th>OMW%</th><th>対戦相手</th>";
    html += "</tr></thead>";

    html += "<tbody>";

    //一人ずつ要素を作成    
    ranking.forEach(player => {
        html += "<tr>";

        //順位、参加者ID、名前、勝ち、負け、OMW% までのタグ生成
        html += "<td>" + rank + "</td><td>" + player.id + "</td><td>" + player.name + "</td><td>" + player.win + "</td><td>" + player.lose + "</td><td>" + calcOMW(player.id) + "%</td>";

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
        rank++;
    });

    html += "</tbody>"

    html += "</table>";
    return html;
}