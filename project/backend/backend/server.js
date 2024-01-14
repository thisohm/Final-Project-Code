const dotenv = require('dotenv').config();
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const createError = require('http-errors');
const morgan = require("morgan");

// const jwt = require('./_helpers/jwt');
const configDb = require('./configs/config-database');
const handlerError = require('./middlewares/handler-error');

global.__basedir = __dirname;


const appSocket = express();
const serverSocket = require('http').createServer(appSocket);
const options = {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    },
    // path: "/tasana/socketio/socket.io"
};
const io = require('socket.io')(serverSocket, options);

const Video = require("./models/video.model");


global.__basedir = __dirname;


// view engine setup
app.set("view engine", "ejs");
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, './public')));

// Middleware
app.use(cookieParser());
app.use(bodyParser.json({ extended: false, limit: "2000mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "2000mb" }));
app.use(morgan((process.env.NODE_ENV==='production')? 'combined' : 'dev'));
// app.use(morgan('common'));

// CORS Middleware: allow cors requests from any origin and with credentials
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Option, Authorization')
    next()
})
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));
app.options('*', cors());

// use JWT auth to secure the api
// app.use(jwt());

app.use('/data', express.static('data'));
app.use(compression());


/* ============================= Routes ============================= */

app.get("/", (req, res) => {
    res.json({ message: "ohmohm application." });
  });



app.use('/api/user', require('./routes/user-api.routes'));

app.use('/api/org', require('./routes/organization.routes'));

app.use('/api/video', require('./routes/video.routes'));

app.use('/api/subtitle', require('./routes/subtitle.routes'));

app.use('/api/dashboard', require('./routes/dashboard.routes'));

app.use('/api/trash', require('./routes/trash.routes'));

app.use('/api/meeting', require('./routes/meeting.routes'));

/* ============================= Manage routes =================================== */

app.use('/api/manage-user', require('./routes/manage/manage-user.routes'));

app.use('/api/manage-role', require('./routes/manage/manage-role.routes'));

app.use('/api/manage-org', require('./routes/manage/manage-organization.routes'));

/* ============================= End Manage routes ================================ */

// ============================= global error handler =============================
app.use(handlerError.get404);

app.use(handlerError.get500);

// ============================= Get port from environment and store in Express. =============================
const PORT = new configDb().app.port;
app.listen(PORT || "1000", () => {
    console.log('\u{1F680} app listening on port ' + PORT + ' \u{1F525}');
})

// ============================= Socket.io =============================
/*
appSocket.get('/socket.io', (req, res) => {
    res.sendFile(__dirname + '/mocks/index.html');
})
*/

const PORT_SOCKET = new configDb().app.port_socket
serverSocket.listen(PORT_SOCKET || "1001", () => {
    console.log('Listening on port ' + PORT_SOCKET);
})

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`)

    socket.on("join_room", (room) => {
        console.log(`User Connected: ${socket.id}` + " dataInfoJoin : " + room);
        socket.join(room);
    });

    socket.on("send_message", (dataInfo) => {
        console.log(`User Connected: ${socket.id}` + " send-message datainfo: " + dataInfo.room);
        socket.broadcast.emit("receive_message", dataInfo);
        //console.log(JSON.stringify(dataInfo))
    });

    // socket.on("send_message", (dataInfo) => {
    //     console.log(`User Connected: ${socket.id}` + " send-message datainfo: " + dataInfo.room);
    //     socket.to(dataInfo.room).emit("receive_message", dataInfo);
    //     console.log(JSON.stringify(dataInfo))
    // });
    

    // socket.on('updateVideoStatus', (dataInfo) => {
    //     console.log('data: ' + dataInfo);
    //     Video.updateStatus(dataInfo)
    //     socket.broadcast.to(dataInfo.videoId).emit('videoId: ' + dataInfo.videoId + " is now " + dataInfo.videoStatusId)
    //     console.log('videoId: ' + dataInfo.videoId + " is now " + dataInfo.videoStatusId);
    //     //io.emit('updateVideoStatus', 'videoId: ' + dataInfo.videoId + " is now " + dataInfo.videoStatusId);
    // });
    
    /*socket.on('updateVideoStatus', (dataInfo) => {
        console.log('data: ' + dataInfo);
        Video.updateStatus(dataInfo)
        io.emit('updateVideoStatus', 'videoId: ' + dataInfo.videoId + " is now " + dataInfo.videoStatusId);
    });*/


    /*
    socket.on('updateVideoStatusFront', (dataInfo) => {
        io.emit('updateVideoStatusService', dataInfo);
    })

    socket.on('updateVideoStatusService', (msg) => {
        io.emit('updateVideoStatusFront', msg);
    })
    */
   
    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`)
    });
});

module.exports = app;
