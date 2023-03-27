var le=Object.defineProperty;var ce=(n,t,i)=>t in n?le(n,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):n[t]=i;var y=(n,t,i)=>(ce(n,typeof t!="symbol"?t+"":t,i),i);import{j as c,a as e,r as g,u as B,b as P,c as de,L,N as x,i as O,F as k,S as T,n as he,d as H,e as M,G as ue,f as pe,l as me,g as fe,B as ge,h as ye,k as ve,A as be,m as we,o as Se,p as K,q as J,s as Ie,t as Ae,v as Y,w as Ne,x as ke,y as xe,z as te,C as Ce,M as De,D as Le,Z as Ee,E as Be,P as Pe,O as Te,H as Me,I as We,R as Ue,J as $e}from"./vendor.ab748f24.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function i(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerpolicy&&(s.referrerPolicy=a.referrerpolicy),a.crossorigin==="use-credentials"?s.credentials="include":a.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(a){if(a.ep)return;a.ep=!0;const s=i(a);fetch(a.href,s)}})();function je(){return c("main",{id:"credits",children:[e("div",{className:"flex-spacer"}),c("article",{children:[e("h1",{children:"Credits"}),c("section",{children:[e("h2",{children:"Project Wranglers"}),c("dl",{children:[e("dt",{children:"Kaiama L. Glover"}),e("dd",{children:"Barnard College, Columbia University"}),e("dt",{children:"Alex Gil"}),e("dd",{children:"Columbia University Libraries"})]})]}),c("section",{children:[e("h2",{children:"Contributors"}),e("h3",{children:"Dus\xE9 Mohamed Ali"}),c("dl",{children:[e("dt",{children:"Marina Bilbija"}),e("dd",{children:"Williams College"})]}),e("h3",{children:"Kamau Brathwaite"}),c("dl",{children:[e("dt",{children:"Kelly Baker Josephs"}),e("dd",{children:"York College, CUNY"}),e("dt",{children:"Clara Pomi"}),e("dd",{children:"Williams College"})]}),e("h3",{children:"Aim\xE9 C\xE9saire"}),c("dl",{children:[e("dt",{children:"Alex Gil"}),e("dd",{children:"Columbia University"}),e("dt",{children:"Kora V\xE9ron Lebl\xE9"}),e("dd",{children:"Institut de Textes et Manuscrits, CNRS"})]}),e("h3",{children:"Maryse Cond\xE9"}),c("dl",{children:[e("dt",{children:"Soraya Limare"}),e("dd",{children:"Columbia University"})]}),e("h3",{children:"Ren\xE9 Depestre"}),c("dl",{children:[e("dt",{children:"Kaiama L. Glover"}),e("dd",{children:"Barnard College, Columbia University"})]}),e("h3",{children:"W.E.B. Du Bois"}),c("dl",{children:[e("dt",{children:"Roopika Risam"}),e("dd",{children:"Salem State University"})]}),e("h3",{children:"Katherine Dunham"}),c("dl",{children:[e("dt",{children:"Joanna Dee Das"}),e("dd",{children:"Washington University in St. Louis"}),e("dt",{children:"Laurent Dubois"}),e("dd",{children:"Duke University"})]}),e("h3",{children:"C.L.R. James"}),c("dl",{children:[e("dt",{children:"Amanda Perry"}),e("dd",{children:"Champlain College-Saint Lambert"})]}),e("h3",{children:"Wifredo Lam"}),c("dl",{children:[e("dt",{children:"Tao Goffe"}),e("dd",{children:"Cornell University"})]}),e("h3",{children:"George Lamming"}),c("dl",{children:[e("dt",{children:"Amanda Perry"}),e("dd",{children:"Champlain College-Saint Lambert"})]}),e("h3",{children:"Claude McKay"}),c("dl",{children:[e("dt",{children:"Raphael Dalleo"}),e("dd",{children:"Bucknell University"})]}),e("h3",{children:"Eslanda Goode Robeson"}),c("dl",{children:[e("dt",{children:"Annette Joseph-Gabriel"}),e("dd",{children:"University of Michigan"})]})]}),c("section",{children:[e("h2",{children:"Designers"}),c("dl",{children:[e("dt",{children:"Buck Wanner"}),e("dd",{children:"Columbia University"}),e("dd",{children:"Visualization Design"}),e("dt",{children:"Emily Fuhrman"}),e("dd",{children:"Columbia University"}),e("dd",{children:"Visualization & Project Design"}),e("dt",{children:"Alyssa Van"}),e("dd",{children:"Stanford University"}),e("dd",{children:"Data Analyst"}),e("dt",{children:"Dean Irvine"}),e("dd",{children:"Agile Humanities Agency"}),e("dd",{children:"Project Consultant"}),e("dt",{children:"Bill Kennedy"}),e("dd",{children:"Agile Humanities Agency"}),e("dd",{children:"Visualization, UI/UX and Production Design"}),e("dd",{children:"System Design"})]})]}),c("section",{children:[e("h2",{children:"Developers"}),c("dl",{children:[e("dt",{children:"Rainer Simon"}),e("dd",{children:"Freelance software developer"})]}),c("dl",{children:[e("dt",{children:"Jamie Folsom"}),e("dt",{children:"Ben Silverman"}),e("dd",{children:"Performant Software"})]})]}),c("section",{children:[e("h2",{children:"Acknowledgements"}),c("p",{className:"acknowledgements",children:[e("strong",{children:"In the Same Boats"})," has received generous support from the Barnard College Digital Humanities Center, the Columbia University Graduate School of Arts and Sciences, the Duke University Forum for Scholars and Publics, the Schomburg Center for Research in Black Culture, the University of Virginia."]})]}),e("hr",{}),e("small",{children:"N.B. Affiliations listed on our credits page reflect the contributor's affiliation at the moment of their contribution."})]})]})}const Oe=()=>{var d,u;const[n,t]=g.exports.useState(!1),i=B().listAuthors(),{search:r,setFilter:a}=P(),s=((u=(d=r.args.filters)==null?void 0:d.find(h=>h.name==="authors"))==null?void 0:u.values)||[],l=h=>()=>{const p=s.includes(h)?s.filter(w=>w!==h):[...s,h];a({name:"authors",values:p})};return c("div",{className:"author-select",children:[c("h2",{children:[e("span",{children:"Select Authors"}),e("button",{className:"select-all",onClick:()=>{s.length<i.length?a({name:"authors",values:i.map(h=>h.id)}):a({name:"authors",values:[]})},children:s.length<i.length?e("span",{children:"Select all"}):e("span",{children:"Deselect all"})})]}),e("input",{id:"mobile-authorselect-toggle",name:"mobile-authorselect-toggle",type:"checkbox",checked:n,onChange:()=>{t(h=>!h)},"aria-hidden":"true"}),e("label",{htmlFor:"mobile-authorselect-toggle","aria-hidden":"true"}),e("ul",{children:i.map(h=>c("li",{children:[e("input",{type:"checkbox",id:`${h.id}-checkbox`,name:h.id,checked:s.includes(h.id),onChange:l(h.id)}),e("label",{htmlFor:`${h.id}-checkbox`,style:{"--color":`rgba(${h.color.join(",")})`},children:h.name})]},h.id))})]})};function ne(){const n=de(),[t,i]=g.exports.useState(!1);return g.exports.useEffect(()=>{i(!1)},[n]),e("header",{children:c("nav",{children:[e("div",{className:"home",children:e(L,{to:"/",children:e("span",{children:"In The Same Boats"})})}),e("input",{id:"mobile-nav-toggle",name:"mobile-nav-toggle",type:"checkbox",checked:t,onChange:()=>{i(r=>!r)}}),e("label",{htmlFor:"mobile-nav-toggle",children:e("svg",{focusable:"false",viewBox:"0 0 24 24","aria-hidden":"true",children:e("path",{d:"M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"})})}),c("ul",{children:[e("li",{children:e(x,{to:"instructions",children:"Instructions"})}),e("li",{children:e(x,{to:"trajectories",children:"Trajectories"})}),e("li",{children:e(x,{to:"intersections",children:"Intersections"})}),e("li",{children:e(x,{to:"search",children:"Search"})}),e("li",{children:e(x,{to:"credits",children:"Credits"})})]})]})})}const _=n=>{if(n.id)return n;if(n.id=n["@id"],delete n["@id"],!n.id)throw{message:"Missing node ID",node:n};return n},ie=(n,t)=>n.reduce((i,r)=>((i[r[t]]=i[r[t]]||[]).push(r),i),{}),V=n=>{const t=[...n];return t.sort((i,r)=>{const[a,s]=q(i),[l,o]=q(r),d=a<=l&&s<=o,u=l<=a&&o<=s;return d?-1:u?1:a<=l?-1:1}),t},Re=(n,t)=>{const i=new Set(n.map(s=>s.id)),r=n.find(s=>{let l;return t.forEachLinkedNode(s.id,(o,d)=>{d.data.relation==="previous"&&(l=d.toId)},!0),!l||!i.has(l)}),a=(s,l=[s])=>{let o;return t.forEachLinkedNode(s.id,(d,u)=>{u.data.relation=="previous"&&u.toId===s.id&&(o=d.data)},!1),o?a(o,[...l,o]):l};return a(r).filter(s=>i.has(s.id))},Ve=(n,t)=>{const[i,r]=t;if(n.start&&n.end){const a=new Date(n.start.earliest||n.start.in),s=new Date(n.end.latest||n.end.in);return a>=new Date(i)&&s<=new Date(r)}else if(n.start){const a=new Date(n.start.earliest||n.start.in);return a>=new Date(i)&&a<=new Date(r)}else if(n.end){const a=new Date(n.end.latest||n.end.in);return a>=new Date(i)&&a<=new Date(r)}return!1},Fe=(n,t)=>n.filter(i=>i.when.timespans.map(r=>Ve(r,t)).every(Boolean)),F=(n,t=null)=>{var r,a;if(!((r=n.when)!=null&&r.timespans)||n.when.timespans.length===0)return null;const i=(a=n.when.timespans.find(s=>s.start))==null?void 0:a.start;return i?t?i[t]:i.in||i.earliest||i.latest:null},G=(n,t=null)=>{var r,a;if(!((r=n.when)!=null&&r.timespans)||n.when.timespans.length===0)return null;const i=(a=n.when.timespans.find(s=>s.end))==null?void 0:a.end;return i?t?i[t]:i.in||i.latest||i.earliest:null},C=n=>{const t=F(n);return t?new Date(t):null},D=n=>{const t=G(n);return t?new Date(t):null},q=n=>{const t=C(n),i=D(n);if(t||i)return[t||i,i||t]},z=n=>{const t=F(n),i=G(n);if(t&&i)return`${t} \u2013 ${i}`;if(t||i)return t||i},Ge=n=>{const t=n.id,i=n.target[0].id,a=n.body.value.map((s,l)=>({...s,author:i,place:s.id,type:"waypoint",id:`${t}/wp/${l}`}));return V(a)},re=(n,t)=>(n||[]).reduce((i,r)=>{const{waypoints:a}=r;return[...i,...a.filter(s=>s.place===t)]},[]),ae=(n,t)=>{var a;if(!((a=n.when)!=null&&a.timespans)||n.when.timespans.length===0)return;const i=C(n),r=D(n);if(i&&r)if(O(i,r))console.warn("Invalid time interval",i,"to",r);else return{waypoint:n,start:i,end:r,likelihood:3};else return ze(n,t)},ze=(n,t)=>{const i=C(n),r=D(n);if(i){const a=t.getNextWaypoint(n);if(a){const s=C(a)||D(a),l=!!F(a,"in");if(s)if(O(i,s))console.warn("Invalid time interval",i,"to",s);else return{waypoint:n,start:i,end:s,likelihood:l?2:1}}}else if(r){const a=t.getPreviousWaypoint(n);if(a){const s=D(a)||C(a),l=!!G(a,"in");if(s)if(O(s,r))console.warn("Invalid time interval",s,"to",r);else return{waypoint:n,start:s,end:r,likelihood:l?2:1}}}};const He=n=>{var o;const{at:t}=n,i=B(),{search:r}=P(),a=t?(o=r.result)==null?void 0:o.items:null,s=V(re(a,t==null?void 0:t.id)),l=d=>{var u;return(u=ae(d,i))==null?void 0:u.likelihood};return e("div",{className:"intersection-details",children:t?c(k,{children:[e("h1",{children:t.properties.title}),e("ul",{children:s.map(d=>c("li",{className:`likelihood-${l(d)}`,children:[e("span",{className:"wp-author",children:i.getNode(d.author).name})," ",e("span",{className:"wp-interval",children:z(d)})]},d.id))})]}):c(k,{children:[e("h1",{children:"Select a city"}),e("p",{children:"Enable authors in the left panel to find their possible points of intersection."}),e("p",{children:"As cities of intersection appear on the map, click on a city to see the dates and likelihood of each author's presence."})]})})},Ke=n=>{const{search:t,setSearchState:i}=P(),r=B();return g.exports.useEffect(()=>{var a,s,l,o;if(t.status===T.PENDING){const d=((s=(a=t.args.filters)==null?void 0:a.find(p=>p.name==="authors"))==null?void 0:s.values)||[],u=(o=(l=t.args.filters)==null?void 0:l.find(p=>p.name==="daterange"))==null?void 0:o.range,h=r.listItineraries(u).filter(p=>d.includes(p.author));i({args:t.args,status:T.OK,result:{total:h.length,items:h}})}},[t]),g.exports.useEffect(()=>{i({args:{},status:T.PENDING})},[r]),n.children};class Je{constructor(){y(this,"init",(t,i,r)=>{this.graph.clear(),this.graph.beginUpdate();const a=t.map(_),s=i.map(_);[...a,...s].forEach(o=>{this.graph.addNode(o.id,o),this.fulltextIndex.add(o)});const l=r.reduce((o,d)=>[...o,...Ge(d)],[]).filter(o=>{const d=this.exists(o.author,o.place);return d||console.warn("Skipping unconnected node",o),d});l.forEach(o=>{this.graph.addNode(o.id,o),this.fulltextIndex.add(o)}),l.forEach(o=>{const d=o.id,u=o.author;this.graph.addLink(d,u,{relation:"visitedBy"})}),l.forEach(o=>{const d=o.id,u=o.place;this.graph.addLink(d,u,{relation:"locatedAt"})}),l.reduce((o,d)=>{if(o&&o.author===d.author){const u=d.id,h=o.id;this.graph.addLink(u,h,{relation:"previous"})}return d},null),this.graph.endUpdate()});y(this,"exists",(...t)=>{if(t.length>0)return t.every(i=>this.getNode(i))});y(this,"listNodesWithProperty",(t,i)=>{const r=[];return this.graph.forEachNode(a=>{a.data[t]===i&&r.push(a.data)}),r});y(this,"getLinksOfType",(t,i)=>{const r=[];return this.graph.forEachLinkedNode(t,(a,s)=>{s.data.relation===i&&r.push(s)},!1),r});y(this,"getNode",t=>{var i;return(i=this.graph.getNode(t))==null?void 0:i.data});y(this,"listAuthors",()=>this.listNodesWithProperty("@type","Person"));y(this,"listPlaces",()=>this.listNodesWithProperty("type","Feature"));y(this,"listItineraries",t=>{const i=this.listNodesWithProperty("type","waypoint"),r=t?Fe(i,t):i,a=ie(r,"author");return Object.entries(a).map(([s,l])=>({author:s,waypoints:Re(l,this.graph)}))});y(this,"getItineraryForAuthor",t=>this.getLinksOfType(t,"visitedBy").map(i=>this.getNode(i.fromId)));y(this,"getWaypointsAt",t=>this.getLinksOfType(t,"locatedAt").map(i=>this.getNode(i.fromId)));y(this,"getNextWaypoint",t=>{const r=this.getLinksOfType(t.id,"previous").find(a=>a.toId===t.id);return r&&this.getNode(r.fromId)});y(this,"getPreviousWaypoint",t=>{const r=this.getLinksOfType(t.id,"previous").find(a=>a.fromId===t.id);return r&&this.getNode(r.toId)});y(this,"search",t=>this.fulltextIndex.search(M.remove(t)).map(i=>i.item));this.graph=he(),this.fulltextIndex=new H([],{ignoreLocation:!0,threshold:.25,keys:["name","properties.title","citations.label","relation.label"],getFn:(t,i)=>{const r=H.config.getFn(t,i);if(Array.isArray(r))return r.map(M.remove);if(r)return M.remove(r)}})}}const Ye=n=>{const[t,i]=g.exports.useState();return g.exports.useEffect(()=>{const{authors:r,places:a,itineraries:s}=n;if(r&&a&&s){const l=new Je;l.init(r,a,s),i(l)}},[n.authors,n.places,n.itineraries]),e(ue.Provider,{value:t,children:t&&n.children})},_e=n=>e(Ye,{...n,children:e(Ke,{children:n.children})});class qe{constructor(t,i){y(this,"addOneItinerary",(t,i)=>{i.forEach(r=>{const a=ae(r,this.graph);if(a){const s=pe(a);this.addToPresence(r.place,t,s,a.likelihood)}else console.warn("No interval for waypoint",r)})});y(this,"addToPresence",(t,i,r,a)=>{this.presence[t]||(this.presence[t]={}),r.forEach(s=>{this.presence[t][s]?this.presence[t][s].push({author:i,likelihood:a}):this.presence[t][s]=[{author:i,likelihood:a}]})});this.graph=i,this.presence=[],t.forEach(({author:r,waypoints:a})=>this.addOneItinerary(r,a))}}const Xe=me().domain([0,10]).range([6,36]),Ze=(n,t)=>{const{presence:i}=n;return Object.entries(i).map(([a,s])=>{const l=t.getNode(a),o=Object.entries(s).filter(([u,h])=>h.length<2?!1:new Set(h.map(w=>w.author)).size>1),d={};return o.length>0&&o.forEach(([,u])=>{u.forEach(({author:h,likelihood:p})=>{d[h]&&d[h].add(p),d[h]=new Set([p])})}),{...l,present:d}}).filter(a=>Object.keys(a.present).length>0)},W=(n,t)=>{let i=0;return Object.values(n.present).forEach(r=>{r.has(t)&&i++}),i},Qe=({selected:n})=>(t,i)=>{const r=new qe(t,i),a=Ze(r,i);return[1,2,3].map(s=>new fe({id:`scatterplot-${s}`,data:a,pickable:!0,opacity:.8,stroked:!0,filled:!0,radiusUnits:"pixels",lineWidthUnits:"pixels",getPosition:l=>l.geometry.coordinates,getRadius:l=>{let o=W(l,3);return s<3&&(o+=W(l,2)),s===1&&(o+=W(l,1)),Xe(o)},getFillColor:l=>{let o=255;return s==2?o=.5*255:s==1&&(o=.25*255),(n==null?void 0:n.id)===l.id?[65,105,225,o]:[252,176,64,o]},getLineColor:l=>(n==null?void 0:n.id)===l.id?[0,0,0,144]:[200,100,0,144]}))};function et(n){const{onClick:t,visible:i}=n;return c(k,{children:[c("legend",{id:"intersection-legend",className:i?"visible":"hidden",children:[e("h2",{children:"Legend"}),e("button",{type:"button",onClick:t,"aria-label":"Click to collapse legend",children:e(ge,{})}),e("p",{children:"Rings indicate possible intersections."}),c("svg",{viewBox:"-1 -1 14 14",xmlns:"http://www.w3.org/2000/svg",children:[e("title",{children:"A graphic of concentric rings representing possible intersections"}),e("circle",{className:"outer",cx:6,cy:6,r:6}),e("circle",{className:"middle",cx:6,cy:6,r:4}),e("circle",{className:"inner",cx:6,cy:6,r:2})]}),e("p",{children:"Solid circles indicate definite intersections."}),c("svg",{viewBox:"-1 -1 14 14",xmlns:"http://www.w3.org/2000/svg",children:[e("title",{children:"A graphic of a single solid circle representing a definite intersection"}),e("circle",{className:"inner",cx:6,cy:6,r:6})]})]}),e("button",{id:"expand-legend",className:"p6o-controls-btn",onClick:t,"aria-label":"Click to expand/collapse legend",children:e(ye,{})})]})}const X=6,tt=22,nt=(n,t)=>{const i=[];for(let r=1;r<n.length;r++)i.push({from:t.getNode(n[r-1].place).geometry,to:t.getNode(n[r].place).geometry});return i};function it(n,t){const i=[],r=new Set(n.map(a=>a.author));return n.forEach(({waypoints:a})=>{a.forEach(s=>{i.some(l=>l.id===s.place)||i.push(t.getNode(s.place))})}),i.map(a=>{const l=t.getWaypointsAt(a.id).filter(o=>r.has(o.author));return{...a,properties:{...a.properties,wpCount:l.length}}})}const rt=()=>(n,t)=>{const i=it(n,t),r=i.reduce((s,l)=>{const o=l.properties.wpCount;return s<o?o:s},0),a=(tt-X)/(r-1);return[new ve({id:"trajectories-places",data:i,pickable:!0,filled:!0,stroked:!0,lineWidthUnits:"pixels",getLineColor:[252,176,64,220],getFillColor:[252,176,64,180],getPointRadius:s=>{const{wpCount:l}=s.properties;return a*(l-1)+X},pointRadiusUnits:"pixels",getLineWidth:2,pointType:"circle"}),...n.map(({author:s,waypoints:l})=>{const o=nt(l,t),{color:d}=t.getNode(s);return new be({id:`${s}/trajectory`,data:o,pickable:!1,getWidth:1.5,widthMinPixels:1,getHeight:1,getTilt:10,greatCircle:!1,getSourcePosition:u=>u.from.coordinates,getTargetPosition:u=>u.to.coordinates,getSourceColor:d,getTargetColor:d})})]};function at({graph:n,object:t,search:i}){var r,a;if(t!=null&&t.present)return(r=t.properties)==null?void 0:r.title;if(t){const s=[`<h2>${((a=t.properties)==null?void 0:a.title)||"Place"}</h2>`,"<ul>"],l=V(re(i.result.items,t.id)),o=l.filter(u=>{var h;return!((h=u.relation)!=null&&h.label)}),d=o.length!==l.length;if(l.forEach(u=>{const{author:h,relation:p,when:w}=u;if(p.label||!d){const{name:A}=n.getNode(h);let f=p.label?`${A}: ${p.label}`:A;w.timespans.length&&(f=`${f} (${z(u)})`),s.push(`<li>${f}</li>`)}}),d&&o.length){const u=ie(o,"author");Object.keys(u).forEach(h=>{const{name:p}=n.getNode(h);s.push(`<li>+ ${u[h].length} additional visit(s) by ${p}</li>`)})}return s.push("</ul>"),{html:s.join(`
`)}}}function Z(n,t){const i=g.exports.useRef();g.exports.useEffect(()=>{i.current=n},[n]),g.exports.useEffect(()=>{function r(){i.current()}if(t!==null){let a=setInterval(r,t);return()=>clearInterval(a)}},[t])}const R="yyyy-MM",E=n=>Se(n,R),se=n=>Ne(new Date(`${n}-02T00:00:00`)),oe=n=>ke(new Date(`${n}-02T00:00:00`)),b=n=>n.length===R.length&&Ie(n,R),Q=(n,t)=>Ae(se(n),oe(t)),U=E(new Date(1850,0,1)),$=E(we());function st(){var f,S;const{search:n,setFilter:t}=P(),i=((S=(f=n.args.filters)==null?void 0:f.find(m=>m.name==="daterange"))==null?void 0:S.range)||[U,$],[r,a]=g.exports.useState({from:i[0],to:i[1]}),[s,l]=g.exports.useState(500),[o,d]=g.exports.useState(null);Z(()=>{o&&u(o.chosenDate,o.increment)},o?s:null),Z(()=>{s>10&&o&&l(s/2)},o?1e3:null),g.exports.useEffect(()=>{const{from:m,to:v}=r;m&&v&&b(m)&&b(v)&&Q(m,v)&&t({name:"daterange",range:[m,v]})},[r]);function u(m,v){m.startsWith("start")?a(I=>{const N=Y(se(I.from),v);return{from:E(N),to:I.to}}):m.startsWith("end")&&a(I=>{const N=Y(oe(I.to),v);return{from:I.from,to:E(N)}})}function h(m){return v=>{u(v.currentTarget.name,m),d({chosenDate:v.currentTarget.name,increment:m})}}function p(){d(null),l(500)}function w(m){m.currentTarget.type==="text"&&(m.key==="ArrowUp"?u(m.currentTarget.name,1):m.key==="ArrowDown"&&u(m.currentTarget.name,-1))}function A(m){const{name:v,value:I}=m.target;v==="start-date"?a(N=>({from:I,to:N.to})):v==="end-date"&&a(N=>({from:N.from,to:I}))}return c("fieldset",{id:"month-range-input",children:[c("div",{children:[c("div",{className:"button-container",children:[e("button",{className:"up",disabled:!b(r.from),name:"start-up",onMouseDown:h(1),onMouseUp:p,children:e(K,{})}),e("button",{className:"down",disabled:!b(r.from),name:"start-down",onMouseDown:h(-1),onMouseUp:p,children:e(J,{})})]}),e("input",{type:"month",id:"start-date",name:"start-date",min:U,max:$,value:r.from,onChange:A,onKeyDown:b(r.from)?w:()=>{},className:b(r.from)?"":"invalid"}),"\u2013",e("input",{type:"month",id:"end-date",name:"end-date",min:U,max:$,value:r.to,onChange:A,onKeyDown:b(r.to)?w:()=>{},className:b(r.to)?"":"invalid"}),c("div",{className:"button-container",children:[e("button",{className:"up",disabled:!b(r.to),name:"end-up",onMouseDown:h(1),onMouseUp:p,children:e(K,{})}),e("button",{className:"down",disabled:!b(r.to),name:"end-down",onMouseDown:h(-1),onMouseUp:p,children:e(J,{})})]})]}),c("div",{children:[(!b(r.from)||!b(r.to))&&e("p",{className:"error",children:"Dates must be in the format YYYY-MM."}),!Q(r.from,r.to)&&e("p",{className:"error",children:"Start date must be before or equal to end date."})]})]})}function ot(){const n=xe();return c(k,{children:[e(ne,{}),e("main",{id:"error",children:c("article",{children:[e("h2",{children:`${n.status||500} ${n.statusText||"Internal Server Error"}`}),e("p",{children:"This page could not be displayed."})]})})]})}function lt(){return c("main",{id:"home",children:[e("div",{className:"flex-spacer"}),c("article",{children:[e("h1",{children:"Welcome"}),c("aside",{children:[c("section",{className:"vis-info",children:[e("h2",{children:"Trajectories"}),e("p",{children:"This visualization presents an interactive narrative overview of one or more individuals' movements through space over time. The timeline function allows for the researcher to consider specific periods or phases, individually or in comparison with other figures."}),e(L,{className:"btn",to:"/trajectories",children:"View trajectories"})]}),c("section",{className:"vis-info",children:[e("h2",{children:"Intersections"}),e("p",{children:"This visualization presents an interactive snapshot overview of the world map that reflects the presence of Afro-Atlantic figures in particular geographical locations at particular points in time. Clicking on a given city which figures were present in that place and when they were there."}),e(L,{className:"btn",to:"/intersections",children:"View intersections"})]})]}),c("p",{children:[e("strong",{children:"In the Same Boats"})," is a work of multimodal scholarship designed to encourage the collaborative production of humanistic knowledge within scholarly communities. The platform comprises two interactive visualizations that trace the movements of significant cultural actors from the Caribbean and wider Americas, Africa, and Europe within the 20th century Afro-Atlantic world. It presents opportunities for unearthing the extent to which Caribbean, Latin American, African, European, and Afro-American intellectuals have been in both punctual and sustained conversation with one another: attending the same conferences, publishing in the same journals and presses, active in the same political groups, perhaps even elbow-to-elbow in the same Parisian caf\xE9s and on the same transatlantic crossings\u2014literally and metaphorically"," ",e("strong",{children:"in the same boats"}),"\u2014as they circulate throughout the Americas, Africa, Europe, and beyond."]}),e("p",{children:"One of the greatest challenges for postcolonial scholars of Africa and its diasporas is that of navigating nation-language frontiers that are the legacies of colonialism. The partitioning of the postcolonial into anglophone, francophone, hispanophone, and lusophone spaces persists\u2014despite being in so many ways at odds with the shared socio-cultural and historical realities of the Afro-Atlantic. Same Boats pushes back against the academic balkanization of black Atlantic intellectual production, retracing limits and contours largely determined by imperial metropoles."}),e("p",{children:"In presenting a series of individual maps produced on a common template by specialists of the different linguistic regions of the western Atlantic, Same Boats seeks to counter the Euro-lingual constraints and attendant border-drawing that too often keep Caribbeanist, Latin-Americanist, Africanist, Afro-Europeanist, and Afro-Americanist scholars from engaging in deeply transnational and transcolonial dialogue, hindering us from seeing connections or from fully imagining a networked Afro-intellectual world. Literally mapping the network of Afro-diasporic intellectual, political, and aesthetic figures in the 20th century, Same Boats offers visual corroboration of the work of scholars who have long committed to thinking about the Afro-Atlantic as an integrally networked chronotope. This platform aims to facilitate a physical tracing of hemispheric black studies\u2014to provide a point of departure from which to highlight the various sites wherein Afro-Atlantic intellectual traditions may have been born and/or shepherded into the world."}),e("p",{children:"The platform's visualizations sketch a \u201Cbig picture\u201D narrative of Black intellectual and artistic migration, revealing what were the potential points and periods of encounter (\u201CTrajectories\u201D). Upon drilling down into the maps' spatio-temporal intersections, specific nodes of confluence emerge, calling\u2014we hope\u2014for further scholarly exploration (\u201CIntersections\u201D). Indeed, Same Boats is meant to serve above all as an invitation for our community of researchers, students, and educators to flesh out and enrich the scholarly record toward the constitution of a 20th century Afro-Atlantic Republic of Arts and Letters."}),e("p",{children:e(L,{className:"btn",to:"instructions",children:"Learn how it works\u2026"})})]})]})}function ct(){return c("main",{id:"instructions",children:[e("div",{className:"flex-spacer"}),c("article",{children:[e("h1",{children:"Instructions"}),c("section",{children:[e("h2",{children:"Trajectories"}),e("p",{children:"This visualization presents an interactive narrative overview of one or more individuals\u2019 movements through space over time. The date range filter allows for the researcher to consider specific periods or phases. You can select figures individually or you can compare them to others by selecting them."}),c("ol",{children:[e("li",{children:"Select a range of time using the date range filter in the left column. You can click the up and down buttons to adjust the start and end date by month. You can also adjust the months by clicking on the text box containing each date and either typing the month and year, or using the up and down arrow keys on your keyboard. On certain browsers (Chrome, Edge) you may be able to click a calendar icon to choose each month and year on a calendar."}),e("li",{children:"Select one or more authors from the list in the left column."}),e("li",{children:"Once the map has been drawn, you can hover over any dot on the map to read a pop-up note about that particular moment in time for that particular author."})]})]}),c("section",{children:[e("h2",{children:"Intersections"}),e("p",{children:"This visualization presents an interactive snapshot overview of the world map that reflects the presence of Afro-Atlantic figures in particular geographical locations at particular points in time. Clicking on a given city reveals which figures were present in that place and when they were there. We have worked to preserve a sense of ambiguity when a range of time is not certain. This uncertainty is indicated via the transparent aura encircling each dot. The size of the aura indicates the level of ambiguity."}),c("ol",{children:[e("li",{children:"Select a range of time by clicking on the date range in the left column."}),e("li",{children:"Select one or more authors from the list in the left column."}),e("li",{children:"Select a dot on the map to see what figures were at that spot in the same time range."})]})]}),c("section",{children:[e("h2",{children:"Search"}),e("p",{children:"In our search page you can search for authors, dates, keywords and more. Simply type in your search terms in the search box to see the results."})]}),e("hr",{}),c("section",{children:[e("h2",{children:"Get on the Map"}),c("p",{children:["Same Boats is a fundamentally collaborative venture\u2014an invitation of sorts meant to provide our community with the opportunity to participate in the development of a unique platform and to imagine research projects and pedagogical initiatives that transgress the geo-political borders separating the various nations of the Americas. If you\u2019re interested in being a part of this project by proposing an additional figure or in working with one of our existing figures/editors, please contact us at"," ",e("a",{href:"mailto:thesameboats@gmail.com",children:"thesameboats@gmail.com"}),"."]})]})]})]})}function ee(){const{loaded:n}=te(),t=localStorage.getItem("itsb-legend"),[i,r]=g.exports.useState(!t),a=()=>{r(h=>!h),t||localStorage.setItem("itsb-legend","hidden")},[s,l]=g.exports.useState(),o=Ce("trajectories"),d=o?rt():Qe({selected:s}),u=({object:h})=>l(h);return n&&c(k,{children:[c("aside",{id:"map-control",children:[e(st,{}),e(Oe,{})]}),c("main",{id:"map",children:[e(De.MapLibreDeckGL,{mapStyle:"https://api.maptiler.com/maps/streets-v2-light/style.json?key=ivsJw9naVbzcCpzJQ7HN",defaultBounds:[[-142,-52],[178,72]],layers:[d],tooltip:at,onClick:o?null:u},o?"trajectories":"intersections"),e(Le,{children:e(Ee,{})})]}),!o&&c(k,{children:[e("aside",{id:"intersection-details",children:e(He,{at:s})}),e(et,{onClick:a,visible:i})]})]})}const dt=n=>{const{data:t,graph:i}=n;return e("div",{className:t.type,children:t.type==="waypoint"&&c("div",{className:"search-result",children:[e("h3",{className:"title",children:i.getNode(t.author).name}),c("h4",{className:"subhead",children:[t.title," ",c("span",{className:"time",children:["(",z(t),")"]})]}),e("p",{className:"description",children:t.relation.label})]})})};const ht=3;function ut(){const{loaded:n}=te(),t=B(),[i,r]=g.exports.useState([]);return n&&c("main",{id:"search",children:[e("div",{className:"flex-spacer"}),c("section",{className:"search-wrapper",children:[e("form",{action:"#",name:"search",onSubmit:s=>s.preventDefault(),children:e("input",{type:"text",placeholder:"Search authors, cities, notes and citations.",onChange:s=>{const{value:l}=s.target;if(l.length>ht){const o=t.search(l),d=o.filter(f=>f.type==="waypoint"),h=o.filter(f=>f["@type"]==="Person").reduce((f,S)=>[...f,...t.getItineraryForAuthor(S.id)],[]),w=o.filter(f=>f.type==="Feature").reduce((f,S)=>[...f,...t.getWaypointsAt(S.id)],[]),A=[...d,...h,...w].reduce((f,S)=>f.find(v=>v.id===S.id)?f:[...f,S],[]);r(A)}else r([])}})}),e("div",{id:"search-results",children:i.length===0?e("p",{children:"Begin typing above."}):e("ul",{children:i.map(s=>e("li",{children:e(dt,{data:s,graph:t})},s.id))})})]})]})}function pt(){const[n,t,i]=Be();return c(Pe,{children:[e(ne,{}),e("section",{id:"content-wrapper",children:e(_e,{authors:n.itemListElement,places:t.features,itineraries:i.first.items,children:e(Te,{context:{loaded:n&&t&&i}})})})]})}const j=n=>fetch(n).then(t=>t.json()),mt=async()=>await Promise.all([j("data/authors.json"),j("data/places.json"),j("data/itineraries.json")]),ft=Me([{element:e(pt,{}),errorElement:e(ot,{}),id:"root",loader:mt,path:"/",children:[{index:!0,element:e(lt,{})},{path:"credits",element:e(je,{})},{path:"instructions",element:e(ct,{})},{path:"intersections",element:e(ee,{})},{path:"trajectories",element:e(ee,{})},{path:"search",element:e(ut,{})}]}]);We.createRoot(document.getElementById("app")).render(e(Ue.StrictMode,{children:e($e,{router:ft})}));