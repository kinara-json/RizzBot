const fs = require('fs');
const chalk = require('chalk');

/*
	* Create By Naze
	* And continued by Khyz
	* Follow https://github.com/nazedev
	* Whatsapp : https://whatsapp.com/channel/0029VaWOkNm7DAWtkvkJBK43
*/

//~~~~~~~~~~~~< GLOBAL SETTINGS >~~~~~~~~~~~~\\

global.owner = ['6283835730235'] //['628','628'] 2 owner atau lebih
global.listprefix = ['+','!','.']
global.listv = ['•','●','■','✿','▲','➩','➢','➣','➤','✦','✧','△','❀','○','□','♤','♡','◇','♧','々','〆']
global.tempatDB = 'database.json' // Taruh url mongodb di sini jika menggunakan mongodb. Format : 'mongodb+srv://...'
global.tempatStore = 'baileys_store.json' // Taruh url mongodb di sini jika menggunakan mongodb. Format : 'mongodb+srv://...'
global.pairing_code = true
global.number_bot = '6287771479280' // Kalo pake panel bisa masukin nomer di sini, jika belum ambil session. Format : '628xx'
global.thumbnail = 'https://files.catbox.moe/okoz9e.jpg'
global.thumbimg = 'https://files.catbox.moe/okoz9e.jpg'

global.fake = {
	anonim: 'https://telegra.ph/file/95670d63378f7f4210f03.png',
	thumbnailUrl: 'https://telegra.ph/file/fe4843a1261fc414542c4.jpg',
	thumbnail: fs.readFileSync('./src/media/naze.png'),
	docs: fs.readFileSync('./src/media/fake.pdf'),
	listfakedocs: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.openxmlformats-officedocument.presentationml.presentation','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/pdf'],
}

global.my = {
	tt: 'https://www.tiktok.com/@hudssss9?_t=ZS-8y2XkxBN2lG&_r=1',
	gh: 'https://github.com/nazedev',
	gc: 'https://chat.whatsapp.com/B5qJIwZHm4VEYZJQE6iMwy',
	ch: '120363401718869058@newsletter',
}

global.limit = {
	free: 20,
	premium: 999,
	vip: 9999
}

global.money = {
	free: 10000,
	premium: 1000000,
	vip: 10000000
}

global.mess = {
	key: 'Apikey mu telah habis silahkan kunjungi\nhttps://my.hitori.pw',
	owner: '*sʏsᴛᴇᴍ ɴᴏᴛɪᴄᴇ* ᴋʜᴜsᴜs ᴏᴡɴᴇʀ sᴀᴊᴀ ʏᴀ',
	admin: '*sʏsᴛᴇᴍ ɴᴏᴛɪᴄᴇ* ғɪᴛᴜʀᴇ ᴋʜᴜsᴜs ᴀᴅᴍɪɴ ɢʀᴏᴜᴘ',
	botAdmin: '*sʏsᴛᴇᴍ ɴᴏᴛɪᴄᴇ* ᴊᴀᴅɪɪɪɴ ʙᴏᴛ ᴀᴅᴍɪɴ ᴅᴜʟᴜ ʟᴀʜ ʙᴀʀᴜ ʙɪsᴀ ɢᴜɴᴀɪɴ ɴɪʜ ғɪᴛᴜʀᴇ',
	regis: '*sʏsᴛᴇᴍ ɴᴏᴛɪᴄᴇ* ᴋᴀᴍᴜ ʙᴇʟᴜᴍ ᴛᴇʀᴅᴀꜰᴛᴀʀ!\nᴋᴇᴛɪᴋ *.ʀᴇɢɪs (ɴᴀᴍᴀᴍᴜ)* ᴜɴᴛᴜᴋ ᴍᴇɴᴅᴀꜰᴛᴀʀ.',
	group: '*sʏsᴛᴇᴍ ɴᴏᴛɪᴄᴇ* ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ ᴋʜᴜsᴜs ɢʀᴏᴜᴘ sᴀᴊᴀ ʏᴀ',
	private: '*sʏsᴛᴇᴍ ɴᴏᴛɪᴄᴇ* ᴄᴍᴅ ɪɴɪ ᴋʜᴜsᴜs ᴘʀɪᴠᴀᴛᴇ ᴄʜᴀᴛ',
	limit: '*sʏsᴛᴇᴍ ɴᴏᴛɪᴄᴇ* ʟɪᴍɪᴛ ᴀɴᴅᴀ ᴛᴇʟᴀʜ ʜᴀʙɪꜱ',
	prem: '*sʏsᴛᴇᴍ ɴᴏᴛɪᴄᴇ* ᴋʜᴜsᴜs ᴜsᴇʀ ᴘʀᴇᴍ ʙᴜʏ ᴘʀᴇᴍ ᴋᴇ ᴏᴡɴᴇʀ',
	wait: '*sʏsᴛᴇᴍ ɴᴏᴛɪᴄᴇ* ᴡᴀɪᴛɪɴɢ ᴏᴛᴡ ᴘʀᴏsᴇs...',
	error: '*sʏsᴛᴇᴍ ɴᴏᴛɪᴄᴇ* ʟᴀɢɪ ᴀᴅᴀ ᴋᴇɴᴅᴀʟᴀ ᴋᴀᴋ sᴏʀʏ ʏᴀ',
	done: '*sʏsᴛᴇᴍ ɴᴏᴛɪᴄᴇ* ᴅᴏɴᴇ ʏᴀ ᴡɪʀ...',
}

global.APIs = {
	hitori: 'https://api.hitori.pw',
}
global.APIKeys = {
	'https://api.hitori.pw': 'htrkey-77eb83c0eeb39d40',
	geminiApikey: ['AIzaSyD0lkGz6ZhKi_MHSSmJcCX3wXoDZhELPaQ','AIzaSyDnBPd_EhBfr73NssnThVQZYiKZVhGZewU','AIzaSyA94OZD-0V4quRbzPb2j75AuzSblPHE75M','AIzaSyB5aTYbUg2VQ0oXr5hdJPN8AyLJcmM84-A','AIzaSyB1xYZ2YImnBdi2Bh-If_8lj6rvSkabqlA']
}

// Lainnya

global.badWords = ['kontol','kntl','k0ntol','k@ntol','memek','mmk','m3mek','pepek','ppek','p3pek','anjing','ajg','anjg','bangsat','bgsat','b4ngsat','babi','b4bi','b@bi','bab1','goblok','gblk','g0blok','goblog','goblg','tolol','tlol','t0lol','toolol','tai','taik','tae','t@i','t4i','idiot','id10t','idi0t','ngentot','ngntot','ngentd','ng3ntot','ngetot','ng4ntot','jembut','jmbut','j3mbut','sange','s4nge','s@nge','sang3','lonte','l0nte','lonthe','l0nt3','pelacur','perek','p3r3k','lonte murahan','keparat','brengsek','bajingan','b4jingan','laknat','bodoh','bdh','b0doh','bangke','b@ngke','open bo','openbo','open b0','bo open','colmek','coli','share b0','hrny','telanjang','bokep','video 18+','nudes','nud3','naked','anak haram','idiot lo','tolol lu','tolol banget','fuck','fck','fuxk','shit','sh1t','sht','bitch','b1tch','biatch','btch','asshole','ashole','dick','d1ck','dck','d@ck','pussy','pusy','pusi','bastard','b4stard','bstard','faggot','f4ggot','fag','slut','whore','w4hore','h0e','gay','lesbi','lesbian','dasar miskin','miskin','yatim','y4tim','y-team']
global.chatLength = 1000

//~~~~~~~~~~~~~~~< PROCESS >~~~~~~~~~~~~~~~\\

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.blue(`╔════════════════════════════════════╗
║ ◇ STATUS  : UPDATE
║ ◇ LOKASI : ${__filename}
╚════════════════════════════════════╝`))
	delete require.cache[file]
	require(file)
});
