import { type FormEvent, useId, useState } from 'react';

import photoSvg from '@/assets/icons/photo.svg';
import sendSvg from '@/assets/icons/send.svg';
import { InlineSvgIcon } from '@/components/common/inline-svg-icon';

type ChatComposerProps = {
    onSend: (payload: { text: string; imageFile?: File | null }) => Promise<void>;
};

type SelectedAttachment = {
    name: string;
    file: File;
};

export function ChatComposer({ onSend }: ChatComposerProps) {
    const photoInputId = useId();
    const [text, setText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
    const [selectedAttachment, setSelectedAttachment] = useState<SelectedAttachment | null>(null);

    const handleAttachmentChange = (files: FileList | null) => {
        const file = files?.[0];

        if (!file) {
            return;
        }

        setSelectedAttachment({ name: file.name, file });
        setIsAttachmentOpen(false);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSending || (!text.trim() && !selectedAttachment)) {
            return;
        }

        setIsSending(true);
        try {
            await onSend({ text, imageFile: selectedAttachment?.file });
            setText('');
            setSelectedAttachment(null);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <form className="shrink-0 border-t border-relink-card bg-relink-white px-4 py-3" onSubmit={handleSubmit}>
            {isAttachmentOpen ? (
                <div className="mb-3 flex gap-2">
                    <label
                        htmlFor={photoInputId}
                        className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-relink-lavender-soft py-3 font-display text-md text-relink-gray-700"
                    >
                        <InlineSvgIcon svg={photoSvg} className="h-5 w-5" />
                        사진
                    </label>
                </div>
            ) : null}

            {selectedAttachment ? (
                <div className="mb-3 flex items-center justify-between rounded-lg bg-relink-lavender-soft px-3 py-2">
                    <span className="min-w-0 truncate font-display text-sm text-relink-gray-700">
                        사진: {selectedAttachment.name}
                    </span>
                    <button
                        type="button"
                        className="ml-3 shrink-0 font-display text-sm text-relink-lavender-intense"
                        onClick={() => setSelectedAttachment(null)}
                    >
                        제거
                    </button>
                </div>
            ) : null}

            <div className="flex items-center gap-2">
                <input
                    id={photoInputId}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={(event) => handleAttachmentChange(event.currentTarget.files)}
                />

                <button
                    type="button"
                    aria-label="사진 첨부"
                    aria-expanded={isAttachmentOpen}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-relink-lavender-soft font-display text-2xl text-relink-lavender-intense"
                    onClick={() => setIsAttachmentOpen((current) => !current)}
                >
                    +
                </button>
                <input
                    aria-label="메시지"
                    placeholder="메시지 입력"
                    value={text}
                    onChange={(event) => setText(event.currentTarget.value)}
                    className="min-w-0 flex-1 rounded-full bg-relink-lavender-soft px-4 py-3 font-display text-md text-relink-ink outline-none placeholder:text-relink-gray-400"
                />
                <button
                    type="submit"
                    disabled={isSending}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-relink-lavender-intense text-relink-white disabled:opacity-60"
                    aria-label="메시지 보내기"
                >
                    <InlineSvgIcon svg={sendSvg} className="h-5 w-5 [&>svg]:fill-current" />
                </button>
            </div>
        </form>
    );
}
