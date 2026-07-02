import { ChatFilterTabs } from '@/features/chat/components/chat-filter-tabs';

type ChatHeaderProps = {
    onCreateGroup: () => void;
};

export function ChatHeader({ onCreateGroup }: ChatHeaderProps) {
    return (
        <header className="shrink-0 border-b border-relink-card bg-relink-white pt-12 shadow-[0_1px_8px_rgba(205,208,255,0.32)]">
            <div className="flex items-center justify-between gap-4 px-7">
                <h1 className="font-display text-[28px] leading-9 text-relink-gray-700">채팅</h1>
                <button
                    type="button"
                    className="shrink-0 rounded-lg bg-relink-lavender-intense px-3 py-2 font-display text-sm text-relink-white"
                    onClick={onCreateGroup}
                >
                    그룹 만들기
                </button>
            </div>
            <ChatFilterTabs />
        </header>
    );
}
