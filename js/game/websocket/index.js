import PubSub from 'pubsub-js';
import axios from 'axios';
import player from '../player';
import { print, printErr } from '../util';
import { baseSocketUrl, socket } from '../config';
import config from '../../config';

// Vars//
const req = config.url.requestSocketMessageTypes;
let ws;

// Funcs//
const { publish } = PubSub;
const handleMessage = (message) => {
	print('WS Message Received');
	try {
		const msg = JSON.parse(message.data);
		const type = Object.keys(msg)[0];
		const payload = msg[type];
		publish(type, payload);
		print(`WS Parsed Data ${type} with payload ${payload}`);
	} catch (e) {
		printErr('WS Failed to parse message');
	}
};
const handleAxios = f => (v => f(v.data));
const errorAxios = (e) => { throw e; };
const isMessage = (cs, msg) => !!(Object.keys(socket.messages[cs]).find(key => socket.messages[cs][key] === msg));
const isServerMessage = msg => isMessage('server', msg);
const isClientMessage = msg => isMessage('client', msg);
const notMessage = (type, client) => { throw new Error(`${type} is not type of Socket ${client ? 'Client' : 'Server'} Message`); };

// Exports//
export const getMessageTypes = async () => axios[req.method](req.path, { headers: { token: player.userData.authenticationKey } }).then(handleAxios(socket.setMessages)).catch(errorAxios);

export const connect = async () => {
	if (!socket.messages) await getMessageTypes();
	return new Promise((resolve, reject) => {
		ws = new WebSocket(baseSocketUrl);
		ws.onerror = () => reject(Error('WebSocket error'));
		ws.onopen = () => resolve(true);
		ws.onclose = () => print('WebSocket connection closed');
		ws.onmessage = handleMessage;
	});
};

export const sendMessage = (k, v = false) => (isClientMessage(k) ? ws.send(JSON.stringify({
	[k]: v,
})) : notMessage(k, true));
export const subscribe = (key, callback) => (isServerMessage(key) ? PubSub.subscribe(key, (a, b) => callback(b)) : notMessage(key, false));
export const { unsubscribe } = PubSub;
