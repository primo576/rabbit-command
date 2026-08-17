/**
 * Created by Administrator on 2017/3/28 0028.
 * 雿輻鍂霂湔�𠬍��
 * �銁憿菟𢒰銝𦠜溶��惩�銝衤誨��撟嗅�閧鍂�𧋦JS���辣嚗�
 * <div id="clockdiv" style="text-align: center; width:250px"><br />
 * 	<canvas id="domClock" width="200" height="200">�函�瘚讛��膥銝滚�澆捆canvas</canvas>
 * </div>
 */

try {
    var c_canvas = document.getElementById('domClock');
    var c_context = c_canvas.getContext('2d');
    var c_height = c_context.canvas.height;
    var c_width = c_context.canvas.width;
    var c_r = c_width / 2;
    var c_lineWidth = c_width/200;
} catch (error) {}



//�𧒄��蠘�峕艶
function drawBackground() {
    c_context.save();
    c_context.translate(c_r, c_r);
    c_context.beginPath();
    c_context.lineWidth = 8*c_lineWidth;
    c_context.strokeStyle = "#000"
    c_context.arc(0, 0, c_r - 5*c_lineWidth, 0, 2 * Math.PI, false);
    c_context.stroke();
    c_context.closePath();
//�滚�撠𤩺𧒄�㺭
    var houseNumble = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2];
    houseNumble.forEach(function (number, i) {
        c_context.textAlign = 'center';
        c_context.textBaseline = 'middle'
        c_context.font = 18*c_lineWidth+'px Arial'
        var rad = 2 * Math.PI / 12 * i;
        var x = Math.cos(rad) * (c_r - 30*c_lineWidth);
        var y = Math.sin(rad) * (c_r - 30*c_lineWidth);
        c_context.fillText(number, x, y);
    })

//摰帋�匧�摨�
    for (var i = 0; i < 60; i++) {
        var rad = 2 * Math.PI / 60 * i;
        var x = Math.cos(rad) * (c_r - 18*c_lineWidth);
        var y = Math.sin(rad) * (c_r - 18*c_lineWidth);
        c_context.beginPath();
        if (i % 5 == 0) {
            c_context.fillStyle = "#000"
            c_context.arc(x, y, 2*c_lineWidth, 0, 2 * Math.PI);
        } else {
            c_context.fillStyle = "#ccc"
            c_context.arc(x, y, 2*c_lineWidth, 0, 2 * Math.PI);
        }

        c_context.fill();
        c_context.closePath();
    }
}
//摰帋�㗇𧒄���
function drawHour(hour,minute) {
    c_context.save();
    c_context.beginPath();
    c_context.lineWidth = 6*c_lineWidth;
    c_context.lineCap = 'round'
    var rad = 2 * Math.PI / 12 * hour;
    var mrad = 2* Math.PI/12/60 * minute;
    c_context.rotate(rad+mrad);
    c_context.moveTo(0, 10*c_lineWidth);
    c_context.lineTo(0, -c_r / 2);
    c_context.stroke();
    c_context.restore();
}
//摰帋�匧����
function drawMinute(minute) {
    c_context.save();
    c_context.beginPath();
    c_context.lineWidth = 3*c_lineWidth;
    c_context.lineCap = 'round';
    var rad = 2 * Math.PI / 60 * minute;
    c_context.rotate(rad);
    c_context.moveTo(0, 15*c_lineWidth);
    c_context.lineTo(0, -c_r + 34)
    c_context.stroke();
    c_context.restore();
}
//摰帋�厩�㘾��
function drawSecond(second) {
    c_context.save();
    c_context.beginPath();
    c_context.lineWidth = 2*c_lineWidth;
    c_context.lineCap = 'round';
    c_context.fillStyle = "red"
    var rad = 2 * Math.PI / 60 * second;
    c_context.rotate(rad);
    c_context.moveTo(-2 ,20);
    c_context.lineTo( 2, 20);
    c_context.lineTo( 1, -c_r + 18);
    c_context.lineTo( -1, -c_r + 18);
    c_context.fill();
    c_context.restore();
}
//�𤫇銝剖���
function drawDot() {
    c_context.beginPath();
    c_context.fillStyle = "#fff"
    c_context.arc(0, 0, 4*c_lineWidth, 0, 2 * Math.PI, false);
    c_context.fill();
}

//�𧒄�𡢿�遆�㺭嚗諹悟�𧒄���覔�旿敶枏�齿𧒄�𡢿頝喳𢆡
function Draw() {
    try {
    c_context.clearRect(0,0,c_width,c_height);
    var time= new Date();
    var hour =time.getHours();
    var minute = time.getMinutes();
    var second = time.getSeconds();
    drawBackground();
    drawHour(hour,minute);
    drawMinute(minute);
    drawSecond(second);
    drawDot();
    c_context.restore()
 } catch (error) {}
}

Draw();
setInterval(Draw,1000);
