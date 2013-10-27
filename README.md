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

## Usage

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


_Note that this template will generate files in the current directory, so be sure to change to a new directory first if you don't want to overwrite existing files (grunt will ask)._
At the command-line, cd into an empty directory, run this command and follow the prompts.

```bash
grunt-init webseiten
npm install
```


now you can run `grunt` and check the results in `~/Sites/<your-project-name>`

#### TODO: add a sample index.md to docs folder, so the following works

```bash
open ~/Sites/<project-name>/index.html
```

## Thanks to

node, npm
bootstrap, component,
wintersmith, [grunt][],
markdown

[grunt]: http://gruntjs.com
[grunt-init]: http://gruntjs.com/project-scaffolding
[st]: http://www.sublimetext.com/docs/3/projects.html
