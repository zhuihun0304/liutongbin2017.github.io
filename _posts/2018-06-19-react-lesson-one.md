---
layout:     post
title:      React初步学习
subtitle:   React重点总结
date:       2018-06-19
author:     "toshiba"
header-img: "images/bg/batman/bat8.jpg"
comments: true

tags :
    - javascript
    - reactjs
categories:
    - reactjs
---


# React
[react中文文档](https://doc.react-china.org/docs/handling-events.html)

# 事件处理
你必须谨慎对待 JSX 回调函数中的 this，类的方法默认是不会绑定 this 的。如果你忘记绑定 this.handleClick 并把它传入 onClick, 当你调用这个函数的时候 this 的值会是 undefined。
这并不是 React 的特殊行为；它是函数如何在 JavaScript 中运行的一部分。通常情况下，如果你没有在方法后面添加 () ，例如 onClick={this.handleClick}，你应该为这个方法绑定 this。

```javascript
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // This binding is necessary to make `this` work in the callback
    this.handleClick1 = this.handleClick1.bind(this);
  }
    //推荐方法一
  handleClick1() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  //推荐方法二
   handleClick2 = () => {
    console.log('this is:', this);
  }


  render() {
    return (
      <button onClick={this.handleClick1}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
       <button onClick={this.handleClick2}>
        Click me
      </button>
      <!-- 方法三不推荐 -->
      <button onClick={(e) => this.handleClick3(e)}>
        Click me
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```

### 方法三不推荐的原因：
> 使用这个语法有个问题就是每次 LoggingButton 渲染的时候都会创建一个不同的回调函数。在大多数情况下，这没有问题。然而如果这个回调函数作为一个属性值传入低阶组件，这些组件可能会进行额外的重新渲染。我们通常建议在构造函数中绑定或使用属性初始化器语法来避免这类性能问题。
在render方法中使用Function.prototype.bind会在每次组件渲染时创建一个新的函数，可能会影响性能（参见下文）



### 向事件处理程序传递参数
通常我们会为事件处理程序传递额外的参数。例如，若是 id 是你要删除那一行的 id，以下两种方式都可以向事件处理程序传递参数：

```javascript
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>


class Popper extends React.Component{
    constructor(){
        super();
        this.state = {name:'Hello world!'};
    }

    preventPop(name, e){    //事件对象e要放在最后
        e.preventDefault();
        alert(name);
    }

    render(){
        return (
            <div>
                <p>hello</p>
                {/* Pass params via bind() method. */}
                <a href="https://reactjs.org" onClick={this.preventPop.bind(this,this.state.name)}>Click</a>
            </div>
        );
    }
}
```