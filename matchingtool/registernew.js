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

        changeTable(partlistToTable(partlist));
    };

    hideButton("match", false);
    hideButton("matchmode", false);
}


//createBackUp()で作成したcsvを読み込み
function loadBackup() {
    loadfile("inputbackup", "UTF-8");


    fileReader.onload = () => {
        //行単位で分ける（CRLFに対応）
        //partlistを復元
        let result = fileReader.result.split("\r\n");
        //result[0]はバックアップのモード識別用 今回は使わない

        let header = result[1].split(","); //連想配列のキー        
        let data = "";
        for (let i = 2; i < result.length; i++) {
            data = result[i].split(",");
            backuplist.push({});
            for (let j = 0; j < header.length; j++) {
                if (header[j] == "opps") {
                    //oppsはさらに配列に
                    let opps = data[j].split("_");
                    backuplist[i - 2][header[j]] = opps;
                    if (point == "") {
                        point = opps.length;
                    }
                } else {
                    backuplist[i - 2][header[j]] = data[j].slice(0, data[j].length);
                }

            }
        }
        changeTable(partlistToTable(backuplist));
        hideButton("backtomatch", false);
        hideButton("ranking", false);
        hideButton("confirmchange", false);
        document.getElementById("roundconfirm").innerHTML = point + "回戦時点の内容を復元";


    }
}

function confirmChange() {
    partlist = JSON.parse(JSON.stringify(backuplist));
    backuplist = [];
    round = point;
    point = "";
    hideButton("backupin", true);
    hideButton("confirmchange", true);
    hideButton("match", false);
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