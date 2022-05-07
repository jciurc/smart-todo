const fetchDataForUser = function (url, username, callback) {
  request(url, (error, data) => {

    if (error) {
      return callback(error, null);
    }
    const usersObject = JSON.parse(data.body).users;
    let matchedUser = undefined;
    for (const user in usersObject) {
      if (user === username) {
        matchedUser = usersObject[user];
        
      }
    }
    callback(null, matchedUser);
  });
};
