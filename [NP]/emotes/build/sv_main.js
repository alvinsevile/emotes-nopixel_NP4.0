function checkExistenceFavorite(id, cb) {
    exports["np-db"].execute("SELECT id FROM characters WHERE id = :id LIMIT 1;", { id: id }, function (result) {
        let exists = result && result[0] ? true : false;
        cb(exists);
    });
}

NPX.Procedures.register("emotes:getMeta", function () {
    var emoteMeta = {
        animSet: "default",
        expression: "default",
        quickEmotes: ["sit"]
    };
    return emoteMeta;
});

NPX.Procedures.register("emotes:getFavorites", function (pSrc) {
    let user = exports["np-lib"].getCharacter(pSrc);
    let characterId = user.id;
  
    if (!characterId) return null;
  
    return new Promise((resolve, reject) => {
      exports["np-db"].execute("SELECT * FROM characters WHERE id = :id", { 'id': characterId }, function (result) {
        if (result !== null && result.length > 0) {
          let emotesData = JSON.parse(result[0].emotes)
          resolve(emotesData);
        } else {
          resolve(false);
        }
      });
    });
  });

NPX.Procedures.register("emotes:setFavorite", function (pSrc, pFavorite) {
    let user = exports["np-lib"].getCharacter(pSrc);
    let characterId = user.id;

    const favorites = JSON.stringify(pFavorite);

    checkExistenceFavorite(characterId, function (exists) {
        let data = {
            emotes: favorites
        };

        let values = {
            "id": characterId,
            "emotes": data.emotes
        };

        if (!exists) {
            let cols = "id, emotes";
            let vals = ":id, :emotes";

            exports["np-db"].execute(`INSERT INTO characters (${cols}) VALUES (${vals})`, values, function () {
            });

            return;
        }

        let set = "emotes = :emotes";
        exports["np-db"].execute(`UPDATE characters SET ${set} WHERE id = :id`, values);
    });
    return true;
});
