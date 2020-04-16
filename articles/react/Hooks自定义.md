---
title: 如何自定义 hooks
tags: [JavaScript, React, ES6]
---

上一篇讲解了 hooks, 传送门 [hooks](https://jedenzhan.github.io/2020/02/12/hooks/)

这一篇讲讲如何自定义 hooks ------ 主要参考[官方链接](https://react.docschina.org/docs/hooks-custom.html)

## 自定义 hooks

一个组件用于展示用户的在线状态

```js
const FriendStatuds = props => {
// ------------------------------------------------------------
    const [isOnline, setIsOnline] = useState(null)
    useEffect(() => {
        const setFriendStatus = status => {
            setIsOnline(status.isOnline)
        }
        chatAPI.subscribe(props.friend.id, setFriendStatus) // 根据 id 请求服务端朋友是否在线
        
        return () => {
            chatAPI.unsubcribe(props.friend.id, setFriendStatus) // 当组件取消挂载的时候取消订阅
        }
    })
// ------------------------------------------------------------
    if (isOnline === null) return 'loading....'
    return isOnline ? 'online' : 'offline'
}
```

如果有一个列表, 当朋友在线显示绿色, 否则显示红色

```jsx
const FriendListItem = props => {
// ------------------------------------------------------------
    const [isOnline, setIsOnline] = useState(null)
    useEffect(() => {
        const setFriendStatus = status => {
            setIsOnline(status.isOnline)
        }
        chatAPI.subscribe(props.friend.id, setFriendStatus) // 根据 id 请求服务端朋友是否在线
        
        return () => {
            chatAPI.unsubcribe(props.friend.id, setFriendStatus) // 当组件取消挂载的时候取消订阅
        }
    })
// -------------------------------------------------------------
    return (
    	<li style={{color: isOnline ? 'green' : 'red'}}>{props.friend.name}</li>
    )
}
```

可以发现虚线内部的代码完全一致, hooks 的诞生就是为了解决这种问题, 让两个组件共享用户状态

重复代码可提取出来当做我们的自定义 hooks

```js
const useFriendStatus = friendId => {
    const [isOnline, setIsOnline] = useState(null)
    useEffect(() => {
        const setFriendStatus = status => {
            setIsOnline(status.isOnline)
        }
        chatAPI.subscribe(props.friend.id, setFriendStatus) // 根据 id 请求服务端朋友是否在线
        
        return () => {
            chatAPI.unsubcribe(props.friend.id, setFriendStatus) // 当组件取消挂载的时候取消订阅
        }
    })
    
    return isOnline
}
```

- 自定义 hooks 一定要以 use 开头
- hook 本身就是函数

## 使用自定义 hook

```jsx
const FriendStatus = props => {
    const isOnline = useFriendStatus(props.friend.id)
    
    if (isOnline === null) return 'loading'
    return isOnline ? 'online' : 'offline'
}

// 第二个
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id)

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  )
}
```

并且这段代码和以上代码是完全等价的

以上, 共勉