## vue自定义指令


基于intersectionObserver版本

原理:
1. 判断元素是否在可视范围
2. 给元素添加class

```ts
import type { App } from 'vue'

const inter = new IntersectionObserver((changes) => {
  for (const change of changes) {
    const target = change.target as HTMLElement
    const animateClass = target.getAttribute('animate-onscroll') || ''
    const originClass = target.className
    if (change.isIntersecting) {
      inter.unobserve(target)
      target.className = `${originClass} ${animateClass}`
    }
  }
})

export default {
  install(app: App) {
    app.directive('animate-onscroll', {
      mounted(el, binding) {
        el.style.opacity = 0
        el.setAttribute('animate-onscroll', binding.value)
        inter.observe(el)
      },
    })
  },
}
```