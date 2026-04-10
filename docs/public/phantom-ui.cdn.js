"use strict";(()=>{var kt=Object.defineProperty;var Mt=Object.getOwnPropertyDescriptor;var g=(i,t,e,s)=>{for(var r=s>1?void 0:s?Mt(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&kt(t,e,r),r};var B=globalThis,I=B.ShadowRoot&&(B.ShadyCSS===void 0||B.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,V=Symbol(),it=new WeakMap,T=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==V)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(I&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=it.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&it.set(e,t))}return t}toString(){return this.cssText}},ot=i=>new T(typeof i=="string"?i:i+"",void 0,V),W=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((s,r,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1],i[0]);return new T(e,i,V)},nt=(i,t)=>{if(I)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),r=B.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},G=I?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return ot(e)})(i):i;var{is:Nt,defineProperty:Pt,getOwnPropertyDescriptor:Ht,getOwnPropertyNames:Ut,getOwnPropertySymbols:Bt,getPrototypeOf:It}=Object,L=globalThis,at=L.trustedTypes,Lt=at?at.emptyScript:"",Dt=L.reactiveElementPolyfillSupport,O=(i,t)=>i,R={toAttribute(i,t){switch(t){case Boolean:i=i?Lt:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},D=(i,t)=>!Nt(i,t),lt={attribute:!0,type:String,converter:R,reflect:!1,useDefault:!1,hasChanged:D};Symbol.metadata??=Symbol("metadata"),L.litPropertyMetadata??=new WeakMap;var _=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=lt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Pt(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){let{get:r,set:o}=Ht(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:r,set(n){let l=r?.call(this);o?.call(this,n),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??lt}static _$Ei(){if(this.hasOwnProperty(O("elementProperties")))return;let t=It(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(O("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(O("properties"))){let e=this.properties,s=[...Ut(e),...Bt(e)];for(let r of s)this.createProperty(r,e[r])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let r of s)e.unshift(G(r))}else t!==void 0&&e.push(G(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return nt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:R).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){let s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){let o=s.getPropertyOptions(r),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:R;this._$Em=r;let l=n.fromAttribute(e,o.type);this[r]=l??this._$Ej?.get(r)??l,this._$Em=null}}requestUpdate(t,e,s,r=!1,o){if(t!==void 0){let n=this.constructor;if(r===!1&&(o=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??D)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:o},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[r,o]of s){let{wrapped:n}=o,l=this[r];n!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,o,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[O("elementProperties")]=new Map,_[O("finalized")]=new Map,Dt?.({ReactiveElement:_}),(L.reactiveElementVersions??=[]).push("2.1.2");var Q=globalThis,ht=i=>i,z=Q.trustedTypes,dt=z?z.createPolicy("lit-html",{createHTML:i=>i}):void 0,gt="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,bt="?"+$,zt=`<${bt}>`,E=document,M=()=>E.createComment(""),N=i=>i===null||typeof i!="object"&&typeof i!="function",tt=Array.isArray,jt=i=>tt(i)||typeof i?.[Symbol.iterator]=="function",K=`[ 	
\f\r]`,k=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ct=/-->/g,ut=/>/g,A=RegExp(`>|${K}(?:([^\\s"'>=/]+)(${K}*=${K}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),pt=/'/g,mt=/"/g,_t=/^(?:script|style|textarea|title)$/i,et=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),U=et(1),oe=et(2),ne=et(3),v=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),ft=new WeakMap,S=E.createTreeWalker(E,129);function vt(i,t){if(!tt(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return dt!==void 0?dt.createHTML(t):t}var qt=(i,t)=>{let e=i.length-1,s=[],r,o=t===2?"<svg>":t===3?"<math>":"",n=k;for(let l=0;l<e;l++){let a=i[l],u,c,h=-1,d=0;for(;d<a.length&&(n.lastIndex=d,c=n.exec(a),c!==null);)d=n.lastIndex,n===k?c[1]==="!--"?n=ct:c[1]!==void 0?n=ut:c[2]!==void 0?(_t.test(c[2])&&(r=RegExp("</"+c[2],"g")),n=A):c[3]!==void 0&&(n=A):n===A?c[0]===">"?(n=r??k,h=-1):c[1]===void 0?h=-2:(h=n.lastIndex-c[2].length,u=c[1],n=c[3]===void 0?A:c[3]==='"'?mt:pt):n===mt||n===pt?n=A:n===ct||n===ut?n=k:(n=A,r=void 0);let m=n===A&&i[l+1].startsWith("/>")?" ":"";o+=n===k?a+zt:h>=0?(s.push(u),a.slice(0,h)+gt+a.slice(h)+$+m):a+$+(h===-2?l:m)}return[vt(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},P=class i{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let o=0,n=0,l=t.length-1,a=this.parts,[u,c]=qt(t,e);if(this.el=i.createElement(u,s),S.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(r=S.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(let h of r.getAttributeNames())if(h.endsWith(gt)){let d=c[n++],m=r.getAttribute(h).split($),x=/([.?@])?(.*)/.exec(d);a.push({type:1,index:o,name:x[2],strings:m,ctor:x[1]==="."?J:x[1]==="?"?X:x[1]==="@"?Y:C}),r.removeAttribute(h)}else h.startsWith($)&&(a.push({type:6,index:o}),r.removeAttribute(h));if(_t.test(r.tagName)){let h=r.textContent.split($),d=h.length-1;if(d>0){r.textContent=z?z.emptyScript:"";for(let m=0;m<d;m++)r.append(h[m],M()),S.nextNode(),a.push({type:2,index:++o});r.append(h[d],M())}}}else if(r.nodeType===8)if(r.data===bt)a.push({type:2,index:o});else{let h=-1;for(;(h=r.data.indexOf($,h+1))!==-1;)a.push({type:7,index:o}),h+=$.length-1}o++}}static createElement(t,e){let s=E.createElement("template");return s.innerHTML=t,s}};function w(i,t,e=i,s){if(t===v)return t;let r=s!==void 0?e._$Co?.[s]:e._$Cl,o=N(t)?void 0:t._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),o===void 0?r=void 0:(r=new o(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??=[])[s]=r:e._$Cl=r),r!==void 0&&(t=w(i,r._$AS(i,t.values),r,s)),t}var F=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,r=(t?.creationScope??E).importNode(e,!0);S.currentNode=r;let o=S.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let u;a.type===2?u=new H(o,o.nextSibling,this,t):a.type===1?u=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(u=new Z(o,this,t)),this._$AV.push(u),a=s[++l]}n!==a?.index&&(o=S.nextNode(),n++)}return S.currentNode=E,r}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},H=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=w(this,t,e),N(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==v&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):jt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&N(this._$AH)?this._$AA.nextSibling.data=t:this.T(E.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=P.createElement(vt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(e);else{let o=new F(r,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=ft.get(t.strings);return e===void 0&&ft.set(t.strings,e=new P(t)),e}k(t){tt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,r=0;for(let o of t)r===e.length?e.push(s=new i(this.O(M()),this.O(M()),this,this.options)):s=e[r],s._$AI(o),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=ht(t).nextSibling;ht(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},C=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,o){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(t,e=this,s,r){let o=this.strings,n=!1;if(o===void 0)t=w(this,t,e,0),n=!N(t)||t!==this._$AH&&t!==v,n&&(this._$AH=t);else{let l=t,a,u;for(t=o[0],a=0;a<o.length-1;a++)u=w(this,l[s+a],e,a),u===v&&(u=this._$AH[a]),n||=!N(u)||u!==this._$AH[a],u===p?t=p:t!==p&&(t+=(u??"")+o[a+1]),this._$AH[a]=u}n&&!r&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},J=class extends C{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}},X=class extends C{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}},Y=class extends C{constructor(t,e,s,r,o){super(t,e,s,r,o),this.type=5}_$AI(t,e=this){if((t=w(this,t,e,0)??p)===v)return;let s=this._$AH,r=t===p&&s!==p||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==p&&(s===p||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Z=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){w(this,t)}};var Vt=Q.litHtmlPolyfillSupport;Vt?.(P,H),(Q.litHtmlVersions??=[]).push("3.3.2");var $t=(i,t,e)=>{let s=e?.renderBefore??t,r=s._$litPart$;if(r===void 0){let o=e?.renderBefore??null;s._$litPart$=r=new H(t.insertBefore(M(),o),o,void 0,e??{})}return r._$AI(i),r};var st=globalThis,y=class extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=$t(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return v}};y._$litElement$=!0,y.finalized=!0,st.litElementHydrateSupport?.({LitElement:y});var Wt=st.litElementPolyfillSupport;Wt?.({LitElement:y});(st.litElementVersions??=[]).push("4.2.2");var yt=i=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(i,t)}):customElements.define(i,t)};var Gt={attribute:!0,type:String,converter:R,reflect:!1,hasChanged:D},Kt=(i=Gt,t,e)=>{let{kind:s,metadata:r}=e,o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(e.name,i),s==="accessor"){let{name:n}=e;return{set(l){let a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,i,!0,l)},init(l){return l!==void 0&&this.C(n,void 0,i,l),l}}}if(s==="setter"){let{name:n}=e;return function(l){let a=this[n];t.call(this,l),this.requestUpdate(n,a,i,!0,l)}}throw Error("Unsupported decorator location: "+s)};function b(i){return(t,e)=>typeof e=="object"?Kt(i,t,e):((s,r,o)=>{let n=r.hasOwnProperty(o);return r.constructor.createProperty(o,s),n?Object.getOwnPropertyDescriptor(r,o):void 0})(i,t,e)}function rt(i){return b({...i,state:!0,attribute:!1})}var At={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},St=i=>(...t)=>({_$litDirective$:i,values:t}),q=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var Et="important",Ft=" !"+Et,xt=St(class extends q{constructor(i){if(super(i),i.type!==At.ATTRIBUTE||i.name!=="style"||i.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(i){return Object.keys(i).reduce((t,e)=>{let s=i[e];return s==null?t:t+`${e=e.includes("-")?e:e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`},"")}update(i,[t]){let{style:e}=i.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(t)),this.render(t);for(let s of this.ft)t[s]==null&&(this.ft.delete(s),s.includes("-")?e.removeProperty(s):e[s]=null);for(let s in t){let r=t[s];if(r!=null){this.ft.add(s);let o=typeof r=="string"&&r.endsWith(Ft);s.includes("-")||o?e.setProperty(s,o?r.slice(0,-11):r,o?Et:""):e[s]=r}}return v}});var Jt=new Set(["IMG","SVG","VIDEO","CANVAS","IFRAME","INPUT","TEXTAREA","BUTTON","HR"]),Xt=new Set(["BR","WBR","HR"]);function Yt(i){if(Jt.has(i.tagName))return!0;for(let t of i.children)if(!Xt.has(t.tagName))return!1;return!0}function Zt(i){for(let t of i.childNodes)if(t.nodeType===Node.TEXT_NODE&&t.textContent?.trim())return!0;return!1}function wt(i,t){let e=[];function s(r){let o=r.getBoundingClientRect(),n=Number(r.getAttribute("data-shimmer-width"))||0,l=Number(r.getAttribute("data-shimmer-height"))||0,a=n||o.width,u=l||o.height;if(a===0||u===0||r.hasAttribute("data-shimmer-ignore"))return;if(r.hasAttribute("data-shimmer-no-children")||Yt(r)){let d=getComputedStyle(r).borderRadius;if((r.tagName==="TD"||r.tagName==="TH")&&Zt(r)&&!n){let m=document.createElement("span");m.style.visibility="hidden",m.style.position="absolute",m.textContent=r.textContent,r.appendChild(m);let x=m.getBoundingClientRect();r.removeChild(m),e.push({x:o.left-t.left,y:o.top-t.top,width:Math.min(x.width,o.width),height:u,tag:r.tagName.toLowerCase(),borderRadius:d==="0px"?"":d});return}e.push({x:o.left-t.left,y:o.top-t.top,width:a,height:u,tag:r.tagName.toLowerCase(),borderRadius:d==="0px"?"":d});return}for(let h of r.children)s(h)}return s(i),e}function Ct(i,t){let e=i.getBoundingClientRect();if(e.width===0||e.height===0)return null;let s=getComputedStyle(i),r=s.backgroundColor,o=s.borderWidth,n=s.borderStyle,l=s.borderColor,a=s.boxShadow,u=s.borderRadius,c=r==="rgba(0, 0, 0, 0)"||r==="transparent",h=n!=="none"&&o!=="0px",d=a!=="none"&&a!=="";if(c&&!h&&!d)return null;let m=h?`${o} ${n} ${l}`:"";return{x:e.left-t.left,y:e.top-t.top,width:e.width,height:e.height,borderRadius:u==="0px"?"":u,backgroundColor:c?"":r,border:m,boxShadow:d?a:""}}function Tt(i,t){let e=null,s=new ResizeObserver(()=>{e!==null&&cancelAnimationFrame(e),e=requestAnimationFrame(()=>{e=null,t()})});return s.observe(i),s}var Ot=W`
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

	/* Shimmer mode (default) */
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
		animation: shimmer-sweep var(--shimmer-duration, 1.5s) linear infinite;
	}

	@keyframes shimmer-sweep {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
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
`;var Rt="phantom-ui-loading-styles";function Qt(){if(document.getElementById(Rt))return;let i=document.createElement("style");i.id=Rt,i.textContent=`
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
	`,document.head.appendChild(i)}var f=class extends y{constructor(){super(...arguments);this.loading=!1;this.shimmerColor="rgba(128, 128, 128, 0.3)";this.backgroundColor="rgba(128, 128, 128, 0.2)";this.duration=1.5;this.fallbackRadius=4;this.animation="shimmer";this.stagger=0;this.reveal=0;this.count=1;this.countGap=0;this._blocks=[];this._revealing=!1;this._resizeObserver=null;this._mutationObserver=null;this._loadHandler=null;this._measureScheduled=!1;this._revealTimeout=null}connectedCallback(){super.connectedCallback(),Qt()}disconnectedCallback(){super.disconnectedCallback(),this._teardownObservers(),this._clearRevealTimeout()}willUpdate(e){e.has("loading")&&!this.loading&&this.reveal>0&&this._blocks.length>0&&(this._revealing=!0)}updated(e){(e.has("count")||e.has("countGap"))&&this.loading&&this._scheduleMeasure(),e.has("loading")&&(this.setAttribute("aria-busy",String(this.loading)),this.loading?(this._revealing=!1,this._clearRevealTimeout(),this._scheduleMeasure(),this._setupObservers()):this._revealing?(this._teardownObservers(),this._revealTimeout=setTimeout(()=>{this._revealing=!1,this._blocks=[],this._revealTimeout=null,this.style.minHeight=""},this.reveal*1e3)):(this._blocks=[],this._teardownObservers(),this.style.minHeight=""))}render(){let e=xt({"--shimmer-color":this.shimmerColor,"--shimmer-duration":`${this.duration}s`,"--shimmer-bg":this.backgroundColor,"--reveal-duration":`${this.reveal}s`}),s=this.loading||this._revealing;return U`
      <slot></slot>
      ${s?U`
            <div
              class="shimmer-overlay ${this._revealing?"revealing":""}"
              style=${e}
              aria-hidden="true"
            >
              ${this._renderBlocks()}
            </div>
          `:""}
    `}_scheduleMeasure(){this._measureScheduled||(this._measureScheduled=!0,requestAnimationFrame(()=>{this._measureScheduled=!1,this._measure()}))}_measure(){if(!this.loading)return;let e=this.getBoundingClientRect();if(e.width===0||e.height===0)return;let s=this.shadowRoot?.querySelector("slot");if(!s)return;let r=s.assignedElements({flatten:!0}),o=[];for(let n of r){let l=wt(n,e);o.push(...l)}if(this.count>1&&o.length>0){let n=0;for(let c of r){let h=c.getBoundingClientRect();n=Math.max(n,h.bottom-e.top)}let l=[];for(let c of r){let h=Ct(c,e);h&&l.push(h)}let a=[...o];for(let c=1;c<this.count;c++){let h=c*(n+this.countGap);for(let d of l)o.push({x:d.x,y:d.y+h,width:d.width,height:d.height,tag:"container",borderRadius:d.borderRadius,isContainer:!0,containerBg:d.backgroundColor,containerBorder:d.border,containerShadow:d.boxShadow});for(let d of a)o.push({...d,y:d.y+h})}let u=this.count*n+(this.count-1)*this.countGap;this.style.minHeight=`${u}px`}else this.style.minHeight="";this._blocks=o}_setupObservers(){this._teardownObservers(),this._resizeObserver=Tt(this,()=>{this._scheduleMeasure()}),this._mutationObserver=new MutationObserver(()=>{this._scheduleMeasure()}),this._mutationObserver.observe(this,{childList:!0,subtree:!0,attributes:!0}),this._loadHandler=()=>this._scheduleMeasure(),this.addEventListener("load",this._loadHandler,!0)}_teardownObservers(){this._resizeObserver&&(this._resizeObserver.disconnect(),this._resizeObserver=null),this._mutationObserver&&(this._mutationObserver.disconnect(),this._mutationObserver=null),this._loadHandler&&(this.removeEventListener("load",this._loadHandler,!0),this._loadHandler=null)}_clearRevealTimeout(){this._revealTimeout!==null&&(clearTimeout(this._revealTimeout),this._revealTimeout=null)}_renderBlocks(){return this._blocks.map((e,s)=>{let r=e.borderRadius||`${this.fallbackRadius}px`;if(e.isContainer)return U`
        <div
          class="shimmer-container-block"
          style="
						left: ${e.x}px;
						top: ${e.y}px;
						width: ${e.width}px;
						height: ${e.height}px;
						border-radius: ${r};
						${e.containerBg?`background: ${e.containerBg};`:""}
						${e.containerBorder?`border: ${e.containerBorder};`:""}
						${e.containerShadow?`box-shadow: ${e.containerShadow};`:""}
					"
        ></div>
      `;let o=this.stagger,n=o>0?`animation-delay: ${s*o}s;`:"";return U`
        <div
          class="shimmer-block"
          style="
						left: ${e.x}px;
						top: ${e.y}px;
						width: ${e.width}px;
						height: ${e.height}px;
						border-radius: ${r};
						background: var(--shimmer-bg, ${this.backgroundColor});
						${n}
					"
        ></div>
      `})}};f.styles=Ot,g([b({type:Boolean,reflect:!0,converter:{fromAttribute:e=>e!==null&&e!=="false",toAttribute:e=>e?"":null}})],f.prototype,"loading",2),g([b({attribute:"shimmer-color"})],f.prototype,"shimmerColor",2),g([b({attribute:"background-color"})],f.prototype,"backgroundColor",2),g([b({type:Number})],f.prototype,"duration",2),g([b({type:Number,attribute:"fallback-radius"})],f.prototype,"fallbackRadius",2),g([b({reflect:!0})],f.prototype,"animation",2),g([b({type:Number})],f.prototype,"stagger",2),g([b({type:Number})],f.prototype,"reveal",2),g([b({type:Number,converter:e=>Math.max(1,Math.round(Number(e)||1))})],f.prototype,"count",2),g([b({type:Number,attribute:"count-gap",converter:e=>Math.max(0,Number(e)||0)})],f.prototype,"countGap",2),g([rt()],f.prototype,"_blocks",2),g([rt()],f.prototype,"_revealing",2),f=g([yt("phantom-ui")],f);})();
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
