//用于测试data

let vueData = new Vue({
    el: "#vueData",
    template: `
    <div>
        <ul>
            <li v-for="(val,key) in dataTest">{{key}}：{{val}}</li>
        </ul>
        <button @click="VueSetClick">通过Vue.set设置/更新data中的数据</button>
        <button @click="thisSetClick">通过this.$set设置/更新data中的数据</button>
    </div>
    `,
    data: { //存放Vue数据 不能_或$开头
        //可以通过以下方法进行修改：
        //Vue.set(object,propertyName,value)   vm.$set(object,propertyName,value)
        //Object.assign({},this.someobject,newObject)
        //对Array而言所有会修改原数组的方法都可以，直接用index来修改或改length就不行
        //不能直接对根data添加数据
        fruit: "banana",
        text: "data数据添加测试",
        count: 1,
        obj: {
            newKey: "oldValue"
        },
    },
    computed: {
        dataTest: function () {
            return this.$data
        }
    },
    methods: {
        VueSetClick() {
            Vue.set(vueData.obj, "newKey", "newValue")
        },
        thisSetClick() {
            this.$set(this.obj, "new-set-key", "new-set-value")
        }
    }
})

//用于测试生命周期函数：
let vueLifeCycle = new Vue({
    el: '',
    template: `
    <div>
        <h1>{{text}}</h1>
        <button @click="changeH1">切换h1内容</button>
        <p v-if="bool">应该引发了beforeUpdate和updated</p>
        <keep-alive>
            <test-for-activated v-if="control"></test-for-activated>
        </keep-alive>
        <button @click="changeContrl">切换组件v-if</button>
    </div>
    `,
    data: {
        text: "this is template test",
        bool: false,
        control: true,
    },
    methods: {
        changeH1() {
            this.text = "这是船新的标题内容";
            this.bool = true;
        },
        changeContrl() {
            this.control = this.control ? false : true;
        },
    },
    beforeCreate() {
        console.log("lifeCycle beforeCreate")
    },
    created() {
        console.log("lifeCycle created");
        //created阶段无法获取到vm.$el
    },
    beforeMount() {
        console.log("lifeCycle beforeMount");
        //开始首次调用render
    },
    mounted() {
        console.log("lifeCycle mounted");
        //此时用vm.$el代替了el，可以获取vm.$el
        //但无法保证子组件也一起被挂载完成，若要实现效果，需要用this.$nextTick(function(){});
    },
    beforeUpdate() {
        //数据更新了但是还没有渲染到视图层，如果这一步修改数据可能会导致无限循环
        console.log("lifeCycle beforeUpdate");
    },
    updated() {
        console.log("lifeCycle updated");
        //无法保证子组件也一起被挂载完成，若要实现效果，需要用this.$nextTick(function(){});
    },
    activated() {
        //被keep-alive缓存的组件再次被激活时
        console.log("lifeCycle activated");
    },
    deactivated() {
        console.log("lifeCycle deactivated");
        //被keep-alive缓存的组件停用时
    },
    beforeDestroy() {
        console.log("lifeCycle beforeDestory");
        //离开页面时才会调用
        //vm.$destory()被调用，此时vm实例仍然可用
    },
    destroyed() {
        console.log("lifeCycle destroyed");
        //所有指令解绑、事件监听器被移除，子实例被销毁
    },
    errorCaptured: (err, vm, info) => {
        //错误对象，发生错误的组件实例，包含错误来源信息的字符串
        //返回一个boolean判断是否让错误继续向上传播
        console.log("lifeCycle errorCaptured")
        return true;
    },
})
Vue.component("test-for-activated", {
    template: `<div>这是用来测试activated的组件</div>`,
    activated() {
        console.log("test-for-activated activated");
    },
    deactivated() {
        console.log("test-for-activated deactivated");
    },
})
setTimeout(() => {
    console.log("now lifeCycle mount");
    vueLifeCycle.$mount('#lifeCycleTest')
}, 1000)


//用于测试自定义指令：
Vue.directive('mydirective', {
    bind(el, binding, vnode) {
        console.log("我绑定元素了")
        var s = JSON.stringify
        el.innerHTML =
            'name: ' + s(binding.name) + '<br>' + //指令命
            'value: ' + s(binding.value) + '<br>' + //绑定值
            'expression: ' + s(binding.expression) + '<br>' + //绑定的前一个值，只在update和componentUpdated中可用
            'argument: ' + s(binding.arg) + '<br>' + //传给指令的参数
            'modifiers: ' + s(binding.modifiers) + '<br>' + //包含修饰符的对象
            'vnode keys: ' + Object.keys(vnode).join(', ') + '<br>' //Vue编译生成的虚拟节点
    },
    inserted(el, binding, vnode) {
        console.log("我绑定的元素被插入父节点了")
    },
    update(el, binding, vnode, oldnode) {
        //其子Node可能更新了也可能没有
        console.log("我所在的VNode更新了")
    },
    componentUpdated(el, binding, vnode, oldnode) {
        console.log("我所在的VNode和子Node全部更新完了")
    },
    unbind(el, binding, vnode) {
        console.log("我被解绑了")
    },
})
let myDirective = new Vue({
    el: "#directiveTest",
    data: {
        message: "对应绑定的value",
        control: true,
    }
})