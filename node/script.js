const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');

var list_browser_command = [] ; // list of commands for the browser
var list_python_command = [] ;  // List of commands for Python
var IsReturnedPage = false;     // has the page been given away?
var TimeStampNow = Date.now() ; // timestamp now
var PidPython = 0;              // Python process pid

// Loading data on used ports
var obj_ports = require("../config/ports.json");

function onRequest_browser (req, res) {
  let urlObject = url.parse(req.url, true);

  if(urlObject.pathname == "/submituserprofile"
     && Object.keys(urlObject.query).length == 0
     && req.headers.host.split(":")[1] == String(obj_ports["br"]) 
     && req.method === 'POST'
     ) {
      let  body = '';
        
      req.on('error', function (err) {
          let date_str = new Date(Math.floor(Date.now() / 1000) * 1000)
                              .toLocaleDateString(
                              "en", 
                              { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 'hour': 'numeric', 'minute': 'numeric'}
                          ) ;
          fs.appendFileSync("logs/errors.txt", `${date_str}  ${err}\n`) ;
      });

      req.on('data', function (data) {
          body += data;
      });
      req.on('end', function () {
        let list_commands = JSON.parse(body) ;
        if(Array.isArray(list_commands)) {
          while(list_commands.length) {
            list_python_command.unshift(list_commands.pop());
          }
        }

        res.writeHead(200, {"Content-Type": "text/html"});
        res.end();
        });      
      return ;
  }


  // loading the main page
  if(urlObject.pathname == "/" 
    && Object.keys(urlObject.query).length == 0
    && req.headers.host.split(":")[1] == String(obj_ports["br"]) 
     ) {
    const data = fs.readFileSync(__dirname  + "\\..\\html\\index.html", 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('charset', 'utf-8');
    if(IsReturnedPage) {  // re-requesting the page, you need to terminate the process
      const data = "<script>window.document.write('<h1>Closed</h1>')</script>"
      res.write(data);
      res.end();
      list_python_command.unshift({'com': 'exit'});
      setTimeout(function() {
          if(Number.isInteger(PidPython) && PidPython > 0) {
            try {
              process.kill(PidPython);
            } catch (error) {}
          }
          process.exit();
        },
        3000
      );
      return;
    }
    else {  // return of page content
      IsReturnedPage = true;  // setting the page return flag
      res.write(data.replace("timeStampStart: 0,", `timeStampStart: ${TimeStampNow},`));
      res.end();
      return ;
    }
  }

  // uploading a shared photo of your interlocutor
  if(urlObject.pathname == "/avatar.png"
     && req.headers.host.split(":")[1] == String(obj_ports["br"])) {
    const data = fs.readFileSync(__dirname  + "\\..\\config\\avatar.png");
    res.setHeader('Content-Type', 'image/png');
    res.write(data);
    res.end();
    return;
  }

  // loading closing image
  if(urlObject.pathname == "/close.png"
     && req.headers.host.split(":")[1] == String(obj_ports["br"])) {
    const data = fs.readFileSync(__dirname  + "\\..\\config\\close.png");
    res.setHeader('Content-Type', 'image/png');
    res.write(data);
    res.end();
    return;
  }

  // loading favicon.png
  if(urlObject.pathname == "/favicon.ico"
     && req.headers.host.split(":")[1] == String(obj_ports["br"])) {
    const data = fs.readFileSync(__dirname  + "\\..\\config\\favicon.png");
    res.setHeader('Content-Type', 'image/png');
    res.write(data);
    res.end();
    return;
  }

  // loading StartVC.png
  if(urlObject.pathname == "/StartVC.png"
     && req.headers.host.split(":")[1] == String(obj_ports["br"])) {
    let name_file = __dirname  + `\\..\\docs\\${urlObject.pathname.substr(1)}` ;
    if(! fs.existsSync(name_file)) {
      res.writeHead(404, {"Content-Type": "image/png"});
    } else {
      const data = fs.readFileSync(
                        name_file
                      );
      res.setHeader('Content-Type', 'image/png');
      res.write(data);
    }
    res.end();    
    return;
  }

  // loading VCabs.png
  if(urlObject.pathname == "/VCabs.png"
     && req.headers.host.split(":")[1] == String(obj_ports["br"])) {
    let name_file = __dirname  + `\\..\\docs\\${urlObject.pathname.substr(1)}` ;
    if(! fs.existsSync(name_file)) {
      res.writeHead(404, {"Content-Type": "image/png"});
    } else {
      const data = fs.readFileSync(
                      name_file
                    );
      res.setHeader('Content-Type', 'image/png');
      res.write(data);
    }
    res.end();    
    return;
  }

  // loading VCabsDef.png
  if(urlObject.pathname == "/VCabsDef.png"
     && req.headers.host.split(":")[1] == String(obj_ports["br"])) {
    let name_file = __dirname  + `\\..\\docs\\${urlObject.pathname.substr(1)}` ;
    if(! fs.existsSync(name_file)) {
      res.writeHead(404, {"Content-Type": "image/png"});
    } else {
      const data = fs.readFileSync(
                        name_file
                      );
      res.setHeader('Content-Type', 'image/png');
      res.write(data);
    }
    res.end();    
    return;
  }

  // loading delimiter.jpg
  if(urlObject.pathname == "/delimiter.jpg"
     && req.headers.host.split(":")[1] == String(obj_ports["br"])) {
    let name_file = __dirname  + `\\..\\docs\\${urlObject.pathname.substr(1)}` ;
    if(! fs.existsSync(name_file)) {
      res.writeHead(404, {"Content-Type": "image/jpeg"});
    } else {    
      const data = fs.readFileSync(
                        name_file
                      );
      res.setHeader('Content-Type', 'image/jpeg');
      res.write(data);
    }
    res.end();    
    return;
  }

  // Uploading a config image for the language.
  if(/^\/[a-z]{2}\/config\.jpg$/.exec(urlObject.pathname)) {
    let name_file = __dirname + `\\..\\docs\\${urlObject.pathname.substr(1)}` ;
    if(! fs.existsSync(name_file)) {
      res.writeHead(404, {"Content-Type": "image/jpeg"});
    } else { 
      const data = fs.readFileSync(
                        name_file
                      );
      res.setHeader('Content-Type', 'image/jpeg');
      res.write(data);      
    }
    res.end();
    return;    
  }

  // Loading image of new interlocutor's section.
  if(/^\/[a-z]{2}\/newprofile\.jpg$/.exec(urlObject.pathname)) {
    let name_file = __dirname  + `\\..\\docs\\${urlObject.pathname.substr(1)}` ;
    if(! fs.existsSync(name_file)) {
      res.writeHead(404, {"Content-Type": "image/jpeg"});
    } else { 
      const data = fs.readFileSync(
                        name_file
                      );
      res.setHeader('Content-Type', 'image/jpeg');
      res.write(data);      
    }
    res.end();
    return;    
  }

  // Loading image for help section.
  if(/^\/[a-z]{2}\/help\.jpg$/.exec(urlObject.pathname)) {
    let name_file = __dirname  + `\\..\\docs\\${urlObject.pathname.substr(1)}` ;
    if(! fs.existsSync(name_file)) {
      res.writeHead(404, {"Content-Type": "image/jpeg"});
    } else { 
      const data = fs.readFileSync(
                        name_file
                      );
      res.setHeader('Content-Type', 'image/jpeg');
      res.write(data);      
    }
    res.end();
    return;    
  }

  // Picture of the exit button.
  if(/^\/[a-z]{2}\/exit\.jpg$/.exec(urlObject.pathname)) {
    let name_file = __dirname  + `\\..\\docs\\${urlObject.pathname.substr(1)}` ;
    if(! fs.existsSync(name_file)) {
      res.writeHead(404, {"Content-Type": "image/jpeg"});
    } else { 
      const data = fs.readFileSync(
                        name_file
                      );
      res.setHeader('Content-Type', 'image/jpeg');
      res.write(data);      
    }
    res.end();
    return;    
  }

  // Picture list of interlocutors.
  if(/^\/[a-z]{2}\/listinter\.jpg$/.exec(urlObject.pathname)) {
    let name_file = __dirname  + `\\..\\docs\\${urlObject.pathname.substr(1)}` ;
    if(! fs.existsSync(name_file)) {
      res.writeHead(404, {"Content-Type": "image/jpeg"});
    } else { 
      const data = fs.readFileSync(
                        name_file
                      );
      res.setHeader('Content-Type', 'image/jpeg');
      res.write(data);      
    }
    res.end();
    return;    
  }

  // Image of the interlocutor's chat history.
  if(/^\/[a-z]{2}\/histmess\.jpg$/.exec(urlObject.pathname)) {
    let name_file = __dirname  + `\\..\\docs\\${urlObject.pathname.substr(1)}` ;
    if(! fs.existsSync(name_file)) {
      res.writeHead(404, {"Content-Type": "image/jpeg"});
    } else { 
      const data = fs.readFileSync(
                        name_file
                      );
      res.setHeader('Content-Type', 'image/jpeg');
      res.write(data);      
    }
    res.end();
    return;    
  }

  // Image of clearing the chat history of the interlocutor.
  if(/^\/[a-z]{2}\/clearhist\.jpg$/.exec(urlObject.pathname)) {
    let name_file = __dirname  + `\\..\\docs\\${urlObject.pathname.substr(1)}` ;
    if(! fs.existsSync(name_file)) {
      res.writeHead(404, {"Content-Type": "image/jpeg"});
    } else { 
      const data = fs.readFileSync(
                        name_file
                      );
      res.setHeader('Content-Type', 'image/jpeg');
      res.write(data);      
    }
    res.end();
    return;    
  }

  // Image of deleting an interlocutor.
  if(/^\/[a-z]{2}\/delinter\.jpg$/.exec(urlObject.pathname)) {
    let name_file = __dirname  + `\\..\\docs\\${urlObject.pathname.substr(1)}` ;
    if(! fs.existsSync(name_file)) {
      res.writeHead(404, {"Content-Type": "image/jpeg"});
    } else { 
      const data = fs.readFileSync(
                        name_file
                      );
      res.setHeader('Content-Type', 'image/jpeg');
      res.write(data);      
    }
    res.end();
    return;    
  }

  // Interlocutor's profile picture.
  if(/^\/[a-z]{2}\/profinter\.jpg$/.exec(urlObject.pathname)) {
    let name_file = __dirname  + `\\..\\docs\\${urlObject.pathname.substr(1)}` ;
    if(! fs.existsSync(name_file)) {
      res.writeHead(404, {"Content-Type": "image/jpeg"});
    } else { 
      const data = fs.readFileSync(
                        name_file
                      );
      res.setHeader('Content-Type', 'image/jpeg');
      res.write(data);      
    }
    res.end();
    return;    
  }


  // uploading a photo of the interlocutor
  let img_short_path = []
  if(img_short_path = urlObject.pathname.match(/^\/(([1-9][0-9]*)\.png)$/)) {
    img_short_path = __dirname  + `\\..\\talks\\${img_short_path[2]}\\${img_short_path[1]}` ;
    if (fs.existsSync(img_short_path)) {
      const data = fs.readFileSync(img_short_path);
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Expires', 'Wed, 21 Oct 2015 07:28:00 GMT');  // expiration date added
      res.write(data);
      res.end();
      return;
    } else {
      res.writeHead(404, {"Content-Type": "image/png"});
      res.end();
      return;      
    }
  }

  // Data filling for Python
  if(urlObject.pathname == "/" 
    && Object.keys(urlObject.query).length == 1
    && Object.keys(urlObject.query)[0] == 'q'
    && req.headers.host.split(":")[1] == String(obj_ports["br"]) 
     ) {
      let list_commands = JSON.parse(urlObject.query['q']) ;
      if(Array.isArray(list_commands)) {
        while(list_commands.length) {
          list_python_command.unshift(list_commands.pop());
        }
      }
  }

  // generating data for the browser
  let resp_data = [] ;
  
  while(list_browser_command.length){
    resp_data.unshift(list_browser_command.pop());
  }

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('charset', 'utf-8');
  res.write(JSON.stringify(resp_data))
  res.end();
}

// Receiving data from Python and passing it to an array for the browser
function onRequest_python (req, res) {
  if(req.method === 'POST') {   // This is a POST method.
        let  body = '';
        
        req.on('error', function (err) {
          let date_str = new Date(Math.floor(Date.now() / 1000) * 1000)
                              .toLocaleDateString(
                              "en", 
                              { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 'hour': 'numeric', 'minute': 'numeric'}
                          ) ;
          fs.appendFileSync("logs/errors.txt", `${date_str}  ${err}\n`) ;
        });

        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
            body = JSON.parse(body)
            Object.keys(body).forEach((key_in) => { 
              let Obj_tmp = {};
              Obj_tmp[key_in] = JSON.stringify(body[key_in]);
              list_browser_command.push(Obj_tmp);
            }) ;
        });
  }
  else if(req.method === 'GET') { // This is a GET method.
    let urlObject = url.parse(req.url, true);
    Object.keys(urlObject.query).forEach((key_in) => {  
      let Obj_tmp = {};
      Obj_tmp[key_in] = urlObject.query[key_in];
      list_browser_command.push(Obj_tmp);
    });
  }

  // Filling a command array with data for Python
  let resp_data = [] ;

  while(list_python_command.length){
    resp_data.unshift(list_python_command.pop());
  }
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('charset', 'utf-8');
  res.write(JSON.stringify(resp_data))
  res.end();
}


// Listen to 2 ports: PortBrowser and Port Python
http.createServer(onRequest_browser).listen(obj_ports["br"]); // PortBrowser
http.createServer(onRequest_python).listen(obj_ports["py"]);  // PortPython

// Loading data about the browser being used and starting the browser
var obj_browsers = require("../config/browsers.json");
var exec = require('child_process').exec;

exec(`start ${obj_browsers["list"][obj_browsers["default"]]} "http://localhost:${obj_ports["br"]}/"`)

// Running a Python script
process.chdir('..');
const { spawn } = require('child_process');  
var ProcPy = spawn(".env\\Scripts\\python.exe", ["run10.py"]);
ProcPy.stdout.on('data', function (chunk) {
      let chunk2 = chunk.toString() ;
      let date_str = new Date(Math.floor(Date.now() / 1000) * 1000)
                          .toLocaleDateString(
                          "en", 
                          { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 'hour': 'numeric', 'minute': 'numeric'}
                        ) ;
      fs.appendFileSync("logs/logs.txt", `${date_str}  ${chunk2}\n`) ;
  });

ProcPy.stderr.on('data', function (chunk) {
      let chunk2 = chunk.toString().trim() ;
      let date_str = new Date(Math.floor(Date.now() / 1000) * 1000)
                          .toLocaleDateString(
                          "en", 
                          { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 'hour': 'numeric', 'minute': 'numeric'}
                        ) ;
      if(chunk2.indexOf("Loading checkpoint shards:") == -1
         && chunk2.indexOf("frames/s") == -1
        ) {
        if(chunk2.length) {
          fs.appendFileSync("logs/errors.txt", `${date_str}  ${chunk2}\n`) ;
        }
      }
  });
PidPython = ProcPy.pid; // identify the pip python process