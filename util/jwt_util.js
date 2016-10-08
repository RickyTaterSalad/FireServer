var jwt = require('jsonwebtoken');

var secretKey = function(){
   return 'shhhhh';
};
var generateToken = function(user){
    if(!user){
        return null;
    }
    return jwt.sign({
        _id: user._id,
        id: user._id,
        firstName: user.firstName,
        photo: user.photo,
        lastName: user.lastName,
        platoon: user.platoon,
        department: user.department,
        assignHireCode: user.assignHireCode,
        station: user.station,
        rank: user.rank

    },secretKey());
};
var decode = function(token){
   return jwt.verify(token,secretKey());

};


module.exports = {
    generateToken:generateToken,
    decode:decode,
    secretKey:secretKey

};