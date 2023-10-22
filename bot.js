const {Telegraf}=require('telegraf');
const express=require('express')
require('dotenv').config();
const app=express();
app.get("/",(req,res)=>{
  res.send("hello world")
})
const port=3001;
app.listen(port,()=>{
  console.log(`Server running at http://localhost:${port}`)
})
const bot=new Telegraf(process.env.BOT_TOKEN);
bot.catch((err, ctx) => {
  console.error(`Error for ${ctx.updateType}`, err);
});

bot.start(async (ctx) => {
  await ctx.reply(`Hello there ${ctx.message.from.first_name}!! and Welcome to Dog Breed Images Bot ❤️.


Here you can get images of any dog breed and any no. of images you want,just read the instruction carefully!!`)
 await  ctx.reply(
    `Enter the name of the dog breed + no. of images u want after the /get command (Example - /get hound 3)`
  );
});
bot.help((ctx)=>{
  ctx.reply(
    `Enter the name of the dog breed + no. of images u want after the /get command (Example - /get hound 3)`
  );
})
  bot.command('get',async (ctx)=>{
  let name = '';
  let arr = ctx.message.text.split(' ');
  if (arr.length === 1) {
    ctx.reply(
      `Enter the name of the dog breed + no. of images u want after the /get command (Example - /get hound 3)`
    );
  } else { 
    let n = arr[2];
    name = arr[1];
    let complete = name;
    let url = `https://dog.ceo/api/breed/${name}/images/random/${n}`;
    if (arr.length === 4) {
      n = arr[3];
      name = arr[2];
      let subBreed = arr[1];
      complete = name + '' + subBreed;
      url = `https://dog.ceo/api/breed/${name}/${subBreed}/images/random/${n}`;
    }
    // ctx.reply('You pressed the start command');
    await fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Check your spelling or command.');
        }
        return response.json();
      })
      .then((data) => {
        let array = data.message;
        for (let i = 0; i < array.length; i++) {
          bot.telegram.sendPhoto(ctx.chat.id, array[i]);
        }
      })
      .catch((error) => {
        ctx.reply('Error: ' + error.message);
      });
  }
});

bot.launch();
