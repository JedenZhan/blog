## Vue3新特性

### 组件 v-model 支持参数

### 组件支持多个 v-model
单个组件可以支持多个组件绑定


### Setup 函数

是新的组件选项, 组件内部作为composition API 入口点

- 调用时机

创建组件实例, 初始化props, 紧接着调用 setup 函数, 所以 setup 在beforeCreate之前执行, 也就是创建组件执行 setup, beforeCreate, created

setup 里面不能使用 data, methods, 里面的 this 是undefined

- 参数

props 和 context, props数据不能解构, 否则会响应式数据失效

- context提供上下文对象, 暴露了attrs, slots, emit属性

- 返回值

setup必须返回一个对象, 返回其他值不能渲染

### Reactive

```js
setup () {
  let name = reactive({ name: 'Jed' })
  function test() {
    name.name = 'zh'
  }
  return {
    name, test
  }
}
```
### ref

```js
setup() {
  let name = ref('jed')
  function test() {
    name.value = 'zh'
  }
  return {
    name,
    test
  }
}
```

### computed

```js
setup() {
  let name = ref('jed'),
  test = computed({
    get() {
      return name.value
    },
    set(v) {
      return name.value === v
    }
  })
  test.value = 'zh'
}
```

### readonly

```js
setup() {
  let obj = {}
  let only = readonly(obj)
  // 只读, 不可修改
}
```

