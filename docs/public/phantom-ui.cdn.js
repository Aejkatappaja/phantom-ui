"use strict";(()=>{var Mt=Object.defineProperty;var Nt=Object.getOwnPropertyDescriptor;var f=(r,t,e,s)=>{for(var i=s>1?void 0:s?Nt(t,e):t,o=r.length-1,n;o>=0;o--)(n=r[o])&&(i=(s?n(t,e,i):n(i))||i);return s&&i&&Mt(t,e,i),i};var I=globalThis,U=I.ShadowRoot&&(I.ShadyCSS===void 0||I.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,W=Symbol(),ot=new WeakMap,k=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==W)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(U&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=ot.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&ot.set(e,t))}return t}toString(){return this.cssText}},nt=r=>new k(typeof r=="string"?r:r+"",void 0,W),F=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((s,i,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[o+1],r[0]);return new k(e,r,W)},at=(r,t)=>{if(U)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=I.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},G=U?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return nt(e)})(r):r;var{is:Ht,defineProperty:Pt,getOwnPropertyDescriptor:Bt,getOwnPropertyNames:It,getOwnPropertySymbols:Ut,getPrototypeOf:Lt}=Object,L=globalThis,lt=L.trustedTypes,Dt=lt?lt.emptyScript:"",zt=L.reactiveElementPolyfillSupport,R=(r,t)=>r,T={toAttribute(r,t){switch(t){case Boolean:r=r?Dt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},D=(r,t)=>!Ht(r,t),ht={attribute:!0,type:String,converter:T,reflect:!1,useDefault:!1,hasChanged:D};Symbol.metadata??=Symbol("metadata"),L.litPropertyMetadata??=new WeakMap;var _=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ht){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Pt(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:o}=Bt(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:i,set(n){let l=i?.call(this);o?.call(this,n),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ht}static _$Ei(){if(this.hasOwnProperty(R("elementProperties")))return;let t=Lt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(R("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(R("properties"))){let e=this.properties,s=[...It(e),...Ut(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(G(i))}else t!==void 0&&e.push(G(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return at(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:T).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let o=s.getPropertyOptions(i),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:T;this._$Em=i;let l=n.fromAttribute(e,o.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(t!==void 0){let n=this.constructor;if(i===!1&&(o=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??D)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,o]of s){let{wrapped:n}=o,l=this[i];n!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,o,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[R("elementProperties")]=new Map,_[R("finalized")]=new Map,zt?.({ReactiveElement:_}),(L.reactiveElementVersions??=[]).push("2.1.2");var tt=globalThis,dt=r=>r,z=tt.trustedTypes,ct=z?z.createPolicy("lit-html",{createHTML:r=>r}):void 0,bt="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,vt="?"+$,jt=`<${vt}>`,x=document,N=()=>x.createComment(""),H=r=>r===null||typeof r!="object"&&typeof r!="function",et=Array.isArray,qt=r=>et(r)||typeof r?.[Symbol.iterator]=="function",K=`[ 	
\f\r]`,M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ut=/-->/g,pt=/>/g,S=RegExp(`>|${K}(?:([^\\s"'>=/]+)(${K}*=${K}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),mt=/'/g,ft=/"/g,_t=/^(?:script|style|textarea|title)$/i,st=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),C=st(1),oe=st(2),ne=st(3),y=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),gt=new WeakMap,E=x.createTreeWalker(x,129);function yt(r,t){if(!et(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ct!==void 0?ct.createHTML(t):t}var Vt=(r,t)=>{let e=r.length-1,s=[],i,o=t===2?"<svg>":t===3?"<math>":"",n=M;for(let l=0;l<e;l++){let a=r[l],u,d,h=-1,c=0;for(;c<a.length&&(n.lastIndex=c,d=n.exec(a),d!==null);)c=n.lastIndex,n===M?d[1]==="!--"?n=ut:d[1]!==void 0?n=pt:d[2]!==void 0?(_t.test(d[2])&&(i=RegExp("</"+d[2],"g")),n=S):d[3]!==void 0&&(n=S):n===S?d[0]===">"?(n=i??M,h=-1):d[1]===void 0?h=-2:(h=n.lastIndex-d[2].length,u=d[1],n=d[3]===void 0?S:d[3]==='"'?ft:mt):n===ft||n===mt?n=S:n===ut||n===pt?n=M:(n=S,i=void 0);let b=n===S&&r[l+1].startsWith("/>")?" ":"";o+=n===M?a+jt:h>=0?(s.push(u),a.slice(0,h)+bt+a.slice(h)+$+b):a+$+(h===-2?l:b)}return[yt(r,o+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},P=class r{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,n=0,l=t.length-1,a=this.parts,[u,d]=Vt(t,e);if(this.el=r.createElement(u,s),E.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=E.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let h of i.getAttributeNames())if(h.endsWith(bt)){let c=d[n++],b=i.getAttribute(h).split($),v=/([.?@])?(.*)/.exec(c);a.push({type:1,index:o,name:v[2],strings:b,ctor:v[1]==="."?J:v[1]==="?"?X:v[1]==="@"?Z:O}),i.removeAttribute(h)}else h.startsWith($)&&(a.push({type:6,index:o}),i.removeAttribute(h));if(_t.test(i.tagName)){let h=i.textContent.split($),c=h.length-1;if(c>0){i.textContent=z?z.emptyScript:"";for(let b=0;b<c;b++)i.append(h[b],N()),E.nextNode(),a.push({type:2,index:++o});i.append(h[c],N())}}}else if(i.nodeType===8)if(i.data===vt)a.push({type:2,index:o});else{let h=-1;for(;(h=i.data.indexOf($,h+1))!==-1;)a.push({type:7,index:o}),h+=$.length-1}o++}}static createElement(t,e){let s=x.createElement("template");return s.innerHTML=t,s}};function w(r,t,e=r,s){if(t===y)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,o=H(t)?void 0:t._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=w(r,i._$AS(r,t.values),i,s)),t}var Y=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??x).importNode(e,!0);E.currentNode=i;let o=E.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let u;a.type===2?u=new B(o,o.nextSibling,this,t):a.type===1?u=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(u=new Q(o,this,t)),this._$AV.push(u),a=s[++l]}n!==a?.index&&(o=E.nextNode(),n++)}return E.currentNode=x,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},B=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=w(this,t,e),H(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==y&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):qt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&H(this._$AH)?this._$AA.nextSibling.data=t:this.T(x.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=P.createElement(yt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let o=new Y(i,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=gt.get(t.strings);return e===void 0&&gt.set(t.strings,e=new P(t)),e}k(t){et(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let o of t)i===e.length?e.push(s=new r(this.O(N()),this.O(N()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=dt(t).nextSibling;dt(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},O=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(t,e=this,s,i){let o=this.strings,n=!1;if(o===void 0)t=w(this,t,e,0),n=!H(t)||t!==this._$AH&&t!==y,n&&(this._$AH=t);else{let l=t,a,u;for(t=o[0],a=0;a<o.length-1;a++)u=w(this,l[s+a],e,a),u===y&&(u=this._$AH[a]),n||=!H(u)||u!==this._$AH[a],u===p?t=p:t!==p&&(t+=(u??"")+o[a+1]),this._$AH[a]=u}n&&!i&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},J=class extends O{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}},X=class extends O{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}},Z=class extends O{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=w(this,t,e,0)??p)===y)return;let s=this._$AH,i=t===p&&s!==p||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==p&&(s===p||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Q=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){w(this,t)}};var Wt=tt.litHtmlPolyfillSupport;Wt?.(P,B),(tt.litHtmlVersions??=[]).push("3.3.2");var $t=(r,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let o=e?.renderBefore??null;s._$litPart$=i=new B(t.insertBefore(N(),o),o,void 0,e??{})}return i._$AI(r),i};var it=globalThis,A=class extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=$t(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return y}};A._$litElement$=!0,A.finalized=!0,it.litElementHydrateSupport?.({LitElement:A});var Ft=it.litElementPolyfillSupport;Ft?.({LitElement:A});(it.litElementVersions??=[]).push("4.2.2");var Gt={attribute:!0,type:String,converter:T,reflect:!1,hasChanged:D},Kt=(r=Gt,t,e)=>{let{kind:s,metadata:i}=e,o=globalThis.litPropertyMetadata.get(i);if(o===void 0&&globalThis.litPropertyMetadata.set(i,o=new Map),s==="setter"&&((r=Object.create(r)).wrapped=!0),o.set(e.name,r),s==="accessor"){let{name:n}=e;return{set(l){let a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,r,!0,l)},init(l){return l!==void 0&&this.C(n,void 0,r,l),l}}}if(s==="setter"){let{name:n}=e;return function(l){let a=this[n];t.call(this,l),this.requestUpdate(n,a,r,!0,l)}}throw Error("Unsupported decorator location: "+s)};function g(r){return(t,e)=>typeof e=="object"?Kt(r,t,e):((s,i,o)=>{let n=i.hasOwnProperty(o);return i.constructor.createProperty(o,s),n?Object.getOwnPropertyDescriptor(i,o):void 0})(r,t,e)}function rt(r){return g({...r,state:!0,attribute:!1})}var At={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},St=r=>(...t)=>({_$litDirective$:r,values:t}),q=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var Et="important",Yt=" !"+Et,V=St(class extends q{constructor(r){if(super(r),r.type!==At.ATTRIBUTE||r.name!=="style"||r.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(r){return Object.keys(r).reduce((t,e)=>{let s=r[e];return s==null?t:t+`${e=e.includes("-")?e:e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`},"")}update(r,[t]){let{style:e}=r.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(t)),this.render(t);for(let s of this.ft)t[s]==null&&(this.ft.delete(s),s.includes("-")?e.removeProperty(s):e[s]=null);for(let s in t){let i=t[s];if(i!=null){this.ft.add(s);let o=typeof i=="string"&&i.endsWith(Yt);s.includes("-")||o?e.setProperty(s,o?i.slice(0,-11):i,o?Et:""):e[s]=i}}return y}});var Jt=new Set(["IMG","SVG","VIDEO","CANVAS","IFRAME","INPUT","TEXTAREA","BUTTON","HR"]),Xt=new Set(["BR","WBR"]);function Zt(r){if(Jt.has(r.tagName))return!0;for(let t of r.children)if(!Xt.has(t.tagName))return!1;return!0}function Qt(r){for(let t of r.childNodes)if(t.nodeType===Node.TEXT_NODE&&t.textContent?.trim())return!0;return!1}function xt(r,t){let e=[];function s(i){let o=i.getBoundingClientRect(),n=Number(i.getAttribute("data-shimmer-width"))||0,l=Number(i.getAttribute("data-shimmer-height"))||0,a=n>0||l>0,u=n||o.width,d=l||o.height;if((u===0||d===0)&&!a||i.hasAttribute("data-shimmer-ignore"))return;if(i.hasAttribute("data-shimmer-no-children")||Zt(i)){let b=getComputedStyle(i).borderRadius;if((i.tagName==="TD"||i.tagName==="TH")&&Qt(i)&&!n){let v=document.createElement("span");v.style.visibility="hidden",v.style.position="absolute",v.textContent=i.textContent,i.appendChild(v);let Tt=v.getBoundingClientRect();i.removeChild(v),e.push({x:o.left-t.left,y:o.top-t.top,width:Math.min(Tt.width,o.width),height:d,borderRadius:b==="0px"?"":b});return}e.push({x:o.left-t.left,y:o.top-t.top,width:u,height:d,borderRadius:b==="0px"?"":b});return}for(let c of i.children)s(c)}return s(r),e}function Ct(r,t){let e=r.getBoundingClientRect();if(e.width===0||e.height===0)return null;let s=getComputedStyle(r),i=s.backgroundColor,o=s.borderWidth,n=s.borderStyle,l=s.borderColor,a=s.boxShadow,u=s.borderRadius,d=i==="rgba(0, 0, 0, 0)"||i==="transparent",h=n!=="none"&&o!=="0px",c=a!=="none"&&a!=="";if(d&&!h&&!c)return null;let b=h?`${o} ${n} ${l}`:"";return{x:e.left-t.left,y:e.top-t.top,width:e.width,height:e.height,borderRadius:u==="0px"?"":u,backgroundColor:d?"":i,border:b,boxShadow:c?a:""}}function wt(r,t){let e=null,s=new ResizeObserver(()=>{e!==null&&cancelAnimationFrame(e),e=requestAnimationFrame(()=>{e=null,t()})});return s.observe(r),s}var Ot="phantom-ui-loading-styles";function kt(){if(document.getElementById(Ot))return;let r=document.createElement("style");r.id=Ot,r.textContent=`
		phantom-ui[loading] * {
			-webkit-text-fill-color: transparent !important;
			pointer-events: none;
			user-select: none;
		}
		phantom-ui[loading] img,
		phantom-ui[loading] svg,
		phantom-ui[loading] video,
		phantom-ui[loading] canvas,
		phantom-ui[loading] button,
		phantom-ui[loading] [role="button"] {
			opacity: 0 !important;
		}
		phantom-ui[loading] [data-shimmer-ignore],
		phantom-ui[loading] [data-shimmer-ignore] * {
			-webkit-text-fill-color: initial !important;
			pointer-events: auto;
			user-select: auto;
		}
		phantom-ui[loading] [data-shimmer-ignore] img,
		phantom-ui[loading] [data-shimmer-ignore] svg,
		phantom-ui[loading] [data-shimmer-ignore] video,
		phantom-ui[loading] [data-shimmer-ignore] canvas,
		phantom-ui[loading] [data-shimmer-ignore] button,
		phantom-ui[loading] [data-shimmer-ignore] [role="button"] {
			opacity: 1 !important;
		}
	`,document.head.appendChild(r)}var Rt=F`
	:host {
		display: block;
		position: relative;
		overflow: hidden;
		--shimmer-color: rgba(128, 128, 128, 0.3);
		--shimmer-duration: 1.5s;
		--shimmer-bg: rgba(128, 128, 128, 0.2);
	}

	:host([loading]) ::slotted(*) {
		-webkit-text-fill-color: transparent !important;
		pointer-events: none;
		user-select: none;
	}

	:host([loading]) ::slotted(img),
	:host([loading]) ::slotted(svg),
	:host([loading]) ::slotted(video),
	:host([loading]) ::slotted(canvas),
	:host([loading]) ::slotted(button),
	:host([loading]) ::slotted([role="button"]) {
		opacity: 0 !important;
	}

	.shimmer-overlay {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
		transition: opacity var(--reveal-duration, 0s) ease-out;
	}

	.shimmer-overlay.revealing {
		opacity: 0;
	}

	.shimmer-block {
		position: absolute;
		overflow: hidden;
	}

	.shimmer-container-block {
		position: absolute;
		box-sizing: border-box;
	}

	/* Shimmer mode (default) — ltr */
	.shimmer-block::after {
		content: "";
		position: absolute;
		inset: 0;
		background: linear-gradient(
			90deg,
			var(--shimmer-bg) 30%,
			var(--shimmer-color) 50%,
			var(--shimmer-bg) 70%
		);
		background-size: 200% 100%;
		animation: shimmer-ltr var(--shimmer-duration, 1.5s) linear infinite;
	}

	@keyframes shimmer-ltr {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}

	/* Shimmer rtl */
	:host([shimmer-direction="rtl"]) .shimmer-block::after {
		animation-name: shimmer-rtl;
	}

	@keyframes shimmer-rtl {
		0% { background-position: -200% 0; }
		100% { background-position: 200% 0; }
	}

	/* Shimmer ttb */
	:host([shimmer-direction="ttb"]) .shimmer-block::after {
		background: linear-gradient(
			180deg,
			var(--shimmer-bg) 30%,
			var(--shimmer-color) 50%,
			var(--shimmer-bg) 70%
		);
		background-size: 100% 200%;
		animation-name: shimmer-ttb;
	}

	@keyframes shimmer-ttb {
		0% { background-position: 0 200%; }
		100% { background-position: 0 -200%; }
	}

	/* Shimmer btt */
	:host([shimmer-direction="btt"]) .shimmer-block::after {
		background: linear-gradient(
			180deg,
			var(--shimmer-bg) 30%,
			var(--shimmer-color) 50%,
			var(--shimmer-bg) 70%
		);
		background-size: 100% 200%;
		animation-name: shimmer-btt;
	}

	@keyframes shimmer-btt {
		0% { background-position: 0 -200%; }
		100% { background-position: 0 200%; }
	}

	/* Pulse mode */
	:host([animation="pulse"]) .shimmer-block {
		animation: phantom-pulse var(--shimmer-duration, 1.5s) ease-in-out infinite;
	}

	:host([animation="pulse"]) .shimmer-block::after {
		display: none;
	}

	@keyframes phantom-pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.4;
		}
	}

	/* Breathe mode - subtle scale + fade */
	:host([animation="breathe"]) .shimmer-block {
		animation: phantom-breathe var(--shimmer-duration, 1.5s) ease-in-out infinite;
	}

	:host([animation="breathe"]) .shimmer-block::after {
		display: none;
	}

	@keyframes phantom-breathe {
		0%,
		100% {
			opacity: 0.6;
			transform: scale(1);
		}
		50% {
			opacity: 1;
			transform: scale(1.02);
		}
	}

	/* Solid mode */
	:host([animation="solid"]) .shimmer-block::after {
		display: none;
	}

	/* Debug mode */
	:host([debug]) .shimmer-block {
		outline: 1px dashed rgba(247, 118, 142, 0.9);
		outline-offset: -1px;
	}

	:host([debug]) .shimmer-container-block {
		outline: 1px dashed rgba(122, 162, 247, 0.9);
		outline-offset: -1px;
	}

	.debug-label {
		position: absolute;
		top: 2px;
		left: 2px;
		font: 600 10px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
		color: #fff;
		background: rgba(247, 118, 142, 0.95);
		padding: 2px 5px;
		border-radius: 3px;
		pointer-events: none;
		z-index: 1;
	}

	.debug-label[data-kind="container"] {
		background: rgba(122, 162, 247, 0.95);
	}
`;var m=class extends A{constructor(){super(...arguments);this.loading=!1;this.shimmerDirection="ltr";this.shimmerColor="rgba(128, 128, 128, 0.3)";this.backgroundColor="rgba(128, 128, 128, 0.2)";this.duration=1.5;this.fallbackRadius=4;this.animation="shimmer";this.stagger=0;this.reveal=0;this.count=1;this.countGap=0;this.debug=!1;this.loadingLabel="Loading";this._blocks=[];this._revealing=!1;this._resizeObserver=null;this._mutationObserver=null;this._loadHandler=null;this._measureScheduled=!1;this._revealTimeout=null}static{this.styles=Rt}connectedCallback(){super.connectedCallback(),kt()}disconnectedCallback(){super.disconnectedCallback(),this._teardownObservers(),this._clearRevealTimeout()}willUpdate(e){e.has("loading")&&!this.loading&&this.reveal>0&&this._blocks.length>0&&(this._revealing=!0)}updated(e){(e.has("count")||e.has("countGap"))&&this.loading&&this._scheduleMeasure(),(e.has("loading")||e.has("loadingLabel"))&&(this.setAttribute("aria-busy",String(this.loading)),this.loading?this.setAttribute("aria-label",this.loadingLabel):this.removeAttribute("aria-label")),e.has("loading")&&(this.loading?(this._revealing=!1,this._clearRevealTimeout(),this._scheduleMeasure(),this._setupObservers()):this._revealing?(this._teardownObservers(),this._revealTimeout=setTimeout(()=>{this._revealing=!1,this._blocks=[],this._revealTimeout=null,this.style.minHeight=""},this.reveal*1e3)):(this._blocks=[],this._teardownObservers(),this.style.minHeight=""))}render(){let e=V({"--shimmer-color":this.shimmerColor,"--shimmer-duration":`${this.duration}s`,"--shimmer-bg":this.backgroundColor,"--reveal-duration":`${this.reveal}s`,"--shimmer-direction":this.shimmerDirection}),s=this.loading||this._revealing;return C`
      <slot></slot>
      ${s?C`
            <div
              class="shimmer-overlay ${this._revealing?"revealing":""}"
              style=${e}
              aria-hidden="true"
            >
              ${this._renderBlocks()}
            </div>
          `:""}
    `}_scheduleMeasure(){this._measureScheduled||(this._measureScheduled=!0,requestAnimationFrame(()=>{this._measureScheduled=!1,this._measure()}))}_measure(){if(!this.loading)return;let e=this.getBoundingClientRect();if(e.width===0||e.height===0)return;this._mutationObserver&&this._mutationObserver.disconnect();let s=this.shadowRoot?.querySelector("slot");if(!s)return;let i=s.assignedElements({flatten:!0}),o=[];for(let n of i){let l=xt(n,e);o.push(...l)}if(this.count>1&&o.length>0){let n=0;for(let d of i){let h=d.getBoundingClientRect();n=Math.max(n,h.bottom-e.top)}let l=[];for(let d of i){let h=Ct(d,e);h&&l.push(h)}let a=[...o];for(let d=1;d<this.count;d++){let h=d*(n+this.countGap);for(let c of l)o.push({x:c.x,y:c.y+h,width:c.width,height:c.height,borderRadius:c.borderRadius,isContainer:!0,containerBg:c.backgroundColor,containerBorder:c.border,containerShadow:c.boxShadow});for(let c of a)o.push({...c,y:c.y+h})}let u=this.count*n+(this.count-1)*this.countGap;this.style.minHeight=`${u}px`}else this.style.minHeight="";this._blocks=o,this._mutationObserver&&this._mutationObserver.observe(this,{childList:!0,subtree:!0,attributes:!0})}_setupObservers(){this._teardownObservers(),this._resizeObserver=wt(this,()=>{this._scheduleMeasure()}),this._mutationObserver=new MutationObserver(()=>{this._scheduleMeasure()}),this._mutationObserver.observe(this,{childList:!0,subtree:!0,attributes:!0}),this._loadHandler=()=>this._scheduleMeasure(),this.addEventListener("load",this._loadHandler,!0)}_teardownObservers(){this._resizeObserver&&(this._resizeObserver.disconnect(),this._resizeObserver=null),this._mutationObserver&&(this._mutationObserver.disconnect(),this._mutationObserver=null),this._loadHandler&&(this.removeEventListener("load",this._loadHandler,!0),this._loadHandler=null)}_clearRevealTimeout(){this._revealTimeout!==null&&(clearTimeout(this._revealTimeout),this._revealTimeout=null)}_renderBlocks(){return this._blocks.map((e,s)=>{let i=e.borderRadius||`${this.fallbackRadius}px`,o={left:`${e.x}px`,top:`${e.y}px`,width:`${e.width}px`,height:`${e.height}px`,"border-radius":i};if(e.isContainer){let l={...o};return e.containerBg&&(l.background=e.containerBg),e.containerBorder&&(l.border=e.containerBorder),e.containerShadow&&(l["box-shadow"]=e.containerShadow),C`<div
          class="shimmer-container-block"
          style=${V(l)}
        >${this.debug?C`<span class="debug-label" data-kind="container">C${s}</span>`:p}</div>`}let n={...o,background:`var(--shimmer-bg, ${this.backgroundColor})`};return this.stagger>0&&(n["animation-delay"]=`${s*this.stagger}s`),C`<div class="shimmer-block" style=${V(n)}>${this.debug?C`<span class="debug-label">${s}</span>`:p}</div>`})}};f([g({type:Boolean,reflect:!0,converter:{fromAttribute:e=>e!==null&&e!=="false",toAttribute:e=>e?"":null}})],m.prototype,"loading",2),f([g({attribute:"shimmer-direction",reflect:!0})],m.prototype,"shimmerDirection",2),f([g({attribute:"shimmer-color"})],m.prototype,"shimmerColor",2),f([g({attribute:"background-color"})],m.prototype,"backgroundColor",2),f([g({type:Number})],m.prototype,"duration",2),f([g({type:Number,attribute:"fallback-radius"})],m.prototype,"fallbackRadius",2),f([g({reflect:!0})],m.prototype,"animation",2),f([g({type:Number})],m.prototype,"stagger",2),f([g({type:Number})],m.prototype,"reveal",2),f([g({type:Number,converter:e=>Math.max(1,Math.round(Number(e)||1))})],m.prototype,"count",2),f([g({type:Number,attribute:"count-gap",converter:e=>Math.max(0,Number(e)||0)})],m.prototype,"countGap",2),f([g({type:Boolean,reflect:!0})],m.prototype,"debug",2),f([g({attribute:"loading-label"})],m.prototype,"loadingLabel",2),f([rt()],m.prototype,"_blocks",2),f([rt()],m.prototype,"_revealing",2);customElements.get("phantom-ui")||customElements.define("phantom-ui",m);})();
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
@lit/reactive-element/decorators/custom-element.js:
@lit/reactive-element/decorators/property.js:
@lit/reactive-element/decorators/state.js:
@lit/reactive-element/decorators/event-options.js:
@lit/reactive-element/decorators/base.js:
@lit/reactive-element/decorators/query.js:
@lit/reactive-element/decorators/query-all.js:
@lit/reactive-element/decorators/query-async.js:
@lit/reactive-element/decorators/query-assigned-nodes.js:
lit-html/directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/style-map.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
