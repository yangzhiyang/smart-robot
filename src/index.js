#!/usr/bin/env node
let colors = require('./color'),
    readline = require('readline'),
    http = require('http');

const API_KEY = 'c45036d1e0854369bd9bb99db378e1ff';

const response = {
    text: 100000,
    link: 200000,
    news: 302000
}
      

function welcome(){
    let welcomeMsg = '请开始你的表演';
    //for(let i = 0;i<welcomeMsg.length;i++){
    //    colors.colorLog('----------',welcomeMsg[i],'----------')
    //}
    Array.prototype.forEach.call(welcomeMsg,(it)=>{
        colors.colorLog('----------',it,'----------')
    })
}
welcome();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let name = '';

rl.question('> 阁下尊姓大名：',(callback)=>{
    name = callback;
    colors.colorLog(`${name}你好,请客官提问!`);
    ask();

})
function ask(){
    rl.question('> 请输入你的问题：',(qusetion)=>{
        if(!qusetion){
            process.exit(0);
            colors.colorLog('客官请慢走')
        }
        let req = http.request({
            hostname:'www.tuling123.com',
            path: '/openapi/api',
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            }
        },(res) =>{
            let data = '';
            res.on('data', (chunk)=>{
                data += chunk;
            });
            res.on('end',()=>{
                colors.colorLog(handleResponse(data));
                ask();
            })
        });
        req.write(JSON.stringify({
            key: API_KEY,
            info: qusetion,
            userid: name
        }));
        req.end();
    })
}
function handleResponse(data){
    let res =JSON.parse(data);
    switch(res.code){
        case response.text:
            return res.text;
        case response.link:
            return `${res.text}: ${res.url}`;
        case response.news:
            let listInfo = '';
            (res.list||[]).forEach((it)=>{
                listInfo += `\n文章： ${it.article}\n来源：${it.source}\n链接：${it.detailurl}`;
            })
            return `${res.text}\n${listInfo}`;
        default:
            return res.text;
    }
}