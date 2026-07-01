"use strict";(()=>{var Jt=Object.defineProperty;var Zt=Object.getOwnPropertyDescriptor;var f=(r,t,e,o)=>{for(var s=o>1?void 0:o?Zt(t,e):t,i=r.length-1,n;i>=0;i--)(n=r[i])&&(s=(o?n(t,e,s):n(s))||s);return o&&s&&Jt(t,e,s),s};var j=globalThis,z=j.ShadowRoot&&(j.ShadyCSS===void 0||j.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Y=Symbol(),pt=new WeakMap,M=class{constructor(t,e,o){if(this._$cssResult$=!0,o!==Y)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(z&&t===void 0){let o=e!==void 0&&e.length===1;o&&(t=pt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&pt.set(e,t))}return t}toString(){return this.cssText}},ft=r=>new M(typeof r=="string"?r:r+"",void 0,Y),J=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((o,s,i)=>o+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[i+1],r[0]);return new M(e,r,Y)},bt=(r,t)=>{if(z)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let o=document.createElement("style"),s=j.litNonce;s!==void 0&&o.setAttribute("nonce",s),o.textContent=e.cssText,r.appendChild(o)}},Z=z?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let o of t.cssRules)e+=o.cssText;return ft(e)})(r):r;var{is:Qt,defineProperty:te,getOwnPropertyDescriptor:ee,getOwnPropertyNames:oe,getOwnPropertySymbols:se,getPrototypeOf:re}=Object,q=globalThis,gt=q.trustedTypes,ie=gt?gt.emptyScript:"",ne=q.reactiveElementPolyfillSupport,H=(r,t)=>r,I={toAttribute(r,t){switch(t){case Boolean:r=r?ie:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},W=(r,t)=>!Qt(r,t),_t={attribute:!0,type:String,converter:I,reflect:!1,useDefault:!1,hasChanged:W};Symbol.metadata??=Symbol("metadata"),q.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=_t){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let o=Symbol(),s=this.getPropertyDescriptor(t,o,e);s!==void 0&&te(this.prototype,t,s)}}static getPropertyDescriptor(t,e,o){let{get:s,set:i}=ee(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:s,set(n){let l=s?.call(this);i?.call(this,n),this.requestUpdate(t,l,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??_t}static _$Ei(){if(this.hasOwnProperty(H("elementProperties")))return;let t=re(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(H("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(H("properties"))){let e=this.properties,o=[...oe(e),...se(e)];for(let s of o)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[o,s]of e)this.elementProperties.set(o,s)}this._$Eh=new Map;for(let[e,o]of this.elementProperties){let s=this._$Eu(e,o);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let o=new Set(t.flat(1/0).reverse());for(let s of o)e.unshift(Z(s))}else t!==void 0&&e.push(Z(t));return e}static _$Eu(t,e){let o=e.attribute;return o===!1?void 0:typeof o=="string"?o:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let o of e.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return bt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,o){this._$AK(t,o)}_$ET(t,e){let o=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,o);if(s!==void 0&&o.reflect===!0){let i=(o.converter?.toAttribute!==void 0?o.converter:I).toAttribute(e,o.type);this._$Em=t,i==null?this.removeAttribute(s):this.setAttribute(s,i),this._$Em=null}}_$AK(t,e){let o=this.constructor,s=o._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let i=o.getPropertyOptions(s),n=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:I;this._$Em=s;let l=n.fromAttribute(e,i.type);this[s]=l??this._$Ej?.get(s)??l,this._$Em=null}}requestUpdate(t,e,o,s=!1,i){if(t!==void 0){let n=this.constructor;if(s===!1&&(i=this[t]),o??=n.getPropertyOptions(t),!((o.hasChanged??W)(i,e)||o.useDefault&&o.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,o))))return;this.C(t,e,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:o,reflect:s,wrapped:i},n){o&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),i!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||o||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,i]of this._$Ep)this[s]=i;this._$Ep=void 0}let o=this.constructor.elementProperties;if(o.size>0)for(let[s,i]of o){let{wrapped:n}=i,l=this[s];n!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,i,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(o=>o.hostUpdate?.()),this.update(e)):this._$EM()}catch(o){throw t=!1,this._$EM(),o}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[H("elementProperties")]=new Map,y[H("finalized")]=new Map,ne?.({ReactiveElement:y}),(q.reactiveElementVersions??=[]).push("2.1.2");var it=globalThis,vt=r=>r,V=it.trustedTypes,yt=V?V.createPolicy("lit-html",{createHTML:r=>r}):void 0,Rt="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,xt="?"+A,ae=`<${xt}>`,x=document,D=()=>x.createComment(""),L=r=>r===null||typeof r!="object"&&typeof r!="function",nt=Array.isArray,le=r=>nt(r)||typeof r?.[Symbol.iterator]=="function",Q=`[ 	
\f\r]`,N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,$t=/-->/g,At=/>/g,w=RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Et=/'/g,St=/"/g,Ct=/^(?:script|style|textarea|title)$/i,at=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),E=at(1),Re=at(2),xe=at(3),$=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),wt=new WeakMap,R=x.createTreeWalker(x,129);function Tt(r,t){if(!nt(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return yt!==void 0?yt.createHTML(t):t}var he=(r,t)=>{let e=r.length-1,o=[],s,i=t===2?"<svg>":t===3?"<math>":"",n=N;for(let l=0;l<e;l++){let a=r[l],c,d,h=-1,u=0;for(;u<a.length&&(n.lastIndex=u,d=n.exec(a),d!==null);)u=n.lastIndex,n===N?d[1]==="!--"?n=$t:d[1]!==void 0?n=At:d[2]!==void 0?(Ct.test(d[2])&&(s=RegExp("</"+d[2],"g")),n=w):d[3]!==void 0&&(n=w):n===w?d[0]===">"?(n=s??N,h=-1):d[1]===void 0?h=-2:(h=n.lastIndex-d[2].length,c=d[1],n=d[3]===void 0?w:d[3]==='"'?St:Et):n===St||n===Et?n=w:n===$t||n===At?n=N:(n=w,s=void 0);let g=n===w&&r[l+1].startsWith("/>")?" ":"";i+=n===N?a+ae:h>=0?(o.push(c),a.slice(0,h)+Rt+a.slice(h)+A+g):a+A+(h===-2?l:g)}return[Tt(r,i+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),o]},P=class r{constructor({strings:t,_$litType$:e},o){let s;this.parts=[];let i=0,n=0,l=t.length-1,a=this.parts,[c,d]=he(t,e);if(this.el=r.createElement(c,o),R.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(s=R.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(let h of s.getAttributeNames())if(h.endsWith(Rt)){let u=d[n++],g=s.getAttribute(h).split(A),_=/([.?@])?(.*)/.exec(u);a.push({type:1,index:i,name:_[2],strings:g,ctor:_[1]==="."?et:_[1]==="?"?ot:_[1]==="@"?st:k}),s.removeAttribute(h)}else h.startsWith(A)&&(a.push({type:6,index:i}),s.removeAttribute(h));if(Ct.test(s.tagName)){let h=s.textContent.split(A),u=h.length-1;if(u>0){s.textContent=V?V.emptyScript:"";for(let g=0;g<u;g++)s.append(h[g],D()),R.nextNode(),a.push({type:2,index:++i});s.append(h[u],D())}}}else if(s.nodeType===8)if(s.data===xt)a.push({type:2,index:i});else{let h=-1;for(;(h=s.data.indexOf(A,h+1))!==-1;)a.push({type:7,index:i}),h+=A.length-1}i++}}static createElement(t,e){let o=x.createElement("template");return o.innerHTML=t,o}};function T(r,t,e=r,o){if(t===$)return t;let s=o!==void 0?e._$Co?.[o]:e._$Cl,i=L(t)?void 0:t._$litDirective$;return s?.constructor!==i&&(s?._$AO?.(!1),i===void 0?s=void 0:(s=new i(r),s._$AT(r,e,o)),o!==void 0?(e._$Co??=[])[o]=s:e._$Cl=s),s!==void 0&&(t=T(r,s._$AS(r,t.values),s,o)),t}var tt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:o}=this._$AD,s=(t?.creationScope??x).importNode(e,!0);R.currentNode=s;let i=R.nextNode(),n=0,l=0,a=o[0];for(;a!==void 0;){if(n===a.index){let c;a.type===2?c=new B(i,i.nextSibling,this,t):a.type===1?c=new a.ctor(i,a.name,a.strings,this,t):a.type===6&&(c=new rt(i,this,t)),this._$AV.push(c),a=o[++l]}n!==a?.index&&(i=R.nextNode(),n++)}return R.currentNode=x,s}p(t){let e=0;for(let o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(t,o,e),e+=o.strings.length-2):o._$AI(t[e])),e++}},B=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,o,s){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=o,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=T(this,t,e),L(t)?t===m||t==null||t===""?(this._$AH!==m&&this._$AR(),this._$AH=m):t!==this._$AH&&t!==$&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):le(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==m&&L(this._$AH)?this._$AA.nextSibling.data=t:this.T(x.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:o}=t,s=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=P.createElement(Tt(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===s)this._$AH.p(e);else{let i=new tt(s,this),n=i.u(this.options);i.p(e),this.T(n),this._$AH=i}}_$AC(t){let e=wt.get(t.strings);return e===void 0&&wt.set(t.strings,e=new P(t)),e}k(t){nt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,o,s=0;for(let i of t)s===e.length?e.push(o=new r(this.O(D()),this.O(D()),this,this.options)):o=e[s],o._$AI(i),s++;s<e.length&&(this._$AR(o&&o._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let o=vt(t).nextSibling;vt(t).remove(),t=o}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},k=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,o,s,i){this.type=1,this._$AH=m,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=i,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=m}_$AI(t,e=this,o,s){let i=this.strings,n=!1;if(i===void 0)t=T(this,t,e,0),n=!L(t)||t!==this._$AH&&t!==$,n&&(this._$AH=t);else{let l=t,a,c;for(t=i[0],a=0;a<i.length-1;a++)c=T(this,l[o+a],e,a),c===$&&(c=this._$AH[a]),n||=!L(c)||c!==this._$AH[a],c===m?t=m:t!==m&&(t+=(c??"")+i[a+1]),this._$AH[a]=c}n&&!s&&this.j(t)}j(t){t===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},et=class extends k{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===m?void 0:t}},ot=class extends k{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==m)}},st=class extends k{constructor(t,e,o,s,i){super(t,e,o,s,i),this.type=5}_$AI(t,e=this){if((t=T(this,t,e,0)??m)===$)return;let o=this._$AH,s=t===m&&o!==m||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,i=t!==m&&(o===m||s);s&&this.element.removeEventListener(this.name,this,o),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},rt=class{constructor(t,e,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){T(this,t)}};var de=it.litHtmlPolyfillSupport;de?.(P,B),(it.litHtmlVersions??=[]).push("3.3.2");var kt=(r,t,e)=>{let o=e?.renderBefore??t,s=o._$litPart$;if(s===void 0){let i=e?.renderBefore??null;o._$litPart$=s=new B(t.insertBefore(D(),i),i,void 0,e??{})}return s._$AI(r),s};var lt=globalThis,S=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=kt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return $}};S._$litElement$=!0,S.finalized=!0,lt.litElementHydrateSupport?.({LitElement:S});var ce=lt.litElementPolyfillSupport;ce?.({LitElement:S});(lt.litElementVersions??=[]).push("4.2.2");var ue={attribute:!0,type:String,converter:I,reflect:!1,hasChanged:W},me=(r=ue,t,e)=>{let{kind:o,metadata:s}=e,i=globalThis.litPropertyMetadata.get(s);if(i===void 0&&globalThis.litPropertyMetadata.set(s,i=new Map),o==="setter"&&((r=Object.create(r)).wrapped=!0),i.set(e.name,r),o==="accessor"){let{name:n}=e;return{set(l){let a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,r,!0,l)},init(l){return l!==void 0&&this.C(n,void 0,r,l),l}}}if(o==="setter"){let{name:n}=e;return function(l){let a=this[n];t.call(this,l),this.requestUpdate(n,a,r,!0,l)}}throw Error("Unsupported decorator location: "+o)};function b(r){return(t,e)=>typeof e=="object"?me(r,t,e):((o,s,i)=>{let n=s.hasOwnProperty(i);return s.constructor.createProperty(i,o),n?Object.getOwnPropertyDescriptor(s,i):void 0})(r,t,e)}function ht(r){return b({...r,state:!0,attribute:!1})}var Ot={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Mt=r=>(...t)=>({_$litDirective$:r,values:t}),K=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,o){this._$Ct=t,this._$AM=e,this._$Ci=o}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var Ht="important",pe=" !"+Ht,U=Mt(class extends K{constructor(r){if(super(r),r.type!==Ot.ATTRIBUTE||r.name!=="style"||r.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(r){return Object.keys(r).reduce((t,e)=>{let o=r[e];return o==null?t:t+`${e=e.includes("-")?e:e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${o};`},"")}update(r,[t]){let{style:e}=r.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(t)),this.render(t);for(let o of this.ft)t[o]==null&&(this.ft.delete(o),o.includes("-")?e.removeProperty(o):e[o]=null);for(let o in t){let s=t[o];if(s!=null){this.ft.add(o);let i=typeof s=="string"&&s.endsWith(pe);o.includes("-")||i?e.setProperty(o,i?s.slice(0,-11):s,i?Ht:""):e[o]=s}}return $}});function It(r,t){return r.map((e,o)=>{let s=e.borderRadius||`${t.fallbackRadius}px`,i={left:`${e.x}px`,top:`${e.y}px`,width:`${e.width}px`,height:`${e.height}px`,"border-radius":s};if(e.isContainer){let l={...i};return e.containerBg&&(l.background=e.containerBg),e.containerBorder&&(l.border=e.containerBorder),e.containerShadow&&(l["box-shadow"]=e.containerShadow),E`<div
        class="shimmer-container-block"
        style=${U(l)}
      >${t.debug?E`<span class="debug-label" data-kind="container">C${o}</span>`:m}</div>`}let n={...i,background:`var(--shimmer-bg, ${t.backgroundColor})`};return t.stagger>0&&(n["animation-delay"]=`${o*t.stagger}s`),E`<div class="shimmer-block" style=${U(n)}>${t.debug?E`<span class="debug-label">${o}</span>`:m}</div>`})}var G="phantom-ui",v="data-shimmer-ignore",Nt="data-shimmer-no-children",Dt="data-shimmer-width",Lt="data-shimmer-height",O="data-phantom-graphic",dt="rgba(128, 128, 128, 0.3)",ct="rgba(128, 128, 128, 0.2)";var ut='img, svg, video, canvas, button, [role="button"]',Bt=`
	-webkit-text-fill-color: transparent !important;
	pointer-events: none;
	user-select: none;
`,fe=`
	-webkit-text-fill-color: initial !important;
	pointer-events: auto;
	user-select: auto;
`,Pt="phantom-ui-loading-styles";function Ut(){if(document.getElementById(Pt))return;let r=`${G}[loading]:not([mode="overlay"])`,t=ut.split(", ").map(s=>`${r} ${s}`).join(`,
			`),e=ut.split(", ").map(s=>`${r} [${v}] ${s}`).join(`,
			`),o=document.createElement("style");o.id=Pt,o.textContent=`
		${r} * { ${Bt} }
		${t},
		${r} [${O}] { opacity: 0 !important; }
		${r} [${v}],
		${r} [${v}] * { ${fe} }
		${e} { opacity: 1 !important; }
	`,document.head.appendChild(o)}function Gt(r){for(let t of[null,"::before","::after"]){let e=getComputedStyle(r,t),o=e.getPropertyValue("mask-image")||e.getPropertyValue("-webkit-mask-image");if(o&&o!=="none")return!0}return!1}var mt="phantom-ui-shadow-hide",be=`
	:host([${v}]) *, [${v}] * {
		-webkit-text-fill-color: initial !important;
		opacity: 1 !important;
	}
	* { ${Bt} }
	${ut}, [${O}] { opacity: 0 !important; }
`;function jt(r){if(r.querySelector(`#${mt}`))return;let t=document.createElement("style");t.id=mt,t.textContent=be,r.appendChild(t)}function zt(r){r.querySelector(`#${mt}`)?.remove()}var X=class{constructor(t){this.host=t;this._hiddenRoots=new Set;this._markedGraphics=new Set;this._inertedElements=new Set;t.addController(this)}hostDisconnected(){this.restore()}apply(t){this.host.pierceShadow&&this._hideShadowContent(t),this._markGraphics(t),this._restoreInert(),this._applyInert(t)}restore(){this._restoreShadowContent(),this._restoreGraphics(),this._restoreInert()}_hideShadowContent(t){let e=o=>{if(o.shadowRoot){jt(o.shadowRoot),this._hiddenRoots.add(o.shadowRoot);for(let s of o.shadowRoot.children)e(s)}for(let s of o.children)e(s)};for(let o of t)e(o)}_restoreShadowContent(){for(let t of this._hiddenRoots)zt(t);this._hiddenRoots.clear()}_markGraphics(t){let e=o=>{if(Gt(o)&&(o.setAttribute(O,""),this._markedGraphics.add(o)),this.host.pierceShadow&&o.shadowRoot)for(let s of o.shadowRoot.children)e(s);for(let s of o.children)e(s)};for(let o of t)e(o)}_restoreGraphics(){for(let t of this._markedGraphics)t.removeAttribute(O);this._markedGraphics.clear()}_applyInert(t){let e=o=>{if(!o.hasAttribute(v)){if(!o.querySelector(`[${v}]`)){o.hasAttribute("inert")||(o.setAttribute("inert",""),this._inertedElements.add(o));return}for(let s of o.children)e(s)}};for(let o of t)e(o)}_restoreInert(){for(let t of this._inertedElements)t.removeAttribute("inert");this._inertedElements.clear()}};var ge=new Set(["IMG","SVG","VIDEO","CANVAS","IFRAME","INPUT","TEXTAREA","BUTTON","HR"]),qt=new Set(["BR","WBR"]);function _e(r){if(ge.has(r.tagName))return!0;for(let t of r.children)if(!qt.has(t.tagName))return!1;return!0}function ve(r){if(r.children.length===0)return!1;for(let t of r.children)if(t.tagName!=="SLOT"&&!qt.has(t.tagName))return!1;return!0}function ye(r){for(let t of r.childNodes)if(t.nodeType===Node.TEXT_NODE&&t.textContent?.trim())return!0;return!1}function Wt(r,t,e=!1){let o=[];function s(i){if(i.tagName==="SLOT"){let g=i.assignedElements({flatten:!0});for(let _ of g)s(_);return}let n=i.getBoundingClientRect(),l=Number(i.getAttribute(Dt))||0,a=Number(i.getAttribute(Lt))||0,c=l>0||a>0,d=l||n.width,h=a||n.height;if((d===0||h===0)&&!c||i.hasAttribute(v))return;if(e&&i.shadowRoot&&i.shadowRoot.children.length>0){for(let g of i.shadowRoot.children)s(g);return}if(i.hasAttribute(Nt)||_e(i)||e&&ve(i)){let _=getComputedStyle(i).borderRadius;if((i.tagName==="TD"||i.tagName==="TH")&&ye(i)&&!l){let C=document.createElement("span");C.style.visibility="hidden",C.style.position="absolute",C.textContent=i.textContent,i.appendChild(C);let Yt=C.getBoundingClientRect();i.removeChild(C),o.push({x:n.left-t.left,y:n.top-t.top,width:Math.min(Yt.width,n.width),height:h,borderRadius:_==="0px"?"":_});return}o.push({x:n.left-t.left,y:n.top-t.top,width:d,height:h,borderRadius:_==="0px"?"":_});return}for(let g of i.children)s(g)}return s(r),o}function Vt(r,t){let e=r.getBoundingClientRect();if(e.width===0||e.height===0)return null;let o=getComputedStyle(r),s=o.backgroundColor,i=o.borderWidth,n=o.borderStyle,l=o.borderColor,a=o.boxShadow,c=o.borderRadius,d=s==="rgba(0, 0, 0, 0)"||s==="transparent",h=n!=="none"&&i!=="0px",u=a!=="none"&&a!=="";if(d&&!h&&!u)return null;let g=h?`${i} ${n} ${l}`:"";return{x:e.left-t.left,y:e.top-t.top,width:e.width,height:e.height,borderRadius:c==="0px"?"":c,backgroundColor:d?"":s,border:g,boxShadow:u?a:""}}function Ft(r,t){let e=null,o=new ResizeObserver(()=>{e!==null&&cancelAnimationFrame(e),e=requestAnimationFrame(()=>{e=null,t()})});return o.observe(r),o}var Kt=J`
	:host {
		display: block;
		position: relative;
		overflow: hidden;
		--shimmer-color: rgba(128, 128, 128, 0.3);
		--shimmer-duration: 1.5s;
		--shimmer-bg: rgba(128, 128, 128, 0.2);
	}

	:host([loading]:not([mode="overlay"])) ::slotted(*) {
		-webkit-text-fill-color: transparent !important;
		pointer-events: none;
		user-select: none;
	}

	:host([loading]:not([mode="overlay"])) ::slotted(img),
	:host([loading]:not([mode="overlay"])) ::slotted(svg),
	:host([loading]:not([mode="overlay"])) ::slotted(video),
	:host([loading]:not([mode="overlay"])) ::slotted(canvas),
	:host([loading]:not([mode="overlay"])) ::slotted(button),
	:host([loading]:not([mode="overlay"])) ::slotted([role="button"]) {
		opacity: 0 !important;
	}

	/*
	 * Overlay mode: keep the content visible and dimmed, and turn each measured
	 * block into a transparent glint that sweeps over the matching element (a
	 * structure-aware stale-while-revalidate refresh). Setting --shimmer-bg to
	 * transparent makes both the block fill and the gradient edges transparent, so
	 * the same block + direction + reduced-motion rules become a pure light sweep.
	 */
	:host([mode="overlay"]) {
		--shimmer-bg: transparent;
	}

	:host([loading][mode="overlay"]) ::slotted(*) {
		opacity: var(--phantom-content-opacity, 0.5);
		pointer-events: none;
		transition: opacity 0.2s ease-out;
	}

	/* Container blocks replicate card backgrounds for count > 1, which would cover
	   the visible content. Overlay never duplicates rows, so hide them. */
	:host([mode="overlay"]) .shimmer-container-block {
		display: none;
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

	/* Reduced motion — degrade every animation mode to the static solid look
	   (WCAG 2.3.3: the infinite shimmer/pulse/breathe animations stop; blocks
	   keep their static background, exactly like animation="solid"). */
	@media (prefers-reduced-motion: reduce) {
		.shimmer-block,
		:host([animation]) .shimmer-block {
			animation: none;
		}

		.shimmer-block::after {
			display: none;
		}
	}
`;var p=class extends S{constructor(){super(...arguments);this.loading=!1;this.shimmerDirection="ltr";this.shimmerColor=dt;this.backgroundColor=ct;this.duration=1.5;this.fallbackRadius=4;this.animation="shimmer";this.mode="skeleton";this.stagger=0;this.reveal=0;this.count=1;this.countGap=0;this.debug=!1;this.loadingLabel="Loading";this.pierceShadow=!1;this._blocks=[];this._revealing=!1;this._resizeObserver=null;this._mutationObserver=null;this._loadHandler=null;this._measureScheduled=!1;this._revealTimeout=null;this._visibility=new X(this)}static{this.styles=Kt}connectedCallback(){super.connectedCallback(),Ut(),this.hasUpdated&&this.loading&&(this._setupObservers(),this._scheduleMeasure())}disconnectedCallback(){super.disconnectedCallback(),this._teardownObservers(),this._clearRevealTimeout()}willUpdate(e){e.has("loading")&&!this.loading&&this.reveal>0&&this._blocks.length>0&&(this._revealing=!0)}updated(e){(e.has("count")||e.has("countGap"))&&this.loading&&this._scheduleMeasure(),(e.has("loading")||e.has("loadingLabel"))&&(this.setAttribute("aria-busy",String(this.loading)),this.loading?this.setAttribute("aria-label",this.loadingLabel):this.removeAttribute("aria-label")),e.has("loading")&&(!this.loading&&this.hasAttribute("loading")&&this.removeAttribute("loading"),this.loading?(this._revealing=!1,this._clearRevealTimeout(),this._scheduleMeasure(),this._setupObservers()):this._revealing?(this._teardownObservers(),this._revealTimeout=setTimeout(()=>{this._revealing=!1,this._blocks=[],this._revealTimeout=null,this.style.minHeight="",this._visibility.restore()},this.reveal*1e3)):(this._blocks=[],this._teardownObservers(),this.style.minHeight="",this._visibility.restore()))}render(){let e={};this.shimmerColor!==dt&&(e["--shimmer-color"]=this.shimmerColor),this.backgroundColor!==ct&&(e["--shimmer-bg"]=this.backgroundColor),Number.isFinite(this.duration)&&this.duration!==1.5&&(e["--shimmer-duration"]=`${this.duration}s`),Number.isFinite(this.reveal)&&this.reveal>0&&(e["--reveal-duration"]=`${this.reveal}s`);let o=U(e),s=this.loading||this._revealing;return E`
      <slot></slot>
      ${s?E`
            <div
              class="shimmer-overlay ${this._revealing?"revealing":""}"
              style=${o}
              aria-hidden="true"
            >
              ${It(this._blocks,{fallbackRadius:this.fallbackRadius,backgroundColor:this.backgroundColor,stagger:this.stagger,debug:this.debug})}
            </div>
          `:m}
    `}_scheduleMeasure(){this._measureScheduled||(this._measureScheduled=!0,requestAnimationFrame(()=>{this._measureScheduled=!1,this._measure()}))}_measure(){if(!this.loading)return;let e=this.getBoundingClientRect();if(e.width===0||e.height===0)return;let o=this.shadowRoot?.querySelector("slot");if(!o)return;this._mutationObserver&&this._mutationObserver.disconnect();let s=o.assignedElements({flatten:!0}),i=[];this.mode!=="overlay"&&this._visibility.apply(s);for(let n of s){let l=Wt(n,e,this.pierceShadow);i.push(...l)}if(this.count>1&&i.length>0&&this.mode!=="overlay"){let n=0;for(let d of s){let h=d.getBoundingClientRect();n=Math.max(n,h.bottom-e.top)}let l=[];for(let d of s){let h=Vt(d,e);h&&l.push(h)}let a=[...i];for(let d=1;d<this.count;d++){let h=d*(n+this.countGap);for(let u of l)i.push({x:u.x,y:u.y+h,width:u.width,height:u.height,borderRadius:u.borderRadius,isContainer:!0,containerBg:u.backgroundColor,containerBorder:u.border,containerShadow:u.boxShadow});for(let u of a)i.push({...u,y:u.y+h})}let c=this.count*n+(this.count-1)*this.countGap;this.style.minHeight=`${c}px`}else this.style.minHeight="";this._blocks=i,this._mutationObserver&&this._mutationObserver.observe(this,{childList:!0,subtree:!0,attributes:!0})}_setupObservers(){this._teardownObservers(),this._resizeObserver=Ft(this,()=>{this._scheduleMeasure()}),this._mutationObserver=new MutationObserver(()=>{this._scheduleMeasure()}),this._mutationObserver.observe(this,{childList:!0,subtree:!0,attributes:!0}),this._loadHandler=()=>this._scheduleMeasure(),this.addEventListener("load",this._loadHandler,!0)}_teardownObservers(){this._resizeObserver&&(this._resizeObserver.disconnect(),this._resizeObserver=null),this._mutationObserver&&(this._mutationObserver.disconnect(),this._mutationObserver=null),this._loadHandler&&(this.removeEventListener("load",this._loadHandler,!0),this._loadHandler=null)}_clearRevealTimeout(){this._revealTimeout!==null&&(clearTimeout(this._revealTimeout),this._revealTimeout=null)}};f([b({type:Boolean,reflect:!0,converter:{fromAttribute:e=>e!==null&&e!=="false",toAttribute:e=>e?"":null}})],p.prototype,"loading",2),f([b({attribute:"shimmer-direction",reflect:!0})],p.prototype,"shimmerDirection",2),f([b({attribute:"shimmer-color"})],p.prototype,"shimmerColor",2),f([b({attribute:"background-color"})],p.prototype,"backgroundColor",2),f([b({type:Number})],p.prototype,"duration",2),f([b({type:Number,attribute:"fallback-radius"})],p.prototype,"fallbackRadius",2),f([b({reflect:!0})],p.prototype,"animation",2),f([b({reflect:!0})],p.prototype,"mode",2),f([b({type:Number})],p.prototype,"stagger",2),f([b({type:Number})],p.prototype,"reveal",2),f([b({type:Number,converter:e=>Math.max(1,Math.round(Number(e)||1))})],p.prototype,"count",2),f([b({type:Number,attribute:"count-gap",converter:e=>Math.max(0,Number(e)||0)})],p.prototype,"countGap",2),f([b({type:Boolean,reflect:!0})],p.prototype,"debug",2),f([b({attribute:"loading-label"})],p.prototype,"loadingLabel",2),f([b({type:Boolean,attribute:"pierce-shadow"})],p.prototype,"pierceShadow",2),f([ht()],p.prototype,"_blocks",2),f([ht()],p.prototype,"_revealing",2);customElements.get(G)||customElements.define(G,p);})();
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
