## webpack插件开发

官方文档, 一个webpack插件需要有

- 一个class类
- 在类里面定义一个apply方法
- 指定一个触及到webpack本身的事件钩子
- 操作webpack内部的数据
- 实现功能后调用webpack提供的callback

```js
class MyWebpackPlugin {
  constructor (config) {
    this.config = Object.assign({
      // default config
    }, config)
  }

  apply(c) {
    c.hooks.emit.tap('MyWebpackPlugin', compilation => {
      compilation.hooks.optimize.tap('MyWebpackPlugin', () => {
        console.log('doing')
      })
    })
  }
}
```
这里实现一个检查项目冗余文件的插件

在工作中的项目很可能经过多人维护, 造成很多冗余插件, 这个插件可以帮助定位这些文件

需要用到node核心模块, fs, path, 帮助我们读取文件夹的目录
```js
const fs = require('fs'),
  path = require('path'),
  name = 'NoUsedFilesPlugin'
```

然后编写基本架构

compiler和compilation
在webpack的工作流中, compiler是每次webpack全部生命周期的对象, compilation是webpack每次构建过程的对象, compilation和compiler都有自己的生命周期(hooks), 通过生命周期函数, 可以拿到编译过程的关键数据和对象

webpack的基本流程

- 准备阶段, 创建compiler和compilation对象
- 编译阶段, 完成modules的解析, 生成chunks
  - module解析包括创建实例, loaders, 依赖收集
  - chunk生成, 找到每个chunk所需要的modules
- 产出阶段, 根据chunks生成文件

compilation做构建打包的事情包括
- 查找入口
- 编译模块, 根据文件类型和loader配置, 使用loader对文件处理
- 解析文件的ast语法树
- 找出文件依赖关系
- 递归编译依赖的模块

我们的插件注册生命周期在compilation里面的afterOptimizeChunkAssets, 在分析完所有文件依赖关系的时候触发


```js
const defaultOptions = {
  sourceDir: '',
  compilationExclude: compilation => false,
  output: 'not-using-files.json',
  exclude: []
}
module.exports = class NoUseFilesPlugin {
  constructor (options) {
    this.options = Object.assign(defaultOptions, options)
  }

  apply(compiler) {
    // 读取配置
    const { sourceDir, compilationExclude, output } = this.options;
    compiler.hooks.compilation.tap(name, compilation => {
      if (compilationExclude(compilation)) return
      compilation.hooks.afterOptimizeChunkAssets.tap(name, chunks => {
        const modules = {}
        // 标记我们要diff的文件, 不是目标目录的不记录
        chunks.forEach(chunk => {
          chunk.getModules().map(module => {
            fs.writeFileSync(output, JSON.stringify(module, null, 2))
            const src = module.source || ''
            if (!src || src.indexOf(sourceDir) === -1) return
            modules[src] = 1
          })
        })
        const list = this.diff(walk(sourceDir), modules)
        fs.writeFileSync(output, JSON.stringify(list, null, 2))
      })
    })
  }
  // 和webpack的source对比, 找到文件夹有, source没有的
  diff(files, modules) {
    const { exclude, sourceDir } = this.options,
      ret = []
    
    for (const f in files) {
      if (isExclude(exclude, i)) continue // 不包含的文件忽略
      if (!module[i]) ret.push(i) // 文件不再module里面, 表示没有引用, 保存
    }
    // 使用 path.relative 生成为相对路径
    return ret.map(f => path.relative(sourceDir, f))
  }
}

// 遍历目标文件夹, 遇到文件夹递归读取
function walk(dir, ret) {
  if (!ret) ret = {}
  // sync为同步读取
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const p = path.join(dir, file), stat = fs.statSync(p)
    if (stat.isDirectory()) {
      walk(stat, ret)
      continue
    }
    ret[p] = 1
  }
  return ret
}

function isExclude(exclude, src) {
  return exclude.some(i => i.test(src))
}
```

使用
```js
new UnusedModulesPlugin({
  sourceDir: path.resolve(__dirname, "../src"),
  compilationExclude: compilation => /html-webpack-plugin/.test(compilation.name),
  output: path.join(__dirname, "../tmp/unusedModules.json"),
  exclude: [/\.spec\.js$/],
}),
```

- 注册在afterOptimizeChunkAssets生命周期
- 获取modules的source, walk函数递归读取文件夹里面全部文件