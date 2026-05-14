require('@babel/register')({
    extensions: ['.js'],
    ignore: [/node_modules/],
});

const assert = require('node:assert/strict');
const http = require('node:http');
const test = require('node:test');
const request = require('supertest');
const { io: createClient } = require('socket.io-client');

const app = require('../../../index').default;
const { JwtService } = require('../../../modules/auth/service/jwt.service');
const { ChatService } = require('../services/chat.service');
const {
    initializeChatGateway,
    ChatEventPublisher,
} = require('../socket');

const users = [
    {
        id: '11111111-1111-4111-8111-111111111111',
        email: 'candidate1@example.com',
        role: 'candidate',
        fullName: 'Candidate One',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
        id: '22222222-2222-4222-8222-222222222222',
        email: 'recruiter1@example.com',
        role: 'recruiter',
        fullName: 'Recruiter One',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
        id: '33333333-3333-4333-8333-333333333333',
        email: 'candidate2@example.com',
        role: 'candidate',
        fullName: 'Candidate Two',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
    },
];

const baseConversationId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
let state;
let timestampCursor;
let server;
let gateway;
let baseUrl;
const DEFAULT_TIMEOUT_MS = 2000;

const originalDependencies = {
    conversationRepository: ChatService.conversationRepository,
    participantRepository: ChatService.participantRepository,
    messageRepository: ChatService.messageRepository,
    userRepository: ChatService.userRepository,
    transactionProvider: ChatService.transactionProvider,
};

const nextTimestamp = () => {
    const value = new Date(Date.UTC(2026, 0, 1, 0, 0, timestampCursor))
        .toISOString();
    timestampCursor += 1;
    return value;
};

const clone = value => JSON.parse(JSON.stringify(value));

const resetState = () => {
    timestampCursor = 0;
    state = {
        conversations: [
            {
                id: baseConversationId,
                createdAt: nextTimestamp(),
                updatedAt: nextTimestamp(),
            },
        ],
        participants: [
            {
                conversationId: baseConversationId,
                userId: users[0].id,
                createdAt: nextTimestamp(),
                updatedAt: nextTimestamp(),
            },
            {
                conversationId: baseConversationId,
                userId: users[1].id,
                createdAt: nextTimestamp(),
                updatedAt: nextTimestamp(),
            },
        ],
        messages: [
            {
                id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
                conversationId: baseConversationId,
                senderId: users[1].id,
                content: 'Initial recruiter message',
                voiceUrl: null,
                type: 'text',
                createdAt: nextTimestamp(),
                updatedAt: nextTimestamp(),
                deletedAt: null,
            },
        ],
    };
};

const buildParticipant = participant => {
    const user = users.find(item => item.id === participant.userId);
    return {
        conversationId: participant.conversationId,
        userId: participant.userId,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        createdAt: participant.createdAt,
        updatedAt: participant.updatedAt,
    };
};

const buildMessage = message => {
    const user = users.find(item => item.id === message.senderId);
    return {
        id: message.id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        content: message.content,
        voiceUrl: message.voiceUrl,
        type: message.type,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        deletedAt: message.deletedAt,
        senderEmail: user.email,
        senderRole: user.role,
        senderFullName: user.fullName,
    };
};

const fakeConversationRepository = {
    async findById(id) {
        const conversation = state.conversations.find(item => item.id === id);
        return conversation ? clone(conversation) : null;
    },
    async findByIds(ids) {
        return state.conversations
            .filter(item => ids.includes(item.id))
            .map(item => clone(item));
    },
    async createOne() {
        const conversation = {
            id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
            createdAt: nextTimestamp(),
            updatedAt: nextTimestamp(),
        };

        state.conversations.push(conversation);
        return clone(conversation);
    },
};

const fakeParticipantRepository = {
    async insertMany(participants) {
        participants.forEach(participant => {
            state.participants.push({
                conversationId: participant.conversation_id,
                userId: participant.user_id,
                createdAt: nextTimestamp(),
                updatedAt: nextTimestamp(),
            });
        });

        return [];
    },
    async findConversationIdsByUser(userId) {
        return state.participants
            .filter(item => item.userId === userId)
            .map(item => item.conversationId);
    },
    async findByConversationId(conversationId) {
        return state.participants
            .filter(item => item.conversationId === conversationId)
            .map(buildParticipant);
    },
    async findByConversationIds(conversationIds) {
        return state.participants
            .filter(item => conversationIds.includes(item.conversationId))
            .map(buildParticipant);
    },
    async isParticipant(conversationId, userId) {
        return state.participants.some(item => (
            item.conversationId === conversationId && item.userId === userId
        ));
    },
};

const fakeMessageRepository = {
    async createOne(message) {
        const created = {
            id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
            conversationId: message.conversation_id,
            senderId: message.sender_id,
            content: message.content,
            voiceUrl: message.voice_url,
            type: message.type,
            createdAt: nextTimestamp(),
            updatedAt: nextTimestamp(),
            deletedAt: null,
        };

        state.messages.push(created);

        return {
            id: created.id,
            conversation_id: created.conversationId,
            sender_id: created.senderId,
            content: created.content,
            voice_url: created.voiceUrl,
            type: created.type,
            created_at: created.createdAt,
            updated_at: created.updatedAt,
            deleted_at: created.deletedAt,
        };
    },
    async findByConversationId(conversationId, { limit = 50, before = null } = {}) {
        return state.messages
            .filter(item => (
                item.conversationId === conversationId
                && item.deletedAt === null
                && (!before || new Date(item.createdAt) < new Date(before))
            ))
            .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
            .slice(0, limit)
            .map(buildMessage);
    },
    async findByConversationIds(conversationIds) {
        return state.messages
            .filter(item => (
                conversationIds.includes(item.conversationId)
                && item.deletedAt === null
            ))
            .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
            .map(buildMessage);
    },
    async findById(id) {
        const message = state.messages.find(item => item.id === id);
        return message ? buildMessage(message) : null;
    },
};

const fakeUserRepository = {
    async findByIds(ids) {
        return users.filter(user => ids.includes(user.id)).map(item => clone(item));
    },
};

const createToken = user => JwtService.sign({
    id: user.id,
    roles: [user.role],
});

const authHeader = user => `Bearer ${createToken(user)}`;

const withTimeout = (
    promise,
    message,
    timeoutMs = DEFAULT_TIMEOUT_MS,
) => new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
        reject(new Error(message));
    }, timeoutMs);

    promise
        .then(value => {
            clearTimeout(timer);
            resolve(value);
        })
        .catch(error => {
            clearTimeout(timer);
            reject(error);
        });
});

const connectSocket = async user => {
    let readyResolver;
    let readyRejector;
    const ready = withTimeout(new Promise((resolve, reject) => {
        readyResolver = resolve;
        readyRejector = reject;
    }), 'Timed out waiting for chat:ready');

    const socket = createClient(baseUrl, {
        transports: ['websocket'],
        auth: {
            token: authHeader(user),
        },
        forceNew: true,
    });

    socket.once('chat:ready', readyResolver);
    socket.once('connect_error', readyRejector);

    await withTimeout(new Promise((resolve, reject) => {
        socket.once('connect', resolve);
        socket.once('connect_error', reject);
    }), 'Timed out waiting for socket connection');

    return {
        socket,
        ready,
    };
};

const waitForEvent = (emitter, event) => withTimeout(
    new Promise(resolve => {
        emitter.once(event, resolve);
    }),
    `Timed out waiting for ${event}`,
);

const emitWithAck = (socket, event, payload) => new Promise(resolve => {
    socket.emit(event, payload, resolve);
});

test.before(async () => {
    ChatService.conversationRepository = fakeConversationRepository;
    ChatService.participantRepository = fakeParticipantRepository;
    ChatService.messageRepository = fakeMessageRepository;
    ChatService.userRepository = fakeUserRepository;
    ChatService.transactionProvider = async () => ({
        commit: async () => {},
        rollback: async () => {},
    });

    await new Promise(resolve => setTimeout(resolve, 50));

    server = http.createServer(app);
    gateway = initializeChatGateway(server);

    await new Promise(resolve => {
        server.listen(0, () => {
            const { port } = server.address();
            baseUrl = `http://127.0.0.1:${port}`;
            resolve();
        });
    });
});

test.beforeEach(() => {
    resetState();
});

test.after(async () => {
    ChatEventPublisher.clearTransport();
    ChatService.conversationRepository = originalDependencies.conversationRepository;
    ChatService.participantRepository = originalDependencies.participantRepository;
    ChatService.messageRepository = originalDependencies.messageRepository;
    ChatService.userRepository = originalDependencies.userRepository;
    ChatService.transactionProvider = originalDependencies.transactionProvider;

    await new Promise(resolve => gateway.close(resolve));
    await new Promise(resolve => server.close(resolve));
});

test('POST /api/chats/conversations creates a conversation and GET /api/chats/conversations returns it', async () => {
    const createResponse = await request(server)
        .post('/api/chats/conversations')
        .set('authorization', authHeader(users[0]))
        .send({
            participantIds: [users[2].id],
        });

    assert.equal(createResponse.status, 201);
    assert.equal(createResponse.body.participants.length, 2);
    assert.deepEqual(
        createResponse.body.participants.map(item => item.id).sort(),
        [users[0].id, users[2].id].sort(),
    );

    const listResponse = await request(server)
        .get('/api/chats/conversations')
        .set('authorization', authHeader(users[0]));

    assert.equal(listResponse.status, 200);
    assert.equal(listResponse.body.length, 2);
    assert.equal(listResponse.body[0].id, createResponse.body.id);
});

test('REST message creation broadcasts chat:message:new to connected participants', async () => {
    const { socket: receiverSocket, ready } = await connectSocket(users[1]);
    const readyPayload = await ready;

    assert.ok(readyPayload.conversationIds.includes(baseConversationId));

    const messagePromise = waitForEvent(receiverSocket, 'chat:message:new');

    const response = await request(server)
        .post(`/api/chats/conversations/${baseConversationId}/messages`)
        .set('authorization', authHeader(users[0]))
        .send({
            content: 'Hello from REST',
            type: 'text',
        });

    assert.equal(response.status, 201);

    const eventPayload = await messagePromise;
    assert.equal(eventPayload.content, 'Hello from REST');
    assert.equal(eventPayload.sender.id, users[0].id);

    receiverSocket.close();
});

test('socket chat:message:send acknowledges and persists the new message', async () => {
    const { socket: senderSocket, ready } = await connectSocket(users[0]);
    await ready;

    const ack = await emitWithAck(senderSocket, 'chat:message:send', {
        conversationId: baseConversationId,
        content: 'Hello from socket',
        type: 'text',
    });

    assert.equal(ack.ok, true);
    assert.equal(ack.data.content, 'Hello from socket');

    const response = await request(server)
        .get(`/api/chats/conversations/${baseConversationId}/messages`)
        .query({ limit: 10 })
        .set('authorization', authHeader(users[0]));

    assert.equal(response.status, 200);
    assert.ok(
        response.body.items.some(item => item.content === 'Hello from socket'),
    );

    senderSocket.close();
});
