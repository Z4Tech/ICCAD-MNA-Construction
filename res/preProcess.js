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

    var device = currentLine[0][0];
    //判断是否为合法器件（器件类型、器件节点数、器件数值）
    switch (device){
      case 'R':
      case 'I':
      case 'V':
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
        if(val == 'err'){
          error = true;
          errLine(i);
          continue;
        }
        currentLine[3] = val;
        //坏支路数
        if(device == 'V') GVar.BCENum += 1;
        break;

      case 'G':
      case 'E':
      case 'H':
      case 'F':
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
        if(val == 'err'){
          error = true;
          errLine(i);
          continue;
        }
        currentLine[5] = val;
      //坏支路数
        if(device == 'E' || device =='F') GVar.BCENum += 1;
        else if(device == 'H') GVar.BCENum += 2;
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
    $("#result").append("<div class='col-md-12 error_alert'>网表代码有误，请检查</div>");
  }
  else{
    $("#result").append("<div class='col-md-6' id = 'netlist'></div>");
    $("#result").append("<div class='col-md-6' id = 'description'></div>");
    $("#netlist").append("<div><b>预处理后网表:</b></div>")
    for(i in GVar.digested_code){
      $("#netlist").append("<div>" + GVar.digested_code[i].join(" ") + "</div>");
    }

    GVar.nodeList.sort();
    if(GVar.nodeDic['0']) GVar.GND = '0';
    else GVar.GND = nodeList[0];

    $("#description").append("<div>共有<b>" + GVar.nodeList.length + "</b>个节点</div>");
    $("#description").append("<div>共有<b>" + GVar.BCENum + "</b>条坏支路</div>");
    $("#description").append("<div>选取<b>" + GVar.GND + "</b>节点为GND</div>");
  }

  GVar.state++;

  function checkNode(x){
    if(!GVar.nodeDic[x]){
      GVar.nodeDic[x] = true;
      GVar.nodeList.push(x);
    }
  }

  function numProcess(str){
    var reg = new RegExp("^[-+]?[0-9]*.?[0-9]+([eE][-+]?[0-9]+)?[GMKkmunpf]?$");
    if(!reg.test(str)){
      console.log(str + '不是数字');
      return 'err';
    }
    var val = parseFloat(str);
    var unitReg = new RegExp("[GMKkmunpf]");
    var unit = str.match(unitReg);
    console.log(unit);
    if(unit){
      switch (unit[0]) {
        case 'G': val*=1e9;
          break;
        case 'M': val*=1e6;
          break;
        case 'K':
        case 'k':
          val*=1e3;
          break;
        case 'm': val*=1e-3;
          break;
        case 'u': val*=1e-6;
          break;
        case 'n': val*=1e-9;
          break;
        case 'p': val*=1e-12;
          break;
        case 'f': val*=1e-15;
          break;
        default:
      }
    }
    return val;
  }

  function errLine(i){
    $("#runcode").append("<div class='cerr'>" + GVar.original_code[i] + "&nbsp;</div>");
  }
}
