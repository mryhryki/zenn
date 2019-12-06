---
layout: default
header_image: blog
title: hyiromori's Blog
description: Web系フルスタックエンジニア hyiromori のブログです。
---

<div id="blog-entries">
{% for post in site.posts %}
  <a class="blog-entry" href="{{ post.url }}" target="_self">
    <div class="blog-title">{{ post.title }}</div>
    <div class="keywords">
      <mark>{{ post.keyword }}</mark>
    </div>
    <div class="entry-date">
      作成：{{ post.date | date: '%Y-%m-%d' }}
      {% if post.update  %}
     （更新：{{ post.update }}）
      {% endif %}
    </div>
  </a>
{% endfor %}
</div>
