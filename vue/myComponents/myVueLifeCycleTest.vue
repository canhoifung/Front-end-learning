<template>
    <div>
        <h1>{{text}}</h1>
        <button @click="changeH1">切换h1内容</button>
        <p v-if="bool">应该引发了beforeUpdate和updated</p>
        <keep-alive>
            <test-for-activated v-if="control"></test-for-activated>
        </keep-alive>
        <button @click="changeContrl">切换组件v-if</button>
    </div>
</template>
    
<script>
    export default{
        name:"my-vueLifeCycleTest",
        data:function(){
            return{
                text:"this is template test",
                bool:false,
                control:true,
            }
        },
        methods:{
            changeH1(){
                this.text="这是船新的标题内容";
                this.bool=true;
            },
            changeContrl(){
                this.control=this.control?false:true;
            },
        },
        beforeCreate(){
            console.log("lifeCycle beforeCreate")
        },
        created(){
            console.log("lifeCycle created");
            //created阶段无法获取到vm.$el
        },
        beforeMount(){
            console.log("lifeCycle beforeMount");
            //开始首次调用render
        },
        mounted(){
            console.log("lifeCycle mounted");
            //此时用vm.$el代替了el，可以获取vm.$el
            //但无法保证子组件也一起被挂载完成，若要实现效果，需要用this.$nextTick(function(){});
        },
        beforeUpdate(){
            //数据更新了但是还没有渲染到视图层，如果这一步修改数据可能会导致无限循环
            console.log("lifeCycle beforeUpdate");
        },
        updated(){
            console.log("lifeCycle updated");
            //无法保证子组件也一起被挂载完成，若要实现效果，需要用this.$nextTick(function(){});
        },
        activated(){
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
        },
    }
</script>