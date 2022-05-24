//参加者の新規登録を制御


function registerController() {
    //誤操作防止のため、ファイル決定後はファイル操作ボタンを無効にする
    document.getElementById("inputcsv").disabled = true;
    document.getElementById("load").disabled = true;

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

    hideButton("match", false);
}


function backToFileChoice() {
    //「ファイル選択に戻る」が押されたら戻る
    // 各種ボタンの有効無効を元に戻す
    document.getElementById("inputcsv").disabled = false;
    document.getElementById("decide").disabled = false;
    hideButton("match", true);
    hideButton("back", true);

    //入力したグローバル関数をリセット
    partlist = [];
    fileReader = new FileReader();

    document.getElementById("loadresult").innerHTML = "";
}