## GOPATH和GOMOD的关系

一句话就是: **GOMOD是为了取代GOPATH**



## GOPATH

在早期的 GO 版本中, 在安装的时候需要设置 GOPATH, 这个 GOPATH 有三个文件夹

- src (源码目录)
- bin (编译好的二进制文件)
- pkg (编译时生成的中间文件)

GO 是推荐我们的项目建立在 GOPATH 里面的, 并且在 GOPATH 时代, 包的导入查找过程为 GOROOT(go 安装的地方), GOPATH, 目录, 如果找不到就报错没有这个包

## GOMOD

在GO1.11之后, GO语言添加了 GOMOD, 这个类似 node 的package.json, 用于保存当前项目的包引用情况, 而且在第一次编译后会有 go.sum 文件, 类似 package-lock.json



**注意, 如果GOMOD是开启状态`go env GO111MODULE显示为on`, 并且项目根目录没有 go.mod 文件, 是不能导入第三方包的(会报错在GOROOT找不到这个包), 需要使用 go mod init 来初始化(创建 go.mod 文件)**

gomod作为最新特性, 官方鼓励使用 gomod, 抛弃 gopath 吧..

