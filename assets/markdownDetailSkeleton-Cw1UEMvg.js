import{j as s,C as j,e as L,S as u,b as T}from"./index-CJ34pbwU.js";function M(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])}return e}function N(e,r){return Array(r+1).join(e)}function I(e){return e.replace(/^\n*/,"")}function H(e){for(var r=e.length;r>0&&e[r-1]===`
`;)r--;return e.substring(0,r)}var F=["ADDRESS","ARTICLE","ASIDE","AUDIO","BLOCKQUOTE","BODY","CANVAS","CENTER","DD","DIR","DIV","DL","DT","FIELDSET","FIGCAPTION","FIGURE","FOOTER","FORM","FRAMESET","H1","H2","H3","H4","H5","H6","HEADER","HGROUP","HR","HTML","ISINDEX","LI","MAIN","MENU","NAV","NOFRAMES","NOSCRIPT","OL","OUTPUT","P","PRE","SECTION","TABLE","TBODY","TD","TFOOT","TH","THEAD","TR","UL"];function A(e){return k(e,F)}var w=["AREA","BASE","BR","COL","COMMAND","EMBED","HR","IMG","INPUT","KEYGEN","LINK","META","PARAM","SOURCE","TRACK","WBR"];function b(e){return k(e,w)}function $(e){return S(e,w)}var R=["A","TABLE","THEAD","TBODY","TFOOT","TH","TD","IFRAME","SCRIPT","AUDIO","VIDEO"];function V(e){return k(e,R)}function U(e){return S(e,R)}function k(e,r){return r.indexOf(e.nodeName)>=0}function S(e,r){return e.getElementsByTagName&&r.some(function(t){return e.getElementsByTagName(t).length})}var c={};c.paragraph={filter:"p",replacement:function(e){return`

`+e+`

`}};c.lineBreak={filter:"br",replacement:function(e,r,t){return t.br+`
`}};c.heading={filter:["h1","h2","h3","h4","h5","h6"],replacement:function(e,r,t){var n=Number(r.nodeName.charAt(1));if(t.headingStyle==="setext"&&n<3){var i=N(n===1?"=":"-",e.length);return`

`+e+`
`+i+`

`}else return`

`+N("#",n)+" "+e+`

`}};c.blockquote={filter:"blockquote",replacement:function(e){return e=e.replace(/^\n+|\n+$/g,""),e=e.replace(/^/gm,"> "),`

`+e+`

`}};c.list={filter:["ul","ol"],replacement:function(e,r){var t=r.parentNode;return t.nodeName==="LI"&&t.lastElementChild===r?`
`+e:`

`+e+`

`}};c.listItem={filter:"li",replacement:function(e,r,t){var n=t.bulletListMarker+"   ",i=r.parentNode;if(i.nodeName==="OL"){var a=i.getAttribute("start"),f=Array.prototype.indexOf.call(i.children,r);n=(a?Number(a)+f:f+1)+".  "}return e=e.replace(/^\n+/,"").replace(/\n+$/,`
`).replace(/\n/gm,`
`+" ".repeat(n.length)),n+e+(r.nextSibling&&!/\n$/.test(e)?`
`:"")}};c.indentedCodeBlock={filter:function(e,r){return r.codeBlockStyle==="indented"&&e.nodeName==="PRE"&&e.firstChild&&e.firstChild.nodeName==="CODE"},replacement:function(e,r,t){return`

    `+r.firstChild.textContent.replace(/\n/g,`
    `)+`

`}};c.fencedCodeBlock={filter:function(e,r){return r.codeBlockStyle==="fenced"&&e.nodeName==="PRE"&&e.firstChild&&e.firstChild.nodeName==="CODE"},replacement:function(e,r,t){for(var n=r.firstChild.getAttribute("class")||"",i=(n.match(/language-(\S+)/)||[null,""])[1],a=r.firstChild.textContent,f=t.fence.charAt(0),o=3,l=new RegExp("^"+f+"{3,}","gm"),h;h=l.exec(a);)h[0].length>=o&&(o=h[0].length+1);var m=N(f,o);return`

`+m+i+`
`+a.replace(/\n$/,"")+`
`+m+`

`}};c.horizontalRule={filter:"hr",replacement:function(e,r,t){return`

`+t.hr+`

`}};c.inlineLink={filter:function(e,r){return r.linkStyle==="inlined"&&e.nodeName==="A"&&e.getAttribute("href")},replacement:function(e,r){var t=r.getAttribute("href");t&&(t=t.replace(/([()])/g,"\\$1"));var n=d(r.getAttribute("title"));return n&&(n=' "'+n.replace(/"/g,'\\"')+'"'),"["+e+"]("+t+n+")"}};c.referenceLink={filter:function(e,r){return r.linkStyle==="referenced"&&e.nodeName==="A"&&e.getAttribute("href")},replacement:function(e,r,t){var n=r.getAttribute("href"),i=d(r.getAttribute("title"));i&&(i=' "'+i+'"');var a,f;switch(t.linkReferenceStyle){case"collapsed":a="["+e+"][]",f="["+e+"]: "+n+i;break;case"shortcut":a="["+e+"]",f="["+e+"]: "+n+i;break;default:var o=this.references.length+1;a="["+e+"]["+o+"]",f="["+o+"]: "+n+i}return this.references.push(f),a},references:[],append:function(e){var r="";return this.references.length&&(r=`

`+this.references.join(`
`)+`

`,this.references=[]),r}};c.emphasis={filter:["em","i"],replacement:function(e,r,t){return e.trim()?t.emDelimiter+e+t.emDelimiter:""}};c.strong={filter:["strong","b"],replacement:function(e,r,t){return e.trim()?t.strongDelimiter+e+t.strongDelimiter:""}};c.code={filter:function(e){var r=e.previousSibling||e.nextSibling,t=e.parentNode.nodeName==="PRE"&&!r;return e.nodeName==="CODE"&&!t},replacement:function(e){if(!e)return"";e=e.replace(/\r?\n|\r/g," ");for(var r=/^`|^ .*?[^ ].* $|`$/.test(e)?" ":"",t="`",n=e.match(/`+/gm)||[];n.indexOf(t)!==-1;)t=t+"`";return t+r+e+r+t}};c.image={filter:"img",replacement:function(e,r){var t=d(r.getAttribute("alt")),n=r.getAttribute("src")||"",i=d(r.getAttribute("title")),a=i?' "'+i+'"':"";return n?"!["+t+"]("+n+a+")":""}};function d(e){return e?e.replace(/(\n+\s*)+/g,`
`):""}function O(e){this.options=e,this._keep=[],this._remove=[],this.blankRule={replacement:e.blankReplacement},this.keepReplacement=e.keepReplacement,this.defaultRule={replacement:e.defaultReplacement},this.array=[];for(var r in e.rules)this.array.push(e.rules[r])}O.prototype={add:function(e,r){this.array.unshift(r)},keep:function(e){this._keep.unshift({filter:e,replacement:this.keepReplacement})},remove:function(e){this._remove.unshift({filter:e,replacement:function(){return""}})},forNode:function(e){if(e.isBlank)return this.blankRule;var r;return(r=p(this.array,e,this.options))||(r=p(this._keep,e,this.options))||(r=p(this._remove,e,this.options))?r:this.defaultRule},forEach:function(e){for(var r=0;r<this.array.length;r++)e(this.array[r],r)}};function p(e,r,t){for(var n=0;n<e.length;n++){var i=e[n];if(W(i,r,t))return i}}function W(e,r,t){var n=e.filter;if(typeof n=="string"){if(n===r.nodeName.toLowerCase())return!0}else if(Array.isArray(n)){if(n.indexOf(r.nodeName.toLowerCase())>-1)return!0}else if(typeof n=="function"){if(n.call(e,r,t))return!0}else throw new TypeError("`filter` needs to be a string, array, or function")}function _(e){var r=e.element,t=e.isBlock,n=e.isVoid,i=e.isPre||function(P){return P.nodeName==="PRE"};if(!(!r.firstChild||i(r))){for(var a=null,f=!1,o=null,l=x(o,r,i);l!==r;){if(l.nodeType===3||l.nodeType===4){var h=l.data.replace(/[ \r\n\t]+/g," ");if((!a||/ $/.test(a.data))&&!f&&h[0]===" "&&(h=h.substr(1)),!h){l=g(l);continue}l.data=h,a=l}else if(l.nodeType===1)t(l)||l.nodeName==="BR"?(a&&(a.data=a.data.replace(/ $/,"")),a=null,f=!1):n(l)||i(l)?(a=null,f=!0):a&&(f=!1);else{l=g(l);continue}var m=x(o,l,i);o=l,l=m}a&&(a.data=a.data.replace(/ $/,""),a.data||g(a))}}function g(e){var r=e.nextSibling||e.parentNode;return e.parentNode.removeChild(e),r}function x(e,r,t){return e&&e.parentNode===r||t(r)?r.nextSibling||r.parentNode:r.firstChild||r.nextSibling||r.parentNode}var E=typeof window<"u"?window:{};function G(){var e=E.DOMParser,r=!1;try{new e().parseFromString("","text/html")&&(r=!0)}catch{}return r}function X(){var e=function(){};return K()?e.prototype.parseFromString=function(r){var t=new window.ActiveXObject("htmlfile");return t.designMode="on",t.open(),t.write(r),t.close(),t}:e.prototype.parseFromString=function(r){var t=document.implementation.createHTMLDocument("");return t.open(),t.write(r),t.close(),t},e}function K(){var e=!1;try{document.implementation.createHTMLDocument("").open()}catch{E.ActiveXObject&&(e=!0)}return e}var Y=G()?E.DOMParser:X();function q(e,r){var t;if(typeof e=="string"){var n=z().parseFromString('<x-turndown id="turndown-root">'+e+"</x-turndown>","text/html");t=n.getElementById("turndown-root")}else t=e.cloneNode(!0);return _({element:t,isBlock:A,isVoid:b,isPre:r.preformattedCode?Q:null}),t}var v;function z(){return v=v||new Y,v}function Q(e){return e.nodeName==="PRE"||e.nodeName==="CODE"}function J(e,r){return e.isBlock=A(e),e.isCode=e.nodeName==="CODE"||e.parentNode.isCode,e.isBlank=Z(e),e.flankingWhitespace=ee(e,r),e}function Z(e){return!b(e)&&!V(e)&&/^\s*$/i.test(e.textContent)&&!$(e)&&!U(e)}function ee(e,r){if(e.isBlock||r.preformattedCode&&e.isCode)return{leading:"",trailing:""};var t=re(e.textContent);return t.leadingAscii&&C("left",e,r)&&(t.leading=t.leadingNonAscii),t.trailingAscii&&C("right",e,r)&&(t.trailing=t.trailingNonAscii),{leading:t.leading,trailing:t.trailing}}function re(e){var r=e.match(/^(([ \t\r\n]*)(\s*))(?:(?=\S)[\s\S]*\S)?((\s*?)([ \t\r\n]*))$/);return{leading:r[1],leadingAscii:r[2],leadingNonAscii:r[3],trailing:r[4],trailingNonAscii:r[5],trailingAscii:r[6]}}function C(e,r,t){var n,i,a;return e==="left"?(n=r.previousSibling,i=/ $/):(n=r.nextSibling,i=/^ /),n&&(n.nodeType===3?a=i.test(n.nodeValue):t.preformattedCode&&n.nodeName==="CODE"?a=!1:n.nodeType===1&&!A(n)&&(a=i.test(n.textContent))),a}var te=Array.prototype.reduce,ne=[[/\\/g,"\\\\"],[/\*/g,"\\*"],[/^-/g,"\\-"],[/^\+ /g,"\\+ "],[/^(=+)/g,"\\$1"],[/^(#{1,6}) /g,"\\$1 "],[/`/g,"\\`"],[/^~~~/g,"\\~~~"],[/\[/g,"\\["],[/\]/g,"\\]"],[/^>/g,"\\>"],[/_/g,"\\_"],[/^(\d+)\. /g,"$1\\. "]];function y(e){if(!(this instanceof y))return new y(e);var r={rules:c,headingStyle:"setext",hr:"* * *",bulletListMarker:"*",codeBlockStyle:"indented",fence:"```",emDelimiter:"_",strongDelimiter:"**",linkStyle:"inlined",linkReferenceStyle:"full",br:"  ",preformattedCode:!1,blankReplacement:function(t,n){return n.isBlock?`

`:""},keepReplacement:function(t,n){return n.isBlock?`

`+n.outerHTML+`

`:n.outerHTML},defaultReplacement:function(t,n){return n.isBlock?`

`+t+`

`:t}};this.options=M({},r,e),this.rules=new O(this.options)}y.prototype={turndown:function(e){if(!le(e))throw new TypeError(e+" is not a string, or an element/document/fragment node.");if(e==="")return"";var r=D.call(this,new q(e,this.options));return ie.call(this,r)},use:function(e){if(Array.isArray(e))for(var r=0;r<e.length;r++)this.use(e[r]);else if(typeof e=="function")e(this);else throw new TypeError("plugin must be a Function or an Array of Functions");return this},addRule:function(e,r){return this.rules.add(e,r),this},keep:function(e){return this.rules.keep(e),this},remove:function(e){return this.rules.remove(e),this},escape:function(e){return ne.reduce(function(r,t){return r.replace(t[0],t[1])},e)}};function D(e){var r=this;return te.call(e.childNodes,function(t,n){n=new J(n,r.options);var i="";return n.nodeType===3?i=n.isCode?n.nodeValue:r.escape(n.nodeValue):n.nodeType===1&&(i=ae.call(r,n)),B(t,i)},"")}function ie(e){var r=this;return this.rules.forEach(function(t){typeof t.append=="function"&&(e=B(e,t.append(r.options)))}),e.replace(/^[\t\r\n]+/,"").replace(/[\t\r\n\s]+$/,"")}function ae(e){var r=this.rules.forNode(e),t=D.call(this,e),n=e.flankingWhitespace;return(n.leading||n.trailing)&&(t=t.trim()),n.leading+r.replacement(t,e,this.options)+n.trailing}function B(e,r){var t=H(e),n=I(r),i=Math.max(e.length-t.length,r.length-n.length),a=`

`.substring(0,i);return t+a+n}function le(e){return e!=null&&(typeof e=="string"||e.nodeType&&(e.nodeType===1||e.nodeType===9||e.nodeType===11))}function ce(){return s.jsx("div",{className:"flex w-full flex-col items-center justify-start p-6",children:s.jsxs(j,{className:"w-full px-6 py-4",children:[s.jsxs("div",{className:"flex items-center justify-between px-6",children:[s.jsx(L,{className:"ck-title",children:s.jsx(u,{className:"h-8 w-40"})}),s.jsxs("div",{className:"flex gap-3",children:[s.jsx(u,{className:"h-10 w-20"}),s.jsx(u,{className:"h-10 w-20"})]})]}),s.jsxs(T,{className:"ck-body-2 flex justify-end gap-6",children:[s.jsx(u,{className:"h-4 w-24"}),s.jsx(u,{className:"h-4 w-24"}),s.jsx(u,{className:"h-4 w-24"}),s.jsx(u,{className:"h-4 w-24"})]}),s.jsxs(T,{children:[s.jsxs("div",{className:"mb-4",children:[s.jsx(u,{className:"mb-2 h-5 w-16"})," ",s.jsx(u,{className:"h-10 w-full"})," "]}),s.jsxs("div",{className:"mb-4",children:[s.jsx(u,{className:"mb-2 h-5 w-16"})," ",s.jsx(u,{className:"h-[500px] w-full"})," "]})]})]})})}export{ce as M,y as T};
