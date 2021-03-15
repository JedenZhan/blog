## React的setState

React到setState(updater, callback)是用来告诉react有数据更新, 可能需要重新渲染, 它是异步的(有时表现为同步), react会攒一波, 然后一次性更新保证react的性能, 所以, 我们在setState后直接拿this.state是拿不到最新值的

### 1

如果需要获取最新state, 可以在callback里面或者componentDidUpdate里写

```js
this.setState({
  index: 1
}, state => {
  console.log(this.state.index) // 1
}})

componentDidUpdate () {
  this.state.index // 1
}
```

### 2

setState会合并我们传的对象

```js
onClick = () => {
  this.setState({ index: this.state.index + 1 })
  this.setState({ index: this.state.index + 1 })
}
```

在react眼里

```js
this.setState(Object.assign(previousState, { index: xx }, { index: xx }))
```
这时候, 应该
```js
this.setState((preState) => {
  return {
    index: preState.index + 1
  }
})
this.setState((preState) => {
  return {
    index: preState.index + 1
  }
})
```
- 如果下一个state的设置依赖前一个的话, 传入 function


