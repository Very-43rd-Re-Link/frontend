type InviteAcceptanceScreenProps = {
    inviteToken?: string;
};

export function InviteAcceptanceScreen({ inviteToken }: InviteAcceptanceScreenProps) {
    return (
        <main className="flex h-full min-h-0 flex-col bg-relink-white px-8 pt-20 text-center font-display">
            <h1 className="text-2xl text-relink-gray-700">약속 초대를 받았어요</h1>
            <p className="mt-5 text-md leading-6 text-relink-gray-400">
                초대 링크를 통해 약속 후보 시간을 확인하고 참여할 수 있어요.
            </p>

            <section className="mt-10 rounded bg-relink-white px-5 py-8 shadow-relink-card">
                <p className="text-sm text-relink-gray-400">초대 코드</p>
                <p className="mt-2 break-all text-lg text-relink-lavender-intense">{inviteToken}</p>
            </section>

            <button
                type="button"
                className="mt-12 h-[58px] rounded-md bg-relink-lavender-intense text-lg text-relink-white"
            >
                초대 받기
            </button>
        </main>
    );
}
