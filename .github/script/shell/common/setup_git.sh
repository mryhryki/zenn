#!/usr/bin/env bash

function setup_git() {
  if [[ "$(git config --global user.email)" == "" ]]; then
    git config --global user.email "mryhryki@gmail.com"
  fi
  if [[ "$(git config --global user.name)" == "" ]]; then
    git config --global user.name "Moriya Hiroyuki"
  fi
}
