---
title: Linux切换桌面环境需要注意的点
tags: [Linux, 碎片]
---

## 切换 i3

安装完 i3-wm 后, 可以注销帐号然后切到 i3 桌面

但是如果你设置了自动登录, 以后就会默认 i3-wm, 现在不能直接切回 pantheon, 需要设置取消自动登录

查看 `/etc/lightdm` 里面的 config, 有一个会是 auto-login 把这行删除即可