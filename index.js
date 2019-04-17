require("dotenv").config();
const publicIp = require("public-ip");
const fs = require("fs");
const axios = require("axios");
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const pathFile = process.env.FILE_NAME;
const user = process.env.USERNAME;
const pass = process.env.PASSWORD;
const urlAPI = `https://${user}:${pass}@domains.google.com/nic/update?`;

const domains = process.env.DOMAINS.split(",");

async function updateDynamicDomain() {
  try {
    console.log(`Executado em : ${new Date().toISOString()}`);
    const fileIp = (await readFileAsync(pathFile, "utf8")).toString();
    const pblicIp = await publicIp.v4();

    if (fileIp !== pblicIp) {
      for (let i = 0; i < domains.length; i++) {
        const domain = domains[i];
        const url = `${urlAPI}hostname=${domain}&myip=${pblicIp}`;
        console.log(`Atualizacao ${domain} para IP ${pblicIp}`);
        await axios.get(url);
      }

      await writeFileAsync(pathFile, pblicIp, "utf8");
    }
  } catch (e) {
    console.log(e);
  }
}

setInterval(updateDynamicDomain, process.env.INTERVAL_MILLISECONDS);
