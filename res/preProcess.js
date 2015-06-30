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
  var val;

  $("#runcode").empty();
  $("#runcode").append("<b>原始代码为：</b><br>");

  for(i in GVar.original_code){
    //将原始代码逐行处理
    var currentLine = S(GVar.original_code[i]).collapseWhitespace().s.split(' ');

    //空行跳过
    if(currentLine.length == 1 && S(currentLine[0]).isEmpty()){
      $("#runcode").append("<div class='cbll'>" + GVar.original_code[i] + "&nbsp;</div>");
      continue;
    }

    //判断是否为合法器件（器件类型、器件节点数、器件数值）
    switch (currentLine[0][0]){
      //坏支路数
      case 'R':
      case 'I':
      case 'V': BCENum += 1;
      //检查器件节点
        if(currentLine.length !=4){
          error = true;
          errLine(i);
          continue;
        }
        checkNode(currentLine[1]);
        checkNode(currentLine[2]);
      //检查器件数值
        val = numProcess(currentLine[3]);
        if(val = 'err'){
          error = true;
          errLine(i);
          continue;
        }

        break;

      //坏支路数
      case 'G':
      case 'E': BCENum += 1;
      case 'H': BCENum += 2;
      case 'F': BCENum += 1;
      //检查器件节点
        if(currentLine.length !=6){
          error = true;
          errLine(i);
          continue;
        }
        checkNode(currentLine[1]);
        checkNode(currentLine[2]);
        checkNode(currentLine[3]);
        checkNode(currentLine[4]);
      //检查器件数值
        val = numProcess(currentLine[5]);
        if(val = 'err'){
          error = true;
          errLine(i);
          continue;
        }

        break;
      default:
        error = true;
        errLine(i);
        continue;
    }

      GVar.digested_code.push(currentLine);
      $("#runcode").append("<div class='cnorm'>" + GVar.original_code[i] + "</div>");
  }

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

  function checkNode(x){
    if(!GVar.nodeDic[x]){
      GVar.nodeDic[x] = true;
      GVar.nodeList.push(x);
    }
  }

  function numProcess(str){
    return 'err';
  }

  function errLine(i){
    $("#runcode").append("<div class='cerr'>" + GVar.original_code[i] + "&nbsp;</div>");
  }
}
