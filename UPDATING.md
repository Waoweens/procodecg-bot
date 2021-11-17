# Updating instructions
Pull from `main` branch
Update config.json:
```json
{
  "token": "Same as before",
  "dialogpt_token": "Same as before",
  "prefix": "!!",
  "ownerID": "551305036416811029"
}
```
set token and dialogpt_token to whatever was in the previous config
run `npm ci`
run `node .`
