const express = require("express");
const app = express();
const fs = require("fs/promises");
const { Hercai } = require('hercai');
const herc = new Hercai();
const { port } = require('./config')

const messages = {
    "sa": 'Aleykümselam, nasılsın?',
    "merhaba": 'Merhaba, nasılsın?',
    "günaydın": 'Günaydın, nasılsın?',
    "nbr": 'İyidir senden naber?',
    "naber": 'İyidir senden naber?',
    "adın": 'Benim adım wondexz AI senin adın nedir?',
    "evet": "hmm.",
    "hayr": "hmm.",
    "ne yapıyorsun": 'İyiyim sen?',
    "seni seviyorum": 'Bende seni seviyorum.',
    "tatlısın": 'Ayy, sende çok tatlısın.',
    "iyi": 'Güzel.',
    "kurucu": 'Benim sahibim "wondexz".',
    "yapımcı": 'Benim yapımcım "wondexz".',
    "default": 'Hata',
};

app.get("/", (req, res) => {
    res.json({ message: "ai ile kullan mal oc" });
});

app.get("/ai/:msg", async (req, res) => {
    const msg = req.params.msg.toLowerCase();

    try {
        await mesaj_log(msg);
    } catch (error) {
        console.error(error.message);
    }

    const response = messages[msg] || messages["default"];

    if (response === messages["default"]) {
        try {
            const ai_cevap = await metod_2(msg);
            await mesaj_log(msg, ai_cevap);
            res.json({ message: ai_cevap });
        } catch (error) {
            console.error(error.message);
            res.json({ message: response });
        }
    } else {
        await mesaj_log(msg, response);
        res.json({ message: response });
    }
});


async function metod_2(msg) {
    const cevap = await herc.question({ model: "v3-beta", content: msg });
    return cevap.reply
        .replaceAll("OpenAI", "wondexz")
        .replaceAll("Herc.ai", "wondexz AI")
        .replaceAll("Herc.ai,", "wondexz AI,")
        .replaceAll("Herc.ai'nün", "wondexz AI'ın")
        .replaceAll("wondexz AI'nün", "wondexz AI'ın")
        .replaceAll("GPT-3", "GPT-4")
        .replaceAll("gpt-3", "GPT-4")
        .replaceAll("gpt-4", "GPT 4");
}

async function mesaj_log(soru, cevap) {
    const file = "sorular.txt";
    const log = `Soru: ${soru}\nCevap: ${cevap}\n\n`;

    await fs.appendFile(file, log);
}

app.listen(port || '3000', () => {
    console.log('http://localhost:'+port||'3000');
})