"use strict";(()=>{var Rt=Object.defineProperty;var Tt=Object.getOwnPropertyDescriptor;var g=(i,t,e,s)=>{for(var r=s>1?void 0:s?Tt(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&Rt(t,e,r),r};var H=globalThis,I=H.ShadowRoot&&(H.ShadyCSS===void 0||H.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,V=Symbol(),rt=new WeakMap,w=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==V)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(I&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=rt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&rt.set(e,t))}return t}toString(){return this.cssText}},it=i=>new w(typeof i=="string"?i:i+"",void 0,V),W=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((s,r,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1],i[0]);return new w(e,i,V)},ot=(i,t)=>{if(I)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),r=H.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},F=I?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return it(e)})(i):i;var{is:Pt,defineProperty:Mt,getOwnPropertyDescriptor:kt,getOwnPropertyNames:Nt,getOwnPropertySymbols:Ut,getPrototypeOf:Ht}=Object,L=globalThis,nt=L.trustedTypes,It=nt?nt.emptyScript:"",Lt=L.reactiveElementPolyfillSupport,O=(i,t)=>i,R={toAttribute(i,t){switch(t){case Boolean:i=i?It:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},D=(i,t)=>!Pt(i,t),at={attribute:!0,type:String,converter:R,reflect:!1,useDefault:!1,hasChanged:D};Symbol.metadata??=Symbol("metadata"),L.litPropertyMetadata??=new WeakMap;var f=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=at){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Mt(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){let{get:r,set:o}=kt(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:r,set(n){let h=r?.call(this);o?.call(this,n),this.requestUpdate(t,h,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??at}static _$Ei(){if(this.hasOwnProperty(O("elementProperties")))return;let t=Ht(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(O("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(O("properties"))){let e=this.properties,s=[...Nt(e),...Ut(e)];for(let r of s)this.createProperty(r,e[r])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let r of s)e.unshift(F(r))}else t!==void 0&&e.push(F(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ot(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:R).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){let s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){let o=s.getPropertyOptions(r),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:R;this._$Em=r;let h=n.fromAttribute(e,o.type);this[r]=h??this._$Ej?.get(r)??h,this._$Em=null}}requestUpdate(t,e,s,r=!1,o){if(t!==void 0){let n=this.constructor;if(r===!1&&(o=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??D)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:o},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[r,o]of s){let{wrapped:n}=o,h=this[r];n!==!0||this._$AL.has(r)||h===void 0||this.C(r,void 0,o,h)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};f.elementStyles=[],f.shadowRootOptions={mode:"open"},f[O("elementProperties")]=new Map,f[O("finalized")]=new Map,Lt?.({ReactiveElement:f}),(L.reactiveElementVersions??=[]).push("2.1.2");var Q=globalThis,ht=i=>i,B=Q.trustedTypes,lt=B?B.createPolicy("lit-html",{createHTML:i=>i}):void 0,ft="$lit$",y=`lit$${Math.random().toFixed(9).slice(2)}$`,$t="?"+y,Dt=`<${$t}>`,S=document,P=()=>S.createComment(""),M=i=>i===null||typeof i!="object"&&typeof i!="function",tt=Array.isArray,Bt=i=>tt(i)||typeof i?.[Symbol.iterator]=="function",K=`[ 	
\f\r]`,T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ct=/-->/g,dt=/>/g,A=RegExp(`>|${K}(?:([^\\s"'>=/]+)(${K}*=${K}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ut=/'/g,pt=/"/g,_t=/^(?:script|style|textarea|title)$/i,et=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),z=et(1),se=et(2),re=et(3),$=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),mt=new WeakMap,E=S.createTreeWalker(S,129);function gt(i,t){if(!tt(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return lt!==void 0?lt.createHTML(t):t}var zt=(i,t)=>{let e=i.length-1,s=[],r,o=t===2?"<svg>":t===3?"<math>":"",n=T;for(let h=0;h<e;h++){let a=i[h],l,d,c=-1,m=0;for(;m<a.length&&(n.lastIndex=m,d=n.exec(a),d!==null);)m=n.lastIndex,n===T?d[1]==="!--"?n=ct:d[1]!==void 0?n=dt:d[2]!==void 0?(_t.test(d[2])&&(r=RegExp("</"+d[2],"g")),n=A):d[3]!==void 0&&(n=A):n===A?d[0]===">"?(n=r??T,c=-1):d[1]===void 0?c=-2:(c=n.lastIndex-d[2].length,l=d[1],n=d[3]===void 0?A:d[3]==='"'?pt:ut):n===pt||n===ut?n=A:n===ct||n===dt?n=T:(n=A,r=void 0);let _=n===A&&i[h+1].startsWith("/>")?" ":"";o+=n===T?a+Dt:c>=0?(s.push(l),a.slice(0,c)+ft+a.slice(c)+y+_):a+y+(c===-2?h:_)}return[gt(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},k=class i{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let o=0,n=0,h=t.length-1,a=this.parts,[l,d]=zt(t,e);if(this.el=i.createElement(l,s),E.currentNode=this.el.content,e===2||e===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(r=E.nextNode())!==null&&a.length<h;){if(r.nodeType===1){if(r.hasAttributes())for(let c of r.getAttributeNames())if(c.endsWith(ft)){let m=d[n++],_=r.getAttribute(c).split(y),U=/([.?@])?(.*)/.exec(m);a.push({type:1,index:o,name:U[2],strings:_,ctor:U[1]==="."?J:U[1]==="?"?X:U[1]==="@"?Y:C}),r.removeAttribute(c)}else c.startsWith(y)&&(a.push({type:6,index:o}),r.removeAttribute(c));if(_t.test(r.tagName)){let c=r.textContent.split(y),m=c.length-1;if(m>0){r.textContent=B?B.emptyScript:"";for(let _=0;_<m;_++)r.append(c[_],P()),E.nextNode(),a.push({type:2,index:++o});r.append(c[m],P())}}}else if(r.nodeType===8)if(r.data===$t)a.push({type:2,index:o});else{let c=-1;for(;(c=r.data.indexOf(y,c+1))!==-1;)a.push({type:7,index:o}),c+=y.length-1}o++}}static createElement(t,e){let s=S.createElement("template");return s.innerHTML=t,s}};function x(i,t,e=i,s){if(t===$)return t;let r=s!==void 0?e._$Co?.[s]:e._$Cl,o=M(t)?void 0:t._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),o===void 0?r=void 0:(r=new o(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??=[])[s]=r:e._$Cl=r),r!==void 0&&(t=x(i,r._$AS(i,t.values),r,s)),t}var G=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,r=(t?.creationScope??S).importNode(e,!0);E.currentNode=r;let o=E.nextNode(),n=0,h=0,a=s[0];for(;a!==void 0;){if(n===a.index){let l;a.type===2?l=new N(o,o.nextSibling,this,t):a.type===1?l=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(l=new Z(o,this,t)),this._$AV.push(l),a=s[++h]}n!==a?.index&&(o=E.nextNode(),n++)}return E.currentNode=S,r}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},N=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=x(this,t,e),M(t)?t===u||t==null||t===""?(this._$AH!==u&&this._$AR(),this._$AH=u):t!==this._$AH&&t!==$&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Bt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==u&&M(this._$AH)?this._$AA.nextSibling.data=t:this.T(S.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=k.createElement(gt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(e);else{let o=new G(r,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=mt.get(t.strings);return e===void 0&&mt.set(t.strings,e=new k(t)),e}k(t){tt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,r=0;for(let o of t)r===e.length?e.push(s=new i(this.O(P()),this.O(P()),this,this.options)):s=e[r],s._$AI(o),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=ht(t).nextSibling;ht(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},C=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,o){this.type=1,this._$AH=u,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=u}_$AI(t,e=this,s,r){let o=this.strings,n=!1;if(o===void 0)t=x(this,t,e,0),n=!M(t)||t!==this._$AH&&t!==$,n&&(this._$AH=t);else{let h=t,a,l;for(t=o[0],a=0;a<o.length-1;a++)l=x(this,h[s+a],e,a),l===$&&(l=this._$AH[a]),n||=!M(l)||l!==this._$AH[a],l===u?t=u:t!==u&&(t+=(l??"")+o[a+1]),this._$AH[a]=l}n&&!r&&this.j(t)}j(t){t===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},J=class extends C{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===u?void 0:t}},X=class extends C{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==u)}},Y=class extends C{constructor(t,e,s,r,o){super(t,e,s,r,o),this.type=5}_$AI(t,e=this){if((t=x(this,t,e,0)??u)===$)return;let s=this._$AH,r=t===u&&s!==u||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==u&&(s===u||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Z=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){x(this,t)}};var jt=Q.litHtmlPolyfillSupport;jt?.(k,N),(Q.litHtmlVersions??=[]).push("3.3.2");var yt=(i,t,e)=>{let s=e?.renderBefore??t,r=s._$litPart$;if(r===void 0){let o=e?.renderBefore??null;s._$litPart$=r=new N(t.insertBefore(P(),o),o,void 0,e??{})}return r._$AI(i),r};var st=globalThis,b=class extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=yt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return $}};b._$litElement$=!0,b.finalized=!0,st.litElementHydrateSupport?.({LitElement:b});var qt=st.litElementPolyfillSupport;qt?.({LitElement:b});(st.litElementVersions??=[]).push("4.2.2");var bt=i=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(i,t)}):customElements.define(i,t)};var Vt={attribute:!0,type:String,converter:R,reflect:!1,hasChanged:D},Wt=(i=Vt,t,e)=>{let{kind:s,metadata:r}=e,o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(e.name,i),s==="accessor"){let{name:n}=e;return{set(h){let a=t.get.call(this);t.set.call(this,h),this.requestUpdate(n,a,i,!0,h)},init(h){return h!==void 0&&this.C(n,void 0,i,h),h}}}if(s==="setter"){let{name:n}=e;return function(h){let a=this[n];t.call(this,h),this.requestUpdate(n,a,i,!0,h)}}throw Error("Unsupported decorator location: "+s)};function v(i){return(t,e)=>typeof e=="object"?Wt(i,t,e):((s,r,o)=>{let n=r.hasOwnProperty(o);return r.constructor.createProperty(o,s),n?Object.getOwnPropertyDescriptor(r,o):void 0})(i,t,e)}function vt(i){return v({...i,state:!0,attribute:!1})}var At={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Et=i=>(...t)=>({_$litDirective$:i,values:t}),q=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var St="important",Ft=" !"+St,xt=Et(class extends q{constructor(i){if(super(i),i.type!==At.ATTRIBUTE||i.name!=="style"||i.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(i){return Object.keys(i).reduce((t,e)=>{let s=i[e];return s==null?t:t+`${e=e.includes("-")?e:e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`},"")}update(i,[t]){let{style:e}=i.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(t)),this.render(t);for(let s of this.ft)t[s]==null&&(this.ft.delete(s),s.includes("-")?e.removeProperty(s):e[s]=null);for(let s in t){let r=t[s];if(r!=null){this.ft.add(s);let o=typeof r=="string"&&r.endsWith(Ft);s.includes("-")||o?e.setProperty(s,o?r.slice(0,-11):r,o?St:""):e[s]=r}}return $}});var Kt=new Set(["IMG","SVG","VIDEO","CANVAS","IFRAME","INPUT","TEXTAREA","BUTTON","HR"]),Gt=new Set(["BR","WBR","HR"]);function Jt(i){if(Kt.has(i.tagName))return!0;for(let t of i.children)if(!Gt.has(t.tagName))return!1;return!0}function Xt(i){for(let t of i.childNodes)if(t.nodeType===Node.TEXT_NODE&&t.textContent?.trim())return!0;return!1}function Ct(i,t){let e=[];function s(r){let o=r.getBoundingClientRect();if(o.width===0||o.height===0||r.hasAttribute("data-shimmer-ignore"))return;if(r.hasAttribute("data-shimmer-no-children")||Jt(r)){let a=getComputedStyle(r).borderRadius;if((r.tagName==="TD"||r.tagName==="TH")&&Xt(r)){let l=document.createElement("span");l.style.visibility="hidden",l.style.position="absolute",l.textContent=r.textContent,r.appendChild(l);let d=l.getBoundingClientRect();r.removeChild(l),e.push({x:o.left-t.left,y:o.top-t.top,width:Math.min(d.width,o.width),height:o.height,tag:r.tagName.toLowerCase(),borderRadius:a==="0px"?"":a});return}e.push({x:o.left-t.left,y:o.top-t.top,width:o.width,height:o.height,tag:r.tagName.toLowerCase(),borderRadius:a==="0px"?"":a});return}for(let h of r.children)s(h)}for(let r of i.children)s(r);return e}function wt(i,t){let e=null,s=new ResizeObserver(()=>{e!==null&&cancelAnimationFrame(e),e=requestAnimationFrame(()=>{e=null,t()})});return s.observe(i),s}var Ot=W`
	:host {
		display: block;
		position: relative;
		--shimmer-color: rgba(255, 255, 255, 0.3);
		--shimmer-duration: 1.5s;
		--shimmer-bg: rgba(255, 255, 255, 0.08);
	}

	:host([loading]) ::slotted(*) {
		color: transparent !important;
		-webkit-text-fill-color: transparent !important;
		pointer-events: none;
		user-select: none;
	}

	:host([loading]) ::slotted(img),
	:host([loading]) ::slotted(svg),
	:host([loading]) ::slotted(video),
	:host([loading]) ::slotted(canvas) {
		opacity: 0 !important;
	}

	.shimmer-overlay {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.shimmer-block {
		position: absolute;
		overflow: hidden;
	}

	.shimmer-block::after {
		content: "";
		position: absolute;
		inset: 0;
		animation: shimmer-sweep var(--shimmer-duration, 1.5s) ease-in-out infinite;
	}

	@keyframes shimmer-sweep {
		0% {
			background: linear-gradient(
				90deg,
				transparent 0%,
				var(--shimmer-color) 50%,
				transparent 100%
			);
			background-size: 200% 100%;
			background-position: -100% 0;
		}
		100% {
			background: linear-gradient(
				90deg,
				transparent 0%,
				var(--shimmer-color) 50%,
				transparent 100%
			);
			background-size: 200% 100%;
			background-position: 200% 0;
		}
	}
`;var p=class extends b{constructor(){super(...arguments);this.loading=!1;this.shimmerColor="rgba(255, 255, 255, 0.3)";this.backgroundColor="rgba(255, 255, 255, 0.08)";this.duration=1.5;this.fallbackRadius=4;this._blocks=[];this._resizeObserver=null;this._mutationObserver=null;this._measureScheduled=!1}disconnectedCallback(){super.disconnectedCallback(),this._teardownObservers()}updated(e){e.has("loading")&&(this.loading?(this._scheduleMeasure(),this._setupObservers()):(this._blocks=[],this._teardownObservers()))}render(){let e=xt({"--shimmer-color":this.shimmerColor,"--shimmer-duration":`${this.duration}s`,"--shimmer-bg":this.backgroundColor});return z`
			<slot></slot>
			${this.loading?z`
						<div class="shimmer-overlay" style=${e} aria-hidden="true">
							${this._renderBlocks()}
						</div>
					`:""}
		`}_scheduleMeasure(){this._measureScheduled||(this._measureScheduled=!0,requestAnimationFrame(()=>{this._measureScheduled=!1,this._measure()}))}_measure(){if(!this.loading)return;let e=this.getBoundingClientRect();if(e.width===0||e.height===0)return;let s=this.shadowRoot?.querySelector("slot");if(!s)return;let r=s.assignedElements({flatten:!0}),o=[];for(let n of r){let h=Ct(n,e);o.push(...h)}this._blocks=o}_setupObservers(){this._teardownObservers(),this._resizeObserver=wt(this,()=>{this._scheduleMeasure()}),this._mutationObserver=new MutationObserver(()=>{this._scheduleMeasure()}),this._mutationObserver.observe(this,{childList:!0,subtree:!0,attributes:!0})}_teardownObservers(){this._resizeObserver&&(this._resizeObserver.disconnect(),this._resizeObserver=null),this._mutationObserver&&(this._mutationObserver.disconnect(),this._mutationObserver=null)}_renderBlocks(){return this._blocks.map(e=>{let s=e.borderRadius||`${this.fallbackRadius}px`;return z`
        <div
          class="shimmer-block"
          style="
						left: ${e.x}px;
						top: ${e.y}px;
						width: ${e.width}px;
						height: ${e.height}px;
						border-radius: ${s};
						background: var(--shimmer-bg, ${this.backgroundColor});
					"
        ></div>
      `})}};p.styles=Ot,g([v({type:Boolean,reflect:!0})],p.prototype,"loading",2),g([v({attribute:"shimmer-color"})],p.prototype,"shimmerColor",2),g([v({attribute:"background-color"})],p.prototype,"backgroundColor",2),g([v({type:Number})],p.prototype,"duration",2),g([v({type:Number,attribute:"fallback-radius"})],p.prototype,"fallbackRadius",2),g([vt()],p.prototype,"_blocks",2),p=g([bt("phantom-ui")],p);})();
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
