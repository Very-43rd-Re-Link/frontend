import axios from 'axios';

import type { ChatMessage, ChatRoom } from '@/features/chat/types';
import apiClient, { api } from '@/lib/api-client';
import { getAccessToken } from '@/lib/auth-token-storage';

type ApiRoomType = 'DIRECT' | 'GROUP' | 'APPOINTMENT';
type ApiMessageType = 'TEXT' | 'IMAGE' | 'SYSTEM';

type ChatRoomSummaryResponse = {
    roomId: number;
    roomType: ApiRoomType;
    title: string | null;
    displayName: string | null;
    coverImageUrl: string | null;
    lastMessage: string | null;
    lastMessageType: ApiMessageType | null;
    lastMessageAt: string | null;
    unreadCount: number;
};

type ChatRoomsResponse = {
    rooms: ChatRoomSummaryResponse[];
};

type ChatRoomParticipantsResponse = {
    participants: {
        memberId: number;
        name: string;
        imageUrl: string | null;
    }[];
};

type ChatMessageAttachmentResponse = {
    attachmentId: number;
    attachmentType: string;
    imageUrl: string | null;
    storageKey: string;
    contentType: string;
    fileSize: number;
    width: number | null;
    height: number | null;
    sortOrder: number | null;
};

type ChatMessageResponse = {
    messageId: number;
    roomId: number;
    senderId: number;
    messageType: ApiMessageType;
    textContent: string | null;
    status: string;
    createdAt: string;
    attachments: ChatMessageAttachmentResponse[];
};

type ChatMessagesResponse = {
    messages: ChatMessageResponse[];
    nextCursor: number | null;
    hasNext: boolean;
};

type IssueChatAttachmentPresignedUrlResponse = {
    uploadUrl: string;
    storageKey: string;
    expiresIn: number;
};

type SendChatMessageResponse = {
    messageId: number;
    roomId: number;
    senderId: number;
    messageType: ApiMessageType;
    textContent: string | null;
    createdAt: string;
};

type CreateChatRoomResponse = {
    roomId: number;
    roomType: ApiRoomType;
};

type MarkChatRoomAsReadResponse = {
    roomId: number;
    memberId: number;
    lastReadMessageId: number;
    lastReadAt: string;
};

export async function fetchChatRooms() {
    const response = await apiClient.get<ChatRoomsResponse>('/chat/rooms');

    return response.rooms.map(toChatRoom);
}

export async function createDirectChatRoom(targetMemberId: number) {
    const response = await apiClient.post<CreateChatRoomResponse, { targetMemberId: number }>(
        '/chat/rooms/direct',
        { targetMemberId },
    );

    return String(response.roomId);
}

export async function createGroupChatRoom({
    title,
    participantMemberIds,
}: {
    title: string;
    participantMemberIds: number[];
}) {
    const response = await apiClient.post<CreateChatRoomResponse, {
        title: string;
        participantMemberIds: number[];
        coverImageKey: string | null;
    }>('/chat/rooms/group', {
        title,
        participantMemberIds,
        coverImageKey: null,
    });

    return String(response.roomId);
}

export async function fetchChatRoomParticipants(roomId: string) {
    const response = await apiClient.get<ChatRoomParticipantsResponse>(`/chat/rooms/${roomId}/participants`);

    return response.participants;
}

export async function fetchChatMessages(roomId: string) {
    const currentMemberId = getCurrentMemberId();
    const response = await apiClient.get<ChatMessagesResponse>(`/chat/rooms/${roomId}/messages`, {
        params: { size: 50 },
    });

    return response.messages.map((message) => toChatMessage(message, currentMemberId));
}

export async function markChatRoomAsRead(roomId: string, lastReadMessageId: string) {
    return apiClient.patch<MarkChatRoomAsReadResponse, { lastReadMessageId: number }>(
        `/chat/rooms/${roomId}/read`,
        { lastReadMessageId: Number(lastReadMessageId) },
    );
}

export async function sendChatMessage({
    roomId,
    text,
    imageFile,
}: {
    roomId: string;
    text: string;
    imageFile?: File | null;
}) {
    if (imageFile) {
        const upload = await issueAttachmentUploadUrl(roomId, imageFile);
        await uploadAttachment(upload.uploadUrl, imageFile);

        return apiClient.post<SendChatMessageResponse, unknown>(`/chat/rooms/${roomId}/messages`, {
            clientMessageId: createClientMessageId(),
            messageType: 'IMAGE',
            textContent: text.trim() || null,
            attachments: [
                {
                    storageKey: upload.storageKey,
                    originalFileName: imageFile.name,
                    contentType: imageFile.type,
                    fileSize: imageFile.size,
                    sortOrder: 0,
                },
            ],
        });
    }

    return apiClient.post<SendChatMessageResponse, unknown>(`/chat/rooms/${roomId}/messages`, {
        clientMessageId: createClientMessageId(),
        messageType: 'TEXT',
        textContent: text.trim(),
        attachments: [],
    });
}

async function issueAttachmentUploadUrl(roomId: string, file: File) {
    return apiClient.post<IssueChatAttachmentPresignedUrlResponse, unknown>('/chat/attachments/presigned-url', {
        roomId: Number(roomId),
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
    });
}

async function uploadAttachment(uploadUrl: string, file: File) {
    const config = {
        headers: { 'Content-Type': file.type },
    };

    if (uploadUrl.startsWith('/')) {
        await api.put(uploadUrl, file, config);
        return;
    }

    await axios.put(uploadUrl, file, config);
}

function toChatRoom(room: ChatRoomSummaryResponse): ChatRoom {
    return {
        id: String(room.roomId),
        kind: toChatRoomKind(room.roomType),
        name: toRoomName(room),
        imageUrl: room.coverImageUrl,
        timeLabel: formatTimeLabel(room.lastMessageAt),
        lastMessage: toLastMessage(room.lastMessage, room.lastMessageType),
        unreadCount: room.unreadCount || undefined,
        messages: [],
    };
}

function toChatMessage(message: ChatMessageResponse, currentMemberId: number | null): ChatMessage {
    return {
        id: String(message.messageId),
        sender: message.messageType === 'SYSTEM'
            ? 'system'
            : message.senderId === currentMemberId
                ? 'me'
                : 'other',
        text: message.textContent || (message.messageType === 'IMAGE' ? '사진' : ''),
        time: formatTimeLabel(message.createdAt),
        attachments: message.attachments
            .filter((attachment) => attachment.imageUrl)
            .map((attachment) => ({
                id: String(attachment.attachmentId),
                imageUrl: attachment.imageUrl ?? '',
                contentType: attachment.contentType,
            })),
    };
}

function toRoomName(room: ChatRoomSummaryResponse) {
    const fallbackName = room.roomType === 'DIRECT'
        ? '1:1 대화'
        : room.roomType === 'APPOINTMENT'
            ? '약속방'
            : '그룹 대화';

    return room.displayName?.trim() || room.title?.trim() || fallbackName;
}

function toChatRoomKind(roomType: ApiRoomType): ChatRoom['kind'] {
    if (roomType === 'DIRECT') {
        return 'direct';
    }

    if (roomType === 'APPOINTMENT') {
        return 'appointment';
    }

    return 'group';
}

function toLastMessage(lastMessage: string | null, messageType: ApiMessageType | null) {
    if (lastMessage) {
        return lastMessage;
    }
    if (messageType === 'IMAGE') {
        return '사진';
    }
    return '';
}

function formatTimeLabel(value: string | null) {
    if (!value) {
        return '';
    }

    return new Intl.DateTimeFormat('ko-KR', {
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date(value));
}

function getCurrentMemberId() {
    const token = getAccessToken();

    if (!token) {
        return null;
    }

    try {
        const [, payload = ''] = token.split('.');
        const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
        const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '=');
        const decodedPayload = JSON.parse(window.atob(paddedPayload)) as { sub?: string };
        return decodedPayload.sub ? Number(decodedPayload.sub) : null;
    } catch {
        return null;
    }
}

function createClientMessageId() {
    return window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
