//参加者の新規登録を制御
let decide = document.getElementById("decide");

function homecontroller() {
    //誤操作防止のため、ファイル決定後はファイル操作ボタンを無効にする
    document.getElementById("inputcsv").disabled = true;
    document.getElementById("decide").disabled = true;

    loadfile("inputcsv");

    //受け取ったファイルを配列に格納していく
    fileReader.onload = () => {
        //行単位で分ける（注意事項参照、CRLFに対応）
        let playername = fileReader.result.split("\r\n");

        // ヘッダーを切り分ける
        let header = playername[0];
        playername.shift();

        iniArray(playername);

        document.getElementById("table").innerHTML = partlistToTable();
    };

    document.getElementById("match").hidden = false;
}

decide.onclick = homecontroller;

//「ファイル選択に戻る」が押されたら戻る
function back() {
    // 各種ボタンの有効無効を元に戻す
    document.getElementById("inputcsv").disabled = false;
    document.getElementById("decide").disabled = false;
    document.getElementById("match").hidden = true;

    //入力したグローバル関数をリセット
    partlist = [];
    fileReader = new FileReader();

    document.getElementById("table").innerHTML = "";
}

//参加者名の配列からpartlistを初期化
function iniArray(namearrray) { //参加者名のみの1次元配列を受け取る
    let id = 1; //参加者ID初期値
    const iniresult = 0; //勝敗引き分け初期値
    let opps = []; //対戦相手ID格納用配列

    namearrray.forEach(playername => {
        if (playername != "") { //名前欄が空の場合は登録しない
            let player = {};

            //順番に要素を追加していく
            player["id"] = id; //
            id++;

            player["name"] = playername;
            player["win"] = iniresult;
            player["lose"] = iniresult;
            player["draw"] = iniresult
            player["opps"] = opps;

            partlist.push(player);
        }
    });
}