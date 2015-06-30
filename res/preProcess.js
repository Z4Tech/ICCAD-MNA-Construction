/*
预处理阶段
将原始代码逐行处理
判断是否为合法器件（器件类型、器件节点数）
判断数值是否合法
转换数值单位

计算节点数和坏支路数
确定节点顺序（字母顺序），确定一个节点为地（0节点优先）
*/
function preProcess(){
  var error = false;

  $("#runcode").empty();
  $("#runcode").append("<b>原始代码为：</b><br>");

  $.each(GVar.original_code, function(i, item){
    //将原始代码逐行处理

    var currentLine = S(item).collapseWhitespace().s.split(' ');

    //空行跳过
    if(currentLine.length == 1 && S(currentLine[0]).isEmpty()){
      $("#runcode").append("<div class='cbll'>" + GVar.original_code[i] + "&nbsp;</div>");
      return;
    }

    //判断是否为合法器件（器件类型、器件节点数）
    

    //判断数值是否合法

    //转换数值单位
      GVar.digested_code.push(currentLine);
      $("#runcode").append("<div class='cnorm'>" + GVar.original_code[i] + "</div>");
  });

  $("#result").empty();

  if(error){
    $("#result").append("<div class='col-md-12 error_alert'>网表代码有误，请检查</div>")
  }
  else{
    $("#result").append("<div class='col-md-6' id = 'netlist'></div>");
    $("#result").append("<div class='col-md-6' id = 'description'></div>");
    $("#netlist").append("<div><b>预处理后网表:</b></div>")
    for(i in GVar.digested_code){
      $("#netlist").append("<div>" + GVar.digested_code[i].join(" ") + "</div>")
    }
  }

  GVar.state++;
}
