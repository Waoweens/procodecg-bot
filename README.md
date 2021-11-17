# ProcodeCG Bot

## config.json
```json
{
	"prefix": "your prefix",
	"token": "your discord bot token",
	"dialogpt_token": "your DialoGPT token"
}
```
Prefix: change to whatever prefix you want commands to have <br />
example: `!!`

Token: change to your discord bot token <br />
Create an Application in [Discord developers](https://discord.com/developers/applications) <br />
Add a bot user <br />
Copy token

DialoGPT token: change to your Hugging Face DialoGPT token <br />
Create a [Hugging Face](https://huggingface.co/) account <br />
[Go here](https://huggingface.co/microsoft/DialoGPT-medium), click Deploy, and click `Accelerated Interface` <br />
Copy token

## Running the bot
### Requires Node.js 16 or higher

Install dependencies
```
npm install
```
Run the bot
```
node .
```