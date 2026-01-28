import http from 'node:http'


const PORT = 3000;
const HOSTNAME = 'localhost';

const server = http.createServer((req,res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json')
    res.end("Hello, guys things will get messy")
})


server.listen(PORT,HOSTNAME,()=>{
    console.log(`server running on: http://${HOSTNAME}:${PORT}`);
})