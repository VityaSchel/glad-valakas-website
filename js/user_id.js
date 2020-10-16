let nanoid = function(t=21){
  let e="",r=crypto.getRandomValues(new Uint8Array(t));for(;t--;){let n=63&r[t];e+=n<36?n.toString(36):n<62?(n-26).toString(36).toUpperCase():n<63?"_":"-"}return e
};
if(!cookie.get("_user_id")){
  cookie.set("_user_id",nanoid(36),{
   expires: 999999,
});
}
