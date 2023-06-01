// canvas.js
// 获取canvas元素
var canvas = document.getElementById("canvas");
var labelElm = document.getElementById("label");
var pElm = document.getElementById("p");
var clearBtn = document.getElementById("clear-btn");
// 设置canvas的宽高属性
canvas.width = 128;
canvas.height = 128;
// 判断浏览器是否支持canvas
if (canvas.getContext) {
    // 获取2D绘图上下文对象
    var ctx = canvas.getContext("2d");
    // 设置初始的绘图颜色和线宽
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    // 定义一个变量，表示是否正在绘图
    var drawing = false;
    // 定义一个函数，获取鼠标在canvas上的相对位置
    function getMousePos(event) {
        // 获取canvas元素的位置和大小
        var rect = canvas.getBoundingClientRect();
        // 返回鼠标相对于canvas的坐标
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }
    // 监听canvas元素的mousedown事件
    canvas.addEventListener("mousedown", function(event) {
        // 获取鼠标位置
        var mousePos = getMousePos(event);
        // 开始创建新路径
        ctx.beginPath();
        // 移动笔触到鼠标位置
        ctx.moveTo(mousePos.x, mousePos.y);
        // 设置绘图状态为true
        drawing = true;
    });
    // 监听canvas元素的mousemove事件
    canvas.addEventListener("mousemove", function(event) {
        // 判断是否正在绘图
        if (drawing) {
            // 获取鼠标位置
            var mousePos = getMousePos(event);
            // 绘制一条直线到鼠标位置
            ctx.lineTo(mousePos.x, mousePos.y);
            // 描边路径
            ctx.stroke();
        }
    });
    // 监听canvas元素的mouseup事件
    canvas.addEventListener("mouseup", function(event) {
        // 设置绘图状态为false
        drawing = false;
    });
    function getImage() {
    // 获取canvas元素
    var canvas = document.getElementById("canvas");
    // 调用toDataURL()方法，获取图片的URL
    var url = canvas.toDataURL();
    // 返回URL
    return url;
    };
    var lastUrl = null;
    function sendImage() {
    // 调用getImage()函数，获取图片的URL
        var url = getImage();
    // 判断URL是否为空或者与上一次相同
        if (url && url != lastUrl) {
        // 创建一个XMLHttpRequest对象
            var xhr = new XMLHttpRequest();
        // 设置请求的方法和地址，这里假设你的flask app有一个接收图片的路由叫/image
            xhr.open("POST", "/image");
        // 设置请求头，告诉服务器发送的数据是JSON格式
            xhr.setRequestHeader("Content-Type", "application/json");
        // 设置请求的回调函数，当请求完成时执行
            xhr.onload = function() {
            // 判断请求的状态码是否是200，表示成功
                if (xhr.status == 200) {
                // 打印服务器返回的响应数据
                    console.log(xhr.responseText);
                    var data = JSON.parse(xhr.responseText);
                    labelElm.textContent = data.label;
                    pElm.textContent = data.p;
                }
            };
        // 发送请求，把图片的URL转换成JSON字符串作为请求体
        xhr.send(JSON.stringify(url));
        // 更新上一次发送的图片的URL
        lastUrl = url;
        }
    };
    var interval = 500; // 0.5秒
// 使用setInterval()函数，定时调用sendImage()函数
    setInterval(sendImage, interval);
    clearBtn.addEventListener("click", function() {
    // 利用clearRect方法清除画板内容
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 更新预测结果和概率的默认值
    labelElm.textContent = "--";
    pElm.textContent = "--";
});
}
