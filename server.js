var http=require('http')
var express=require('express')
var sio=require('socket.io')

var app=express()
var server=http.createServer(app)

app.get('/',function(req,res){
    res.sendfile('./index.html')
})

server.listen(80)

var io=sio.listen(server)

var visitors=[]

io.sockets.on("connection",function(socket){
    socket.on("addvisitor",function(name){
        // visitors.forEach(function(item){
        //     if(name==item){
        //         socket.emit('duplicate')
        //         return;
        //     }
        // })
        for(var i=0;i<visitors.length;i++){
            if(visitors[i]==name){
                socket.emit('duplicate');
                return;
            }
        }
        visitors.push(name)
        console.log(visitors)
        io.sockets.emit('login',name)
        io.sockets.emit('sendClients',visitors)
    })

    socket.on("removevisitor",function(name){
        visitors.forEach(function(item,index){
            if(name===item) visitors.splice(index,1)
        })
        io.sockets.emit('logout',name)
        io.sockets.emit('sendClients',visitors)
    })

    socket.on("chat",function(name,msg){
        console.log(name,msg)
        io.sockets.emit('chat',name,msg)
    })
})
