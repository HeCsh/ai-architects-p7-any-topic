# AI Architects · Project 7: Any topic (checkpoint)

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
3. Run the server with your file on the end of the command.

| Setting | What it is |
| --- | --- |
| `topic` | The topic in one or two words. |
| `title` | The name at the top of the page. |
| `intro` | The sentence or two under the title. |
| `submission` | What people send in. The judges are told this, and it appears above the box. It is also how a judge knows what counts as off topic, so be specific. |
| `placeholder` | The grey example in the empty box. |
| `tip` | The small hint under the box. |
| `verdict` | `"average"`, `"strictest"` or `"majority"`. |
| `judges` | Three judges, each with a `name`, a `character` and a `rubric` saying what a 9, a 5 and a 2 look like. |

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
