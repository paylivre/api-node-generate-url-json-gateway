## API Rest in NodeJS to generate Json and url to gateway

## Install Packages

- yarn

## Available Scripts

In the project directory, you can run:

### `yarn start`

Run serve in port 4000;

- Open in Software to request POST [http://localhost:4000](http://localhost:4000)

### Routes:

## POST : http://localhost:4000/request_json

- Example json body expected:

```yaml
{
  "merchant_id": "19",
  "account_id": "123456",
  "amount": "5000",
  "currency": "BRL",
  "operation": "0",
  "callback_url": "https://www.merchant.com",
  "redirect_url": "https://www.merchant_to_you.com",
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

- Example json body expected:

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
  "auto_approve": "1",
}
```
