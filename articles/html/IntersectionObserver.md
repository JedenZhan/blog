## 什么是IntersectionObserver

简单来说, 就是为了监听元素是否展示在视口内

一般我们监听window.onscroll, 然后使用目标元素`element.getBoundingClientRect`方法得到元素左顶点对于视口左上角的坐标(x, y属性), 然后根据clientHeight, scrollTop 判断元素的展示

但是这种方法, 要监听onscroll, 在大量滚动的场景, 会有性能问题

IntersectionObserver是浏览器提供的API, 使用方法是

```js
function callback(entries) {
  console.log(entries)
}
const io = new IntersectionObserver(callback, option /*可选*/)

const element = document.getElementById('target')

io.observe(element) // 开始监听目标元素
```

开始监听后, 每次元素的展示/隐藏都会触发回调函数`callback`, 参数entries是数组, 里面包含了所有observe元素的信息

数据结构是这样子
```js
[
  {
    boundingClientRect: '目标元素的矩形信息',
    intersectionRatio: '相交区域与元素的比例值intersectionRect/boundingClientRect, 不可见时为0',
    isIntersecting: '元素是否可见',
    intersectionRect: '目标元素和视窗（根）相交的矩形信息 可以称为相交区域',
    target: '监听的目标元素',
    time: '两次被触发的时间戳'
  }
]
```

根据这个特性, 我们可以有实现懒加载的新方法了

## 1.实现懒加载

```js
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const { target, isIntersecting } = entry
    if (isIntersecting) { // 元素可见的时候替换src
      target.src = target.dataset.src
      io.unobserve(target) // 记得取消监听
    }
  })
})
const imgContainers = document.querySelectorAll('[data-src]')
imgContainers.forEach(imgContainer => {
  io.observe(imgContainer)
})
```

## 2.使用hooks实现元素是否可见

```js
function useVisible(e) {
  const [isVisible, setIsVisible] = useState(false)
  function cb(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) setIsVisible(true)
    })
  }
  const io = new IntersectionObserver()
  useCallback(() => {
    io.observe(e)
    return () => {
      io.unobserve(e)
    }
  }, [e])
  return isVisible
}
```