function preProcess(){
  var error = false;
  $.each(GVar.original_code, function(i, item){
    var currentLine = S(item).collapseWhitespace().s.split(' ');
    GVar.digested_code.push(currentLine);
  });

  GVar.state++;
}
