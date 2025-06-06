const { makeid } = require('./gen-id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    Browsers,
    makeCacheableSignalKeyStore
} = require('@whiskeysockets/baileys');

const { upload } = require('./mega');

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    async function GIFTED_MD_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);

        const randomItem = "Safari"; // or random browser if you want
        let sock = makeWASocket({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }))
            },
            printQRInTerminal: false,
            generateHighQualityLinkPreview: true,
            logger: pino({ level: "fatal" }),
            syncFullHistory: false,
            browser: Browsers.macOS(randomItem)
        });

        if (!sock.authState.creds.registered) {
            await delay(1500);
            num = num.replace(/[^0-9]/g, '');
            const code = await sock.requestPairingCode(num);
            if (!res.headersSent) {
                return res.send({ code });
            }
        }

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on("connection.update", async ({ connection }) => {
            if (connection === "open") {
                await delay(5000);
                let rf = __dirname + `/temp/${id}/creds.json`;

                function generateRandomText() {
                    const prefix = "3EB";
                    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                    let randomText = prefix;
                    for (let i = prefix.length; i < 22; i++) {
                        const randomIndex = Math.floor(Math.random() * characters.length);
                        randomText += characters.charAt(randomIndex);
                    }
                    return randomText;
                }

                try {
                    const mega_url = await upload(fs.createReadStream(rf), `${sock.user.id}.json`);
                    const string_session = mega_url.replace('https://mega.nz/file/', '');
                    let md = "ZARYA~MD~" + string_session;

                    let code = await sock.sendMessage(sock.user.id, { text: md });
                    let desc = `                    
╔═════════════════
║ *SESSION CONNECTED*         
╠═════════════════
║ *DAWENS BOY TECH*         
╚═════════════════
`;
                    await sock.sendMessage(sock.user.id, {
                        text: desc,
                        contextInfo: {
                            externalAdReply: {
                                title: "DAWENS BOY TECH",
                                thumbnailUrl: "https://files.catbox.moe/pbamxw.jpeg",
                                sourceUrl: "https://whatsapp.com/channel/0029Vb6T8td5K3zQZbsKEU1R",
                                mediaType: 1,
                                renderLargerThumbnail: true
                            }
                        }
                    }, { quoted: code });

                } catch (e) {
                    await sock.sendMessage(sock.user.id, { text: `❌ Erè: ${e.message}` });
                }
            }
        });
    }

    await GIFTED_MD_PAIR_CODE(); // 🔥 this was missing
});

module.exports = router;
