var request = require('request');

module.exports = function(RED){
    function AuthenticateNode(config){
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', (msg)=>{
            this.key = config.key || msg.payload.key;
            this.secret = config.secret || msg.payload.secret;
            this.token = msg.payload.token;
            this.refresh_token = msg.payload.refresh_token;
            this.projecturl = config.projecturl || msg.payload.projecturl;
            this.projecturl = this.projecturl.endsWith("/") ? this.projecturl.slice(0, -1) : this.projecturl;
            if(this.token && this.refresh_token){
                this.post_data = {
                    'token':this.token,
                    'refresh_token':this.refresh_token
                };
            } else {
                this.post_data = {
                    'key':this.key,
                    'secret':this.secret
                };
            }
            this.headers = {
                'Content-Type': 'application/json'
            };
            this.opts = {
                url: this.projecturl + '/ak/authentication',
                method: 'POST',
                headers: this.headers,
                json: this.post_data
            };
            request(this.opts,(err,res,body)=>{
                if(body.token && body.refresh_token) {
                    msg.payload.token = body.token;
                    msg.payload.refresh_token = body.refresh_token;
                }
                node.send(msg);
            });
        });
    }
    RED.nodes.registerType("authenticate",AuthenticateNode);
}