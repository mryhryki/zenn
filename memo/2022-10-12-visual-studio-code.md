---
title: "Visual Studio Code メモ"
---

## はじめに

Visual Studio Code を使ってみようと思ったので、参照したリンクなどを残すメモです。
随時追加・変更します。

## User Guide

- https://code.visualstudio.com/docs/editor/codebasics

## Keyboard Shortcut for macOS

![keyboard-shortcuts-macos.jpg](https://mryhryki.com/file/URAPVrzdVzyGHQEQaZf23tC1kNbmj8oyVjWCZ_cqTUurECg8.jpeg)

https://code.visualstudio.com/docs/getstarted/keybindings#_keyboard-shortcuts-reference


## Auto fix by ESlint on saved

`settings.json` にこれを入れたらできた。

```javascript
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript"]
}
```

[How To Enable Linting on Save with Visual Studio Code and ESLint | DigitalOcean](https://www.digitalocean.com/community/tutorials/workflow-auto-eslinting)
