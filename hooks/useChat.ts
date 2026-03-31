import { useContext } from "react";
import { ChatContext } from "../contexts/ChatContext";

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
