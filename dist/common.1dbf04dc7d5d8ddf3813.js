(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{KksF:function(t,s,r){"use strict";r.d(s,"a",function(){return o});var e=r("lJxs"),n=r("AytR"),i=r("fXoL"),a=r("tk/3");let o=(()=>{class t{constructor(t){this.http=t}addUkraineWord(t){return this.http.post(n.a.fbDbUrl+"/ukraineWords.json",t).pipe(Object(e.a)(s=>Object.assign(Object.assign({},t),{id:s.name})))}getWords(){return this.http.get(n.a.fbDbUrl+"/ukraineWords.json").pipe(Object(e.a)(t=>Object.keys(t).map(s=>Object.assign(Object.assign({},t[s]),{id:s}))))}deleteWord(t){return this.http.delete(`${n.a.fbDbUrl}/ukraineWords/${t}.json`)}}return t.\u0275fac=function(s){return new(s||t)(i.Pb(a.a))},t.\u0275prov=i.Cb({token:t,factory:t.\u0275fac}),t})()},"j/b1":function(t,s,r){"use strict";r.d(s,"a",function(){return e});class e{constructor(t){t&&(this.isVisible=t.isVisible,this.word=t.word,this.translateWord=t.translateWord,this.id=t.id)}}}}]);