# ShinyDraw

(or `drawr`)

This is a work in progress for implementing drawing to get data out into an easy to use shiny module.

No shiny implementation is yet here. Currently it's getting polished as a javascript class which will then be
duct taped into a shiny module. Most likely will end up in the `shinysense` package.

## Running it yourself.

```bash
git clone git@github.com:jhudsl/shinyDraw.git
cd ShinyDraw/demo
open index.html
```

This should give you a nice and usable demo to play with.


## Editing it yourself.

__code version__

```bash
git clone git@github.com:jhudsl/shinyDraw.git
cd ShinyDraw
npm install #this takes too long because javascript's package landscape is a bloated giant.
npm start   #kick off a server that automagically "transpiles" your javascript code into code that runs on any browser.
```
__human version__   

In order to run the demo on your own computer clone this repo then `cd` into it and run the command `npm install`.
This will take a ridiculous amount of time but once it's done you can then run `npm start` and magically a server will
spin up that points to the port `9966`. Just point your browser to `localhost:9966` and the demo should show up.

## Making changes.

If you want to tinker with the code (it's entirely in `src/main.js` and `src/helpers.js`) just open them up in your text editor of choice and make a change then save the file (make sure you've previously run `npm start`). After saving these the server will
detect changes to your files and recompile them and host the new version. Refresh your page and see what's newly broken!
