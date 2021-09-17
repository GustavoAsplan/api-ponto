class Crypt{


    static utf8_to_b64( str ) {
        return Buffer.from(str).toString('base64');
    }
    
    static b64_to_utf8( str ) {
        return Buffer.from(str, 'base64').toString();
    }
}

module.exports = Crypt