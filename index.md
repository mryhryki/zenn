---
layout: default
header_image: home
title: hyiromori's Portfolio
description: Web系フルスタックエンジニア hyiromori のポートフォリオサイトです。
---

## 自己紹介

Web系企業でサービス開発をやっているエンジニアです。
フロントエンド、アプリ、バックエンド、インフラの各領域での開発と運用経験がありますが、特にフロントエンドが得意です。

サービス開発を通じて、誰か何らかの価値を届けられると、やりがいを感じます。

## スキル

{% for category in site.data.skill %}
### {{ category.name }}
<div class="skills-wrapper">
{% for skill in category.skills %}
<a class="skill-container" href="{{ skill.url }}" target="_blank" rel="noopener">
  <img
    alt="{{ skill.title }} Logo"
    src="/assets/images/skill_images/{{ skill.image }}.png"
    class="skill-image"
    decoding="async"
  />
  <div class="skill-title">{{ skill.name }}</div>
  <div class="skill-level">{{ skill.rank }}</div>
</a>
{% endfor %}
</div>
{% endfor %}

## 連絡先

左下のメールアイコンからメールにてご連絡ください。
