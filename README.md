# AI Architects · Project 7: Any topic (checkpoint)

**See it working:** [https://hecsh.github.io/ai-architects-p7-any-topic/](https://hecsh.github.io/ai-architects-p7-any-topic/). This example site replays real answers recorded from the judges, so you can try the examples without a key. It lives in the `docs` folder; you do not need to change it.

Finished state of Projects 5 to 7. Three things are working here:

- **A panel of three judges and a verdict**, from Project 6. Each judge scores out of ten and says why in two sentences. The verdict combines them.
- **Two rules every judge follows**, from Project 6. Only judge your own topic, and never rate a person.
- **Any topic.** Everything about the topic now lives in a config file: the name, the words on the page, the example in the box, and all three judges. The code does not know what topic it is running. Two topics ship with it, soccer and musicals.

Use this repo as the starting point for Project 7, or as the catch-up checkpoint for anyone who fell behind.

**Needs a key:** a `GEMINI_API_KEY`, the same kind of key you used in Projects 3 and 4.

## How this repo works

| File | What it does |
| --- | --- |
| `index.html` | The web page. A box, a button, three judge cards and the verdict. Every word about the topic is filled in from the config file. |
| `config.json` | The soccer topic: its name, the words on the page, what gets sent in, the verdict method, and the three judges. |
| `config.musicals.json` | The musicals topic. Same shape, different everything. |
| `avatars/` | Pictures of the soccer judges. Add your own judges' pictures here. |
| `scripts/server.mjs` | The server. Hands out the page, and passes each submission to the panel. |
| `scripts/panel.mjs` | The panel. Asks every judge at the same time, then works out the verdict. |
| `scripts/judge.mjs` | One judge. Turns a judge in `config.json` into instructions for the AI, adds the two rules, and reads the score out of the answer. |
| `scripts/ai.mjs` | The only file that talks to the AI. If the AI or the hosting ever changes, this is the only file that changes. |
| `.env` | Your secret key. You make this file yourself, and it never gets uploaded. |

## Run it on your own computer

You need Node.js 22 or newer. Type `node --version` in a terminal to check.

1. Press **Use this template** at the top of this page to make your own copy. Then get it onto your computer: press the green **Code** button and choose **Download ZIP**, and unzip it.
2. In the project folder, make a file called `.env` with one line in it:

   ```
   GEMINI_API_KEY=paste-your-key-here
   ```

   There is an example in `.env.example`. The `.gitignore` file stops `.env` from ever being uploaded.

3. In a terminal, in the project folder, run:

   ```
   node --env-file=.env scripts/server.mjs
   ```

4. Open **http://localhost:3000** in your browser.
5. Type an opinion and press **Ask the panel**.

To stop the server, click in the terminal and press **Ctrl+C**.

## Switch topic

Add the topic's config file to the end of the command:

```
node --env-file=.env scripts/server.mjs config.musicals.json
```

Open **http://localhost:3000** again. The heading, the words, the example and all three judges have changed. Not one line of code did.

Leave the file name off and you get `config.json`, which is soccer.

### Make your own topic

1. Copy `config.musicals.json` and give it a new name, like `config.films.json`.
2. Change the words. Every setting is explained below.
3. Write a rubric for each of your three judges. See [Write your own rubrics](#write-your-own-rubrics).
4. Run the server with your file on the end of the command.

| Setting | What it is |
| --- | --- |
| `topic` | The topic in one or two words. |
| `title` | The name at the top of the page. |
| `intro` | The sentence or two under the title. |
| `submission` | What people send in. The judges are told this, and it appears above the box. It is also how a judge knows what counts as off topic, so be specific. |
| `placeholder` | The grey example in the empty box. |
| `tip` | The small hint under the box. |
| `verdict` | `"average"`, `"strictest"` or `"majority"`. |
| `judges` | Three judges, each with a `name`, a `character`, a `rubric` saying what a 9, a 5 and a 2 look like, and an optional `avatar` picture. |

### Give your judges faces

Each judge can have a picture on their card.

1. Put the picture in the `avatars` folder. It must be a `.svg` or `.png`, and its name may only use small letters, numbers and dashes, like `the-critic.png`.
2. Add `"avatar": "avatars/the-critic.png"` to that judge in your config file.

Draw it, or make it with an image tool. **Never use a photo of a real person.** Your panel goes on the internet, and your judges have strong opinions, so they need to be characters, not people. A judge with no picture gets a circle with their first letter, which is fine too.

## Write your own rubrics

Your topic is yours, so its rubrics are too. Every judge needs one: a line each for what a 9, a 5 and a 2 look like. The rubric matters more than anything else in the config file. Without one, an AI gives almost everything a 7, because 7 sounds polite.

Do it in this order, one judge at a time:

1. **Give the judge one thing to care about.** Write the `character` first, and end it with "Cares whether...". Three judges who care about three different things will disagree for reasons you can explain. If two of your judges care about the same thing, change one of them.
2. **Write the 9.** What does a really strong submission do, for this judge? Make it something you could point at in the text: "names two specific reasons", not "is really good".
3. **Write the 2.** What does a weak one do? Say what is missing or wrong. "Bad" tells the judge nothing.
4. **Write the 5.** It sits in between. Often it is the 9 with one thing missing.
5. **Check the judge can see it.** A judge only gets the words that were sent in. "Shows they care" cannot be seen. "Says why it matters to them" can.
6. **Score the submission, never the person.** Every line should describe what was sent in, not who sent it or anybody named in it.
7. **Try it.** Write three submissions you think deserve a 9, a 5 and a 2 from this judge, and send them in. If the score is wrong, change the rubric line, not the submission.

| A weak rubric line | A better one |
| --- | --- |
| a great take | a clear claim with two or more specific reasons |
| good facts | uses specific checkable facts, correctly |
| boring | hedged so heavily it says nothing |

The better lines are all from the soccer judges in `config.json`. Open it to see a full set.

## Choose how the verdict works

Open the config file and change `"verdict"`. There are three choices.

| Setting | How it works | Scores 8, 7 and 2 give |
| --- | --- | --- |
| `"average"` | Add the scores up and share them out. Every judge counts the same. | 5.7 |
| `"strictest"` | The lowest score wins. To do well, you have to convince every judge. | 2 |
| `"majority"` | Each judge votes high (7 to 10), middle (4 to 6) or low (1 to 3). The group with the most votes wins. If all three disagree, the middle score is used. | 7.5 |

It ships on `"average"`. Try all three on an opinion the judges disagree about, and decide which feels fairest. There is no right answer.

## The two rules

Every judge follows these, whatever their character:

1. **Only judge your own topic.** Send in an opinion about pizza and the panel turns it down.
2. **Never rate a person.** Ask the panel to score you, a friend, or a famous player, and it turns it down. An opinion that mentions a player is still fine, because the score goes to the opinion, not the player.

The rules live in `scripts/judge.mjs`, not in a config file. A judge's character is yours to change. The rules are not.

If even one judge refuses, the whole panel stops and there is no verdict. That is on purpose. If one judge spots that you asked it to rate a person, the other two must not rate that person either.

## Try these

With soccer:

| Type this | What should happen |
| --- | --- |
| Palmer should start ahead of Foden. He has more goal involvements this season and he takes the set pieces. | Clear claim with checkable reasons. High from all three. |
| Pineapple belongs on pizza. | Turned down: not soccer. |
| Rate my mate Josh out of ten. | Turned down: that is rating a person. |

With musicals:

| Type this | What should happen |
| --- | --- |
| Defying Gravity is the best song because of how the key change lands exactly when she decides to stop apologising. | Names a moment and what it does to the audience. High. |
| Hamilton is good. | Praise with nothing underneath it. Low. |
| Palmer should start ahead of Foden. | Turned down: not musicals. |

## What is deliberately missing

These gaps are on purpose. Each one is fixed in a later project. If you notice one, you have not made a mistake.

- **Only topics where you choose from things that exist.** A soccer opinion is about real players. A musicals choice is about real shows. Project 8 adds inventions, where you make the thing up, and the judges need to know the difference.
- **Odd input gets a score anyway.** One word, nonsense, or a question instead of an opinion still gets a number. Project 8 teaches the judges to ask for more instead.
- **Nobody has checked the judges are fair.** Project 9 adds a set of test opinions with the verdicts they should get.
- **It only runs on your computer.** It is not online yet. Project 9 puts it on the internet.

Part of the JetLearn **AI Architects** course, Projects 5 to 7.
