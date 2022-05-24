//参加者情報の読み込みを制御


//新規ファイルの読み込み、参加者リストの反映
function registerController() {
    //誤操作防止のため、ファイル決定後はファイル操作ボタンを無効にする
    document.getElementById("inputcsv").disabled = true;
    document.getElementById("load").disabled = true;

    loadfile("inputcsv", "UTF-8");

    //受け取ったファイルを配列に格納していく
    fileReader.onload = () => {
        //行単位で分ける（CRLFに対応）
        let playername = fileReader.result.split("\r\n");

        // ヘッダーを切り分ける
        let header = playername[0];
        playername.shift();

        iniArray(playername);

        document.getElementById("table").innerHTML = partlistToTable();
    };

    hideButton("match", false);
}


//createBackUp()で作成したcsvを読み込み
function loadBackup() {
    loadfile("inputbackup", "UTF-8");

    fileReader.onload = () => {
        //行単位で分ける（CRLFに対応）
        //round, partlistを復元
        let result = fileReader.result.split("\r\n");
        //result[0]はバックアップのモード識別用 今回は使わない
        round = result[1].slice(0, result[1].length);

        let header = result[2].split(","); //連想配列のキー
        // for*********************************************resultを2次元配列にするとこから始める
        for (let i = 3; i < result.length; i++) {
            partlist.push({});
            for (let j = 0; j < header.length; j++) {
                partlist[i-2][header[j]] = result[]
            }
        }
    }
}


//csvファイルを読み込んでfileReaderに格納
function loadfile(id, encode) {
    try {
        let fileInput = document.getElementById(id);
        let file = fileInput.files[0];

        fileReader.readAsText(file, encode);

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