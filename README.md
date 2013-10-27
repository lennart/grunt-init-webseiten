# grunt-init-webseiten

> Create a website scaffold with [grunt-init][].


## Installation

for now clone via git into your [grunt-init][] template folder

```bash
mkdir -p ~/.grunt-init
cd ~/.grunt-init
git clone git://github.com/lennart/grunt-init-webseiten webseiten
```

then 

## Opinionism alert

webseiten assumes the following:

* you're documents are
  * written in markdown
  * stored in `~/Documents/<project-name>`
* you're source code is
  * stored in `~/Source/<project-name>`
* you're project's metadata is
  * stored in `~/Projects/<project-name>.<editor-extension>` (just [SublimeText Projects][st] for now)
* you're static HTML files are
  * stored in `~/Sites/<project-name>`  


## Usage

### Setup

_Note that this template will generate files in the current directory, so be sure to change to a new directory first if you don't want to overwrite existing files (grunt will ask)._
At the command-line, cd into an empty directory, run this command and follow the prompts.

```bash
grunt-init webseiten
npm install
```

### Create Content

To actually see something

Create a file called `index.md` in `~/Documents/<your-project-name>/`.

Put the following into it (Markdown):

```markdown
---
title: words, again
---

> What a great day to end the world.

Thank you for you time,

I'll be gone…
```

__save__ and now:

### Generate

now you can run `grunt` and check the results in `~/Sites/<your-project-name>`


```bash
open ~/Sites/<project-name>/index.html
```

### Metadata

Wintersmith allows for different templates with each file.

You can edit jade templates in the `~/Source/<your-project-name>/templates/` folder.

For example:

```markdown
---
title: Foobar
template: hero.jade
---

* Two steps to success
* Repeat
```

To use your shiny hero template on this page.


## Thanks to

node, npm
bootstrap, component,
wintersmith, [grunt][],
markdown

[grunt]: http://gruntjs.com
[grunt-init]: http://gruntjs.com/project-scaffolding
[st]: http://www.sublimetext.com/docs/3/projects.html
