const jwt = require('jwt-simple');
const secret = Buffer.from('64a90dc2898cc03136e22a9b3a9b730b4810e6adb92bf2e73301a0b517de3ce2f03cfdaa93b65b21178fcdd40ec3c45498528324634dda171a0daedc15c474fd', 'hex')

const JWTencode = (payload) => {
    
    var encoded = jwt.encode(payload, secret, 'HS512');

    return encoded;
};

const JWTdecode = (token) => {
    
    var decoded = jwt.decode(token, secret, false, 'HS512');

    return decoded;
};

exports.JWTencode = JWTencode;
exports.JWTdecode = JWTdecode;
