var request = require('request');

module.exports = function(RED){
    function CreateNode(config){
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input',(msg)=>{
            this.resourcename = config.resourcename || msg.payload.resourcename;
            this.token = msg.payload.token;            
            this.refresh_token = msg.payload.refresh_token;   
            this.projecturl = msg.payload.projecturl || config.projecturl;      
            this.projecturl = this.projecturl.endsWith("/") ? this.projecturl.slice(0, -1) : this.projecturl;   
            this.headers = {
                'Content-Type': 'application/json',
                'Authorization': this.token
            };
            this.post_data = msg.payload.post_data;
            var opts = {
                url: this.projecturl + '/rest/' + this.resourcename,
                method: 'POST',
                headers: this.headers,
                json: this.post_data
            };
            request(opts,(err,res,body)=>{
                if(body) msg.payload.body = body;
                if(res) msg.res = res;
                if(err) msg.error = error;
                node.send(msg);
            });
        });
    }
    RED.nodes.registerType("create",CreateNode);
}