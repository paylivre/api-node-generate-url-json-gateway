const express = require('express')
const argon2 = require("argon2-browser")
const { v4 } = require("uuid")
const gateway_token = "teste"

const app = express()

function getRandomMerchantTransactionId() {
  const randomMerchantTransactionId = v4().replace(/-/g, "");
  return randomMerchantTransactionId.substring(0, 10);
}


async function getArgon2i(dados) {
  const argon2i = await argon2
    .hash({
      pass: dados,
      salt: "dZk8N6kUaA32XCsS",
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


function getUrlGateway(DataURL, signature) {
  const merchant_transaction_id_random = getRandomMerchantTransactionId()
  const base_url = "https://dev.gateway.paylivre.com"
  const merchant_transaction_id = `merchant_transaction_id=${merchant_transaction_id_random}`;
  const merchant_id = `merchant_id=${DataURL.merchant_id}`;
  const account_id = `account_id=${DataURL.account_id}`;
  const amount = `amount=${DataURL.amount}`;
  const currency = `currency=${DataURL.currency}`;
  const operation = `operation=${DataURL.operation}`;
  const calback_url = `callback_url=${DataURL.callback_url}`;
  const redirect_url = `redirect_url=${DataURL.redirect_url}`;
  const mock_type = `type=${DataURL.type}`;
  const mock_auto_approve = `auto_approve=${DataURL.auto_approve}`;
  const Signature = signature ? `&signature=${signature}` : "";

  const email = DataURL.email ? `&email=${DataURL.email}` : "";
  const document_number = DataURL.document_number
    ? `&document_number=${DataURL.document_number}`
    : "";

  const UrlGateway = `${base_url}?${merchant_transaction_id}&${merchant_id}&${operation}${email}${document_number}&${amount}&${currency}&${mock_type}&${account_id}&${calback_url}&${redirect_url}&${mock_auto_approve}${Signature}`;

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

    const valueToGetArgon2iHash = gateway_token + dataToRequest.url;
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
