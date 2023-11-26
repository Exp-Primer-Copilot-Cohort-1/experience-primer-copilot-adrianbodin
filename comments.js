// Create web server

var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path'); // 파일의 확장자를 추출할 때 사용
var sanitizeHtml = require('sanitize-html'); // 사용자가 입력한 내용이 script 코드를 포함하고 있을 경우 이를 제거해 주는 모듈

var template = require('./lib/template.js');
var db = require('./lib/db.js');
var auth = require('./lib/auth.js');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query; // parse: 분석하다
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/') {
        if(queryData.id === undefined) { // queryData.id가 없는 경우
            db.query(`SELECT * FROM topic`, function(error, topics) {
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var list = template.list(topics);
                var html = template.HTML(title, list,
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>`,
                    auth.statusUI(request, response));
                response.writeHead(200);
                response.end(html);
            });
        } else { // queryData.id가 있는 경우
            db.query(`SELECT * FROM topic`, function(error, topics) {
                if(error) {
                    throw error;
                }
                db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id], function(error2, topic) {
                    if(error2) {
                        throw error2;
                    }
                    console.log(topic);
                    var title = topic[0].title;
                    var description = topic[0].description;
                    var list = template.list(topics);
                    var html = template.HTML(title, list,
                        `<h2>${sanitizeHtml(title)}</h2>
                        ${sanitizeHtml(description)}
                        <p>by ${sanitizeHtml(topic[0].name)}</p>`,
                        ` <a href="/create">create</a>
                          <a href="/update?id=${queryData.id}">update</a>
                          <form action="delete_process" method="post">
                            <