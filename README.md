## API Rest in NodeJS to generate Json and url to gateway

## Install Packages

- yarn

## Available Scripts

In the project directory, you can run:

### `yarn start`

Run serve in port 4000;

- Open in Software to request POST [http://localhost:4000](http://localhost:4000)

# Important: set your gateway_token on the server

- Set value do Gateway Token of Paylivre in file server.js

  (server.js - line 14)

  ```js
  const gateway_token = { your_gateway_token };
  ```

### Routes:

## POST : http://localhost:4000/request_json

# Expected Body Json:

- <h3>URL OPTIONAL PARAMS:</h3> The following optional values must not be passed with empty values, when valid values are not passed, they must not be sent in the properties.

  - <b>email</b> (A valid email must be given or not send parameter)

  - <b>document</b> (A valid document (CPF or CNPJ) must be provided or no parameter must be sent)

  - <b>redirect_url</b> (Must be passed a valid non-empty string or do not send parameter
    a value must be passed)

  - <b>logo_url_example</b> (Must be passed a valid non-empty string or do not send parameter
    a value must be passed)

- Below, example body json expected on request to generate json for request on gateway api:

```yaml
{
  "merchant_id": "19",
  "account_id": "123456",
  "amount": "5000",
  "currency": "BRL",
  "operation": "0",
  "callback_url": "https://www.merchant.com",
  "redirect_url": "https://www.merchant_to_you.com",
  "logo_url_example": "https://raw.githubusercontent.com/paylivre/gateway-example-react-js/531efa528867022859ee579fce7567038bf1c190/assets/logo_jackpot.svg",
  "type": "1",
  "auto_approve": "1",
  "email": "person_user_gateway@test.com",
  "selected_type": "4",
  "pix_key_type": "",
  "pix_key": "",
  "document_number": "",
  "login_email": "",
  "password": "",
}
```

## POST : http://localhost:4000/gateway_url

- below, example body json expected on request to generate the url for the web gateway:

```yaml
{
  "merchant_id": "19",
  "account_id": "123456",
  "amount": "5000",
  "currency": "BRL",
  "operation": "0",
  "type": "1",
  "email": "person_user_gateway@test.com",
  "document_number": "60712326006",
  "callback_url": "https://www.merchant.com",
  "redirect_url": "https://www.merchant_to_you.com",
  "logo_url_example": "https://raw.githubusercontent.com/paylivre/gateway-example-react-js/531efa528867022859ee579fce7567038bf1c190/assets/logo_jackpot.svg",
  "auto_approve": "1",
}
```
