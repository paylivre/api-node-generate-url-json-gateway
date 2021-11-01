const express = require('express')
const cors = require('cors')
const argon2 = require("argon2-browser")
const { v4 } = require("uuid")

const app = express()
app.use(cors());

function getRandomHash(size) {
  const randomMerchantTransactionId = v4().replace(/-/g, "");
  return randomMerchantTransactionId.substring(0, size);
}



async function getArgon2i(dados) {
  const argon2i = await argon2
    .hash({
      pass: dados,
      salt: getRandomHash(14),
      time: 2,
      mem: 16,
      parallelism: 1,
      hashLen: 16,
      type: argon2.ArgonType.Argon2i,
    })
    .then((hash) => hash.encoded)
    .catch((e) => console.error(e.message, e.code));
  return argon2i;
}

const baseUrlPlayground = "https://playground.gateway.paylivre.com"


function getUrlGateway(DataURL, signature) {
  const merchant_transaction_id_random = getRandomHash(10)
  const base_url = DataURL.base_url? DataURL.base_url : baseUrlPlayground
  const merchant_transaction_id = `merchant_transaction_id=${merchant_transaction_id_random}`;
  const merchant_id = `merchant_id=${DataURL.merchant_id}`;
  const account_id = `account_id=${DataURL.account_id}`;
  const amount = `amount=${DataURL.amount}`;
  const currency = `currency=${DataURL.currency}`;
  const operation = `operation=${DataURL.operation}`;
  const calback_url = `callback_url=${DataURL.callback_url}`;
  const redirect_url = DataURL.redirect_url ? `&redirect_url=${DataURL.redirect_url}` : "";
  const mock_type = `type=${DataURL.type}`;
  const auto_approve = `auto_approve=${DataURL.auto_approve}`;
  const Signature = signature ? `&signature=${signature}` : "";
  const logoUrl = DataURL.logo_url ? `&logo_url=${DataURL.logo_url}` : "";

  const email = DataURL.email ? `&email=${DataURL.email}` : "";
  const document_number = DataURL.document_number
    ? `&document_number=${DataURL.document_number}`
    : "";

  const UrlGateway = `${base_url}?${merchant_transaction_id}&${merchant_id}&${operation}${email}${document_number}&${amount}&${currency}&${mock_type}&${account_id}&${calback_url}&${auto_approve}${redirect_url}${Signature}${logoUrl}`;

  return {url: UrlGateway, merchant_transaction_id: merchant_transaction_id_random};
}



function utf8_to_b64(str) {
  let bufferObj = Buffer.from(str, "utf8");
  let base64String = bufferObj.toString("base64");
  return base64String
}

async function handleGenerateData(data) {
  try {
    const dataToRequest = getUrlGateway(data);
    const valueToGetArgon2iHash = data.gateway_token + dataToRequest.url;
    const argon2iHash = await getArgon2i(valueToGetArgon2iHash);
    const signature = utf8_to_b64(argon2iHash);
    
    const urlWithSignature = {url: `${dataToRequest.url}&signature=${signature}`}

    const dataWithSignature = {
        ...data,
        merchant_transaction_id: dataToRequest.merchant_transaction_id,
        url: dataToRequest.url, signature 
    }

    return {json: dataWithSignature, url: urlWithSignature}
  } catch (error) {
    return {}
  }
  
}

app.use(express.json())

const port = process.env.PORT || 4000;
app.listen(port, ()=> console.log(`Listening on port ${port}`))


app.post('/request_json', async (req, res)=>{
  const request_data = req.body
  const dataJson = await (await handleGenerateData(request_data)).json
  res.send(dataJson)
})

app.post('/gateway_url', async (req, res)=>{
  const request_data = req.body
  const dataURL = await (await handleGenerateData(request_data)).url
  res.send(dataURL)
})
