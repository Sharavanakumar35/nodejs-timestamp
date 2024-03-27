import express from "express";
import fs from "fs";
import { format } from "date-fns";

const app = express();
const PORT = 4000;
let lastWriteTimestamp = null;

app.listen(PORT);
console.log('Server is running on port', PORT);

app.get('/', (req, res) => {
    res.status(200).json({ message: "Hello!" });
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
