var GVar = {
  state : 0,
  original_code : [],
  digested_code : [],
  netNode : 0,
  nodeDic : {},
  nodeList: [],
  BCENum: 0,
  GND : '0'
};

//下一步
function runStep(){
  switch (GVar.state) {
    case 0: break;
    case 1:
      preProcess();
      break;
    default:

  }
}

function run(){
  code = S($('#code').val()).lines();
  prog = [];
  $.each(code, function(i, item){
    prog.push(S(item).collapseWhitespace().s.split(' '));
  });
  mat = [];
  rhs = [];
  nodeNum = 0;
  for(var i = 0; i < code.length; i++){
    mat[i]=[];
    rhs[i]=0;
      for(var j = 0; j < code.length; j++){
        mat[i][j]=0;
      }
  }
  for(var i = 0; i<prog.length; i++){
    var device = prog[i][0][0];
    console.log(device);
    console.log(prog[i]);
    switch(device)
    {
    case 'I':
      var np = prog[i][1];
      var nm = prog[i][2];
      var val = prog[i][3];
      nodeNum = Math.max(nodeNum, np, nm);
      if(np!=0)  rhs[np-1]=parseFloat(val);
      if(nm!=0)  rhs[nm-1]=parseFloat(val);
      console.log(rhs);
      break;
    case 'R':
      var np = prog[i][1];
      var nm = prog[i][2];
      var val = prog[i][3];
      val.replace('k', '000');
      var g = 1/parseFloat(val);
      nodeNum = Math.max(nodeNum, np, nm);
      if(np!=0)  mat[np-1][np-1]=mat[np-1][np-1]+g;
      if(nm!=0)  mat[nm-1][nm-1]=mat[nm-1][nm-1]+g;
      if(np!=0 && nm!=0){
        mat[np-1][nm-1] = mat[np-1][nm-1] - g;
        mat[nm-1][np-1] = mat[nm-1][np-1] - g;
      }
      break;
    case 'G':
      var np = prog[i][1];
      var nm = prog[i][2];
      var ncp = prog[i][3];
      var ncm = prog[i][4];
      var val = prog[i][5];
      var g = parseFloat(val);
      nodeNum = Math.max(nodeNum, np, nm);
      if(np!=0 && ncp!=0) mat[np-1][ncp-1] = mat[np-1][ncp-1] + g;
      if(nm!=0 && ncp!=0) mat[nm-1][ncp-1] = mat[nm-1][ncp-1] - g;
      if(np!=0 && ncm!=0) mat[np-1][ncm-1] = mat[np-1][ncm-1] - g;
      if(nm!=0 && ncm!=0) mat[nm-1][ncm-1] = mat[nm-1][ncm-1] + g;
      break;
    default:
      console.log('error');
      break;
    }
  }
  console.log(mat);

  result = "Matrix = \n"

  for(var i = 0; i< nodeNum; i++){
    var str = "";
    for(var j = 0; j<nodeNum; j++){
      str = str + String(mat[i][j]) + " ";
    }
    str = str + '\n';

    result = result + str;
  }

  result = result + '\n RHS = \n';
  for(var i = 0; i< nodeNum; i++){
    result = result + String(rhs[i]) + '\n';
  }

  console.log(result);

  $("#result").val(result);
}

function processAbort(){
  $("#play").attr("disabled", 'true');
  $("#next").attr("disabled", 'true');
}

//初始化工作
$("#init").click(function(){
  $("#editor").hide();
  $("#constructor").show();

//置零
  GVar.state = 0;
  GVar.original_code = S($('#code').val()).lines();
  GVar.digested_code = [];
  GVar.netNode = 0;
  GVar.nodeDic = {};
  GVar.nodeList = [];
  GVar.BCENum = 0;
  GVar.GND = 0;

  $("#runcode").empty();
  $("#runcode").append("<b>原始代码为：</b><br>");
  for(i in GVar.original_code){
    $("#runcode").append(GVar.original_code[i] + "<br>");
  }

  $("#result").empty();

  $("#play").removeAttr("disabled");
  $("#next").removeAttr("disabled");

  GVar.state++;
});

$('#next').click(runStep);

$('#exit').click(function(){
  $("#editor").show();
  $("#constructor").hide();
});
