const QBCore = exports['qb-core'].GetCoreObject();

NPX.Procedures.register("emotes:getMeta", function () {
    var emoteMeta = {
        animSet: "default",
        expression: "default",
        quickEmotes: ["sit"]
    };
    return emoteMeta;
});

NPX.Procedures.register("emotes:setFavorite", function (pSrc, pFavorite) {
    let user = QBCore.Functions.GetPlayer(pSrc);
    let characterId = user.PlayerData.citizenid;

    const { category, index, type, value } = pFavorite;

    exports["oxmysql"].execute("SELECT id, emote_value FROM player_emotes WHERE player_id = ? AND emote_category = ? AND emote_index = ? AND emote_type = ?", [characterId, category, index, type], function (result) {
        if (result && result.length > 0) {
            if (result[0].emote_value === value) {
                exports["oxmysql"].execute("DELETE FROM player_emotes WHERE id = ?", [result[0].id], function () {
                    console.log("Deleted emote entry");
                });
            } else {
                exports["oxmysql"].execute("UPDATE player_emotes SET emote_value = ? WHERE id = ?", [value, result[0].id], function () {
                    console.log("Updated emote entry");
                });
            }
        } else {
            exports["oxmysql"].execute("INSERT INTO player_emotes (player_id, emote_category, emote_index, emote_type, emote_value) VALUES (?, ?, ?, ?, ?)", [characterId, category, index, type, value], function () {
                console.log("Inserted new emote entry");
            });
        }
    });

    return true;
});

function checkExistenceEmote(citizenId, cb) {
    exports["oxmysql"].execute("SELECT id FROM player_emotes WHERE player_id = ?", [citizenId], function (result) {
        let exists = result && result.length > 0;
        cb(exists);
    });
}

NPX.Procedures.register("emotes:getFavorites", function (pSrc) {
    let user = QBCore.Functions.GetPlayer(pSrc);
    let characterId = user.PlayerData.citizenid;

    if (!characterId) return null;

    return new Promise((resolve, reject) => {
        checkExistenceEmote(characterId, function (exists) {
            if (exists) {
                exports["oxmysql"].execute("SELECT * FROM player_emotes WHERE player_id = ?", [characterId], function (result) {
                    let emotesData = result.map(row => ({
                        category: row.emote_category,
                        index: row.emote_index,
                        type: row.emote_type,
                        value: row.emote_value
                    }));
                    resolve(emotesData);
                });
            } else {
                resolve([]);
            }
        });
    });
});
