const express = require("express");
const cors = require("cors");
const net = require('net');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server);

const db = require('./initDatabase');

const tcpServer = net.createServer((socket) => {
    console.log('Client connected');

    socket.on('data', (data) => {
        try {
            const parsedData = JSON.parse(data.toString());
            console.log('Received data:', parsedData);

            const now = new Date();
            const formattedDateTime = now.toLocaleString('sv-SE', { timeZone: 'Europe/Prague' }).replace('T', ' ').substring(0, 19);

            const { co2, temperature, humidity } = parsedData;

            // Insert data into the database
            const query = 'INSERT INTO climate_data (datetime, carbon, temperature, humidity) VALUES (?, ?, ?, ?)';
            db.run(query, [formattedDateTime, co2, temperature, humidity], (err) => {
                if (err) {
                    console.error('Error saving data to the database:', err);
                } else {
                    console.log('Data saved to the database');
                    io.emit('new-data', { datetime: formattedDateTime, carbon: co2, temperature, humidity });
                }
            });
        } catch (error) {
            console.error('Error parsing data:', error);
        }
    });

    socket.on('end', () => {
        console.log('Client disconnected');
    });

    socket.on('error', (err) => {
        console.error('Error:', err.message);
    });
});

const tcpPort = 1883;
tcpServer.listen(tcpPort, () => {
    console.log(`TCP Server listening on port ${tcpPort}`);
});

app.get('/climate_data', (req, res) => {
    db.all('SELECT * FROM climate_data', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});