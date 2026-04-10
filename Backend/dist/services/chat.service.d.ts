interface ChatHistoryItem {
    role: "user" | "assistant";
    content: string;
}
export declare const chatService: {
    getInsights(userId: string): Promise<string[]>;
    ask(userId: string, message: string, history?: ChatHistoryItem[]): Promise<string>;
};
export {};
//# sourceMappingURL=chat.service.d.ts.map