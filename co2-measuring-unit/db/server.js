const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const mqtt = require('mqtt');
const config = require('./config');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection(config.db);

db.connect((err) => {
    if (err) {
        console.error("Database connection failed: ", err);
    } else {
        console.log("Connected to MariaDB!");
    }
});

const brokerUrl = config.mqtt.brokerUrl;
const port = 8883;

const mqttClient = mqtt.connect(brokerUrl, {
    port: port,
    username: config.mqtt.username,
    password: config.mqtt.password,
});
mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker at HiveMQ Cloud');
    mqttClient.subscribe('home/sensor/data', (err) => {
        if (err) {
            console.error('Failed to subscribe to topic:', err);
        } else {
            console.log('Subscribed to home/sensor/data');
        }
    });
});
mqttClient.on('message', (topic, message) => {
    const data = JSON.parse(message.toString());
    console.log('Received data:', data);
    const { co2, temperature, humidity } = data;
    const query = 'INSERT INTO climate_data (carbon, temperature, humidity) VALUES (?, ?, ?)';
    db.query(query, [co2, temperature, humidity], (err) => {
        if (err) {
            console.error('Error saving data to the database:', err);
        } else {
            console.log('Data saved to the database');
        }
    });
});
app.get('/climate_data', (req, res) => {
    db.query('SELECT * FROM climate_data', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
