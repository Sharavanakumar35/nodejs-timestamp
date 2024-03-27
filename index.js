import express from "express";
import fs from "fs";
import { format } from "date-fns";

const app = express();
const PORT = 4000;
let lastWriteTimestamp = null;

app.listen(PORT);
console.log('Server is running on port', PORT);

app.get('/', (req, res) => {
    res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>File Handling with Express</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f0f0f0;
                }
                .container {
                    max-width: 800px;
                    margin: 50px auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h1, p {
                    text-align: center;
                }
                .endpoint {
                    margin-top: 30px;
                    display: flex;
                    justify-content: space-around;
                }
                .endpoint a {
                    display: block;
                    width: 150px;
                    padding: 10px 20px;
                    text-align: center;
                    text-decoration: none;
                    color: #fff;
                    background-color: #007bff;
                    border-radius: 5px;
                    transition: background-color 0.3s ease;
                }
                .endpoint a:hover {
                    background-color: #0056b3;
                }
            </style>
        </head>
        <body>

        <div class="container">
            <h1>File Handling with Express</h1>
            <p>Use the following endpoints to interact with the server:</p>
            <div class="endpoint">
                <a href="/write">Write Timestamp</a>
                <a href="/read">Read File</a>
            </div>
        </div>

        </body>
        </html>
    `);
});


app.get('/write', (req, res) => {
    try {
        const today = format(new Date(), 'dd-MM-yyyy-HH-mm-ss');
        const filePath = `Timestamp/${today}.txt`;
        fs.writeFileSync(filePath, today, 'utf8');
        console.log('File written successfully:', filePath);
        lastWriteTimestamp = today;
        res.status(200).send('File written successfully');
    } catch (err) {
        console.error('Error writing file:', err);
        res.status(500).send('Error writing file');
    }
});

app.get('/read', (req, res) => {
    try {
        if (!lastWriteTimestamp) {
            return res.status(404).send('No timestamp available to read');
        }
        const filePath = `Timestamp/${lastWriteTimestamp}.txt`;
        const data = fs.readFileSync(filePath, 'utf8');
        console.log('File read successfully:', filePath);
        res.status(200).send(data);
    } catch (err) {
        console.error('Error reading file:', err);
        res.status(500).send('Error reading file');
    }
});
