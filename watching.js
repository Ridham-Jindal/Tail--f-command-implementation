const fs = require('fs');
const events = require("events");
const lines_req = 10;
const st = require('buffer');
const watchFile = "read.log";
const buffer = new Buffer.alloc(st.constants.MAX_STRING_LENGTH);


class Watching extends events.EventEmitter{
    constructor(watchFile)
    {
        super();
        this.watchFile = watchFile;
        this.store = [];
    }
    getLogs()
    {
        return this.store;
    }
    watch(curr,prev)
    {
        const watcher = this;
        fs.open(this.watchFile,(err,fd)=>{
            if(err)
            {
                throw(err);
                console.log(err);
            }
            let data = '';
            let logs = [];
            fs.read(fd,buffer,0,buffer.length,0,(err,bytesRead)=>{
                if(err)
                {
                    throw(err);
                    console.log(err);
                }
                if(bytesRead>0)
                {
                    data = buffer.slice(0,bytesRead).toString();
                    logs = data.split('\n').slice(1);
                    console.log(logs.length);
                    // logs.slice(-10).forEach((elem)=> this.store.push(elem));
                    if(logs.length>=lines_req)
                    {
                        console.log(logs.length);
                        logs.slice(-10).forEach((elem)=> this.store.push(elem));
                        // for(let i = logs.length-1;i>=logs.length-11;i--)
                        // {
                        //     this.store.push(logs[i]);
                        // }
                    }
                    else{
                        logs.forEach((elem)=> {
                            if(this.store.length==lines_req)
                            {
                                console.log("cannot read more");
                                this.store.shift();
                            }
                            this.store.push(elem);
                        });
                    }
                    watcher.emit("process",logs);
                }
            })
        })
    }
    start()
    {
        var watcher = this;
        fs.open(this.watchFile,(err,fd)=>{
            if(err)
            {
                throw(err);
                console.log(err);
            }
            let data = '';
            let logs = [];
            fs.read(fd,buffer,0,buffer.length,0,(err,bytesRead)=>{
                if(err)
                {
                    throw(err);
                    console.log(err);
                }
                if(bytesRead>0)
                {
                    data = buffer.slice(0,bytesRead).toString();
                    logs = data.split('\n');
                    this.store = [];
                    logs.slice(-10).forEach((elem)=> this.store.push(elem));
                }
                fs.close(fd);
            })
            fs.watchFile(this.watchFile,{"interval":1000},function(curr,prev){
                watcher.watch(curr,prev);
            });
        });
    }
}

module.exports = Watching;