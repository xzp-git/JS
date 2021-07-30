let submit = document.querySelector("#submit")

//模拟从服务器获取数据（需要1000ms）
const queryData = callback => {
  setTimeout(function(){
    // callback('OK')
    console.log('ok')
  },1000)
}

/*
  debounce:函数防抖
  @params 
    func:自己最终要执行的任务
    wait:多久操作一次算是频繁触发[默认值：500ms]
    immediate:控制触发的边界[默认值：false结束边界  true开始边界]
  @return
    operate处理函数，处理函数会在频繁触发的时候，频繁执行，函数内部，控制我们想要操作的func只执行一次
*/
const clearTimer = function clearTimer(timer){
  if(timer){
    clearTimeout(timer)
  }
  return null
}

const debounce = function debounce(func,wait,immediate){
  if(typeof func !== "function") throw new TypeError('func must be an function!')
  if(typeof wait === "boolean") immediate = wait
  if(typeof wait !== "number") wait = 500
  if(typeof immediate !== "boolean") immediate = false
  let timer = null
  return function operate(...params){
    let now = !timer && immediate

    timer = clearTimer(timer)
    timer = setTimeout(() => {
      timer = clearTimer(timer)
      //结束边界触发
      if(!immediate) func.call(this, ...params)
    },wait)
    //开始边界触发
    if(now)  func.call(this, ...params)  
  }
}

submit.onclick=debounce(queryData,false)


const throttle = function throttle(func,wait){
  if(typeof func !== "function") throw new TypeError('func must be an function')
  if(typeof wait !== "nummber") wait = 500
  let timer = null,
      previous = 0;
  return function operate(...params){
    let now = +new Date(),
        remaining = wait - (now - previous),
    if(remaining <= 0){
      // 两次间隔时间超过500ms了，让其方法立即执行
      timer = clearTimer(timer);
      func.call(this, ...params)
      previous = +new Date()
    }else if(!timer){
      // 没设置过定时器等待，则我们设置一个去等待即可
      timer = setTimeout(() => {
        timer = clearTimer(timer);
        func.call(this, ...params);
        previous = +new Date();
      },remaining)
    }
  }
}

const handle = function handle(ev) {
  /* queryData(result => {
      console.log(result, ev, this);
  }); */
  console.log('OK', ev, this);
};

window.onscroll=throttle(handle,1000)