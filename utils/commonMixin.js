module.exports = {
inputgetName(e){
    let name=e.currentTarget.dataset.name;
    let id=e.currentTarget.dataset.id;
   
    let nameMap={};
 debugger
    if(name.indexOf(".")){
      let nameList=name.split(".");
      if(this.data[nameList[0]]){
        nameMap[nameList[0]]=this.data[nameList[0]];
      }else{
        nameMap[nameList[0]]={}
      }
      nameMap[nameList[0]][nameList[1]] = e.detail.value
    }else{
     nameMap[name]=e.detail.value
    }
   console.log(nameMap);
   this.setData(nameMap)
  }



}