let imageModule = (function(){
  let columns = Array.from(document.querySelectorAll('.column')),lazyImageBoxs
  // 数据绑定
  const bindHTML = function bindHTML(data){
    //计算真实渲染的高度
    data = data.map(item => {
      let w = item.width, h = item.height;
      h = h / ( w/230 )
      item.width = 230
      item.height = h
      return item;
    })

    // 按照三个为一组进行循环（最后一组可能不到三项）
    for(let i=0; i<data.length; i += 3){
      // 把三组数据按照高度排序（升序）
      let group = data.slice(i,i+3);
      group.sort((a,b) => a.height - b.height)

      // 把三个列按照现在的高度进行排序(降序)
      columns.sort((a,b) => b.offsetHeight - a.offsetHeight)

      // 循环三个数据中的每一项：每循环一项，创建一个CARD，把创建的CARD放到对应的列中即可
      group.forEach((item, index) => {
        let {pic, link, title, height,} = item
        let card = document.createElement('div');
        card.className = "card";
                card.innerHTML = `<a href="${link}">
					<div class="lazyImageBox" style="height:${height}px">
						<img src="" alt="" data-img="${pic}">
					</div>
					<p>${title}</p>
        </a>`;
        columns[index].appendChild(card);
      })
    }
    // 获取所有需要延迟加载的盒子
    lazyImageBoxs = Array.from(document.querySelectorAll('.lazyImageBox'));
  }
  // 单张图片加载「为了防止加载的地址有错误，我们都是临时创建一个IMG去加载地址，能加载成功，才把地址赋值给真正的IMG」
  const singleImgLoading = function singleImgLoading(imgBox){
    let img = imgBox.querySelector('img'),
        trueImg = img.getAttribute('data-img'),
        tempImg = new Image();
    tempImg.src = trueImg
    tempImg.onload = function(){
      img.src = trueImg;
      img.style.opacity = 1;
      tempImg = null
    }
    imgBox.isLoad = true;
  }
  // 根据条件规则，控制哪些延迟加载
  const lazyImgsFunc = function lazyImgsFunc () {
    lazyImageBoxs.forEach(imgBox => {
      if(imgBox.isLoad) return //处理过就不在处理
      let A = imgBox.getBoundingClientRect().bottom,
      B = document.documentElement.clientHeight;
     if (A <= B) singleImgLoading(imgBox);  
      //方案一
      // let A = imgBox.offsetHeight + utils.offset(imgBox).top,
      //     B = document.documentElement.clientHeight + document.documentElement.scrollTop
      //     if(A <= B) singleImgLoading(imgBox) //盒子完全出现在视口中
    })
  } 
  return{
    // 模块入口：管控执行的逻辑
    async init(){
      let data = await utils.ajax('./data.json')
      bindHTML(data);
      setTimeout(lazyImgsFunc);
      window.addEventListener('scroll', utils.throttle(lazyImgsFunc, 500));
    }
  }
})()

imageModule.init();