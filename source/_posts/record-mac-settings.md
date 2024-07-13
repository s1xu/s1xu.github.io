---
title: '[macOS]记录我的mac设置'
date: 2024-06-25 00:56:34
categories: macOS
tags: macOS
---


## 1. 调整启动台图标数量

Mac的Launchpad启动台下会存放应用程序的图标。但在默认设置下，这些应用的图标很大，而且也比较占用屏幕空间。
想找一个程序最简单的当然是聚焦和Alfred，不过偶尔看着启动台很乱也很难受。



```shell
defaults write com.apple.dock springboard-columns -int 9

defaults write com.apple.dock springboard-rows -int 6

defaults write com.apple.dock ResetLaunchPad -bool TRUE

killall Dock
```

>每行的含义：
>1、调整每一行显示图标数量，9表示每一行显示9列图标，数字部分可随意设置.. 不过不建议太极端。
>2、调整每一屏显示图标的行数，我用的是6，数字部分可随意设置，建议同上。
>3、重置Launchpad
>4、重启Dock

如果手抖 多输入了几百个零 还有个恢复默认设置的方法，在终端执行以下4行命令

```shell
defaults write com.apple.dock springboard-rows Default
defaults write com.apple.dock springboard-columns Default
defaults write com.apple.dock ResetLaunchPad -bool TRUE
killall Dock
```

## 2. 恢复Dock栏默认设置

```shell
defaults delete com.apple.dock; killall Dock
```



## 3. 禁用Chrome浏览器触控板手势

```shell
defaults write com.goolge.Chrome AppleEnableSwipeNavigateWithScrolls -bool FALSE
```

## 4. 键盘功能键调整

M系列以前，F5和F6是可以调节键盘灯光亮度的，但是M系列后F5、F6键盘功能区有更新，换成了搜索和录音。

平时开发中需要debug原因，所以我打开了`将F1、F2等键用作标准功能键`设置，正常使用功能区需要FN+xx键配合。某一天发现FN+F5，F6会没有功能，因为这个事儿还和客服沟通过，个人觉得这是一个设计上的缺陷。



`Copy the configuration below to ~/Library/LaunchAgents/com.local.KeyRemapping.plist`

在`~/Library/LaunchAgents/`目录下新增一个配置文件`com.local.KeyRemapping.plist`

键入：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.local.KeyRemapping</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/bin/hidutil</string>
        <string>property</string>
        <string>--set</string>
        <string>{"UserKeyMapping":[
            {
              "HIDKeyboardModifierMappingSrc": 0xC000000CF,
              "HIDKeyboardModifierMappingDst": 0xFF00000009
            },
            {
              "HIDKeyboardModifierMappingSrc": 0x10000009B,
              "HIDKeyboardModifierMappingDst": 0xFF00000008
            }
        ]}</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
```

以上是将F5、F6映射到键盘灯光调整

控制台查看已映射的功能键：

`hidutil property --get "UserKeyMapping"` 

> 附：
> 常见功能的HID键值
>
> | 键   | 媒体功能                 | HID键码        |
> | ---- | ------------------------ | -------------- |
> | F1   | 减低屏幕亮度             | 0x0C00000070   |
> | F2   | 增加屏幕亮度             | 0x0C0000006F   |
> | F3   | Expose                   | 0xFF0100000010 |
> | F4   | Spotlight(AC Search)     | 0xC00000221    |
> | F5   | Dictation                | 0xC000000CF    |
> | F6   | 勿扰模式(Do Not Disturb) | 0x10000009B    |
> | F7   | 重播                     | 0x0C000000B4   |
> | F8   | 播放/暂停                | 0x0C000000CD   |
> | F9   | 快进                     | 0x0C000000B3   |
> | F10  | 静音                     |                |
> | F11  | 减小音量                 | 0x0C000000EA   |
> | F12  | 增加音量                 | 0x0C000000E9   |
> |      | 减少键盘背光             | 0xFF00000009   |
> |      | 增强键盘背光             | 0xFF00000008   |
> |      | 锁屏/屏保                | 0x0C0000019E   |
> |      | Launchpad                | 0x0C000002A2   |
> |      | Dashboard                | 0xFF0100000002 |

## 5. Magic Mouse 调整光标速度

1. 查看当前光标速度

   ```shell
   defaults read -g com.apple.mouse.scaling
   ```

2. 调整速度为7.5

   ```shell
   defaults write -g com.apple.mouse.scaling 7.5
   ```

3. `sudo reboot` 重启



## 6. 设置菜单栏间距

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







### 参考

1. [Mac电脑键盘映射的最轻量方法](https://www.readern.com/keymapping-in-mac.html)

2. [hidutil key remapping generator](https://hidutil-generator.netlify.app/)



