const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = ''
const DISCORD_API = 'https://discord.com/api/v10';
app.use(express.json());
app.use((req,res,next)=>{res.header('Access-Control-Allow-Origin','*');res.header('Access-Control-Allow-Methods','GET,POST,DELETE,OPTIONS');res.header('Access-Control-Allow-Headers','Content-Type');if(req.method==='OPTIONS')return res.sendStatus(200);next();});
async function dc(e,m='GET',b=null){const o={method:m,headers:{'Authorization':'Bot '+BOT_TOKEN,'Content-Type':'application/json'}};if(b)o.body=JSON.stringify(b);const r=await fetch(DISCORD_API+e,o);const d=r.status===204?{}:await r.json().catch(()=>({}));return{ok:r.ok,status:r.status,data:d};}
app.get('/api/me',async(req,res)=>{const r=await dc('/users/@me');res.json(r.ok?r.data:{error:r.data.message||'Failed'});});
app.get('/api/guilds',async(req,res)=>{const r=await dc('/users/@me/guilds');res.json(r.ok?r.data:{error:r.data.message||'Failed'});});
app.post('/api/ban',async(req,res)=>{const{guildId,userId,reason}=req.body;const r=await dc(`/guilds/${guildId}/bans/${userId}`,'PUT',{delete_message_seconds:0,reason:reason||'No reason'});res.json(r.ok||r.status===204?{success:true}:{error:r.data.message||'Failed'});});
app.delete('/api/ban',async(req,res)=>{const{guildId,userId}=req.body;const r=await dc(`/guilds/${guildId}/bans/${userId}`,'DELETE');res.json(r.ok||r.status===204?{success:true}:{error:r.data.message||'Failed'});});
app.post('/api/lock',async(req,res)=>{const{guildId,channelId}=req.body;const r=await dc(`/channels/${channelId}`,'PATCH',{permission_overwrites:[{id:guildId,type:0,deny:'2048',allow:'0'}]});res.json(r.ok?{success:true}:{error:r.data.message||'Failed'});});
app.post('/api/unlock',async(req,res)=>{const{guildId,channelId}=req.body;const r=await dc(`/channels/${channelId}`,'PATCH',{permission_overwrites:[{id:guildId,type:0,deny:'0',allow:'2048'}]});res.json(r.ok?{success:true}:{error:r.data.message||'Failed'});});
app.post('/api/message',async(req,res)=>{const{channelId,content}=req.body;const r=await dc(`/channels/${channelId}/messages`,'POST',{content});res.json(r.ok?{success:true,messageId:r.data.id}:{error:r.data.message||'Failed'});});
app.post('/api/dm',async(req,res)=>{const{userId,content}=req.body;const ch=await dc('/users/@me/channels','POST',{recipient_id:userId});if(!ch.ok)return res.json({error:ch.data.message||'Failed'});const r=await dc(`/channels/${ch.data.id}/messages`,'POST',{content});res.json(r.ok?{success:true}:{error:r.data.message||'Failed'});});
app.get('/',(req,res)=>res.json({status:'online',bot:'96 SYSTEM'}));
app.listen(PORT,()=>console.log('✅ Running on port '+PORT));
