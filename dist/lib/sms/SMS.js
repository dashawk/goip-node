"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _fastXmlParser=_interopRequireDefault(require("fast-xml-parser")),_helper=require("../helper");function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}class SMS{constructor(e,t){this._url=e,this._line=t.line||1,this._user=t.user,this._pass=t.pass,this._options=Object.assign({},{sendUrl:"/default/en_US/sms_info.html",statusUrl:"/default/en_US/send_status.xml",statusRetries:5,statusWait:!1,timeout:1e3},t)}async send(e,t){var s=new URLSearchParams,r=(0,_helper.randomize)(1e4,99999);s.append(line,this._line),s.append(r,r),s.append(action,"sms"),s.append(telnum,e),s.append(smscontent,t),s.append(send,"send");try{var a=await(await fetch(""+this._url+this._options.sendUrl+"?"+s)).text(),i=this._parseResponse(a);if(this._options.statusWait){let t=!1;for(let e=0;e<this._options.statusRetries;e++){try{t=await this._checkStatus(i.id)}catch(e){i.status="error",i.message=e.message}if(t){i.status="send";break}}}return i}catch(e){}}async sent(e){var t=new URLSearchParams;t.append("u",this._user),t.append("p",this._pass);t=await(await fetch(""+this._url+this._options.statusUrl+"?"+t)).text(),t=_fastXmlParser.default.parse(t)["send-sms-status"];if(!t)throw new Error("Sms status not found");var s=t["id"+this._line],r=t["status"+this._line],t=t["error"+this._line];if(!s||s!==e)return!1;if(t)throw new Error(t);return"DONE"===r.toLowerCase()}_parseResponse(e){e.trim().toLowerCase();if(e.includes("error")||!e.includes("sending"))throw new Error(e);var t=e.split(";");if(t[t.length-1].includes("id"))return{id:t[t.length-1].split(":")[1],raw:e.trim()};throw new Error("Sms id not found")}_checkStatus(t){return new Promise(e=>{setTimeout(()=>{e(this.sent(t))},this._options.timeout)})}}var _default=SMS;exports.default=_default;