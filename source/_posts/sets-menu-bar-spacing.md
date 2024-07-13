---
title: '[macOS]设置菜单栏间距'
date: 2024-06-23 01:48:50
categories: macOS
tags: macOS
---

## 为什么会想要手动修改
在MacBook 14及以后的版本中，屏幕中央新增了一个刘海设计，同时右侧状态栏的间距相较之前有所增宽。这使得本已空间有限的菜单栏显得更加拥挤。

尝试过`Barbee`  `Bartender`等一些菜单栏工具，相对来说Bartender功能更加丰富，[由于最近的社区讨论](https://www.reddit.com/r/macapps/comments/1d7zjv8/bartender_5_not_safe_anymore_warning_from/)，用着有点不放心，所以就有了以下设置：



```shell
# 指定间距
defaults -currentHost write -globalDomain NSStatusItemSpacing -int 10
# 指定内边距
defaults -currentHost write -globalDomain NSStatusItemSelectionPadding -int 6

# 当前间距查询
defaults -currentHost read -globalDomain NSStatusItemSpacing
defaults -currentHost read -globalDomain NSStatusItemSelectionPadding

# 重置
defaults -currentHost delete -globalDomain NSStatusItemSpacing
defaults -currentHost delete -globalDomain NSStatusItemSelectionPadding
```



### 参考：

- [reddit](https://www.reddit.com/r/macapps/comments/1d8l54f/reduce_spacing_between_menubar_items/)

- [v2ex](https://cn.v2ex.com/t/1047186#reply29)